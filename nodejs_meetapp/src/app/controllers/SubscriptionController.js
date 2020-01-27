import { Op } from 'sequelize';
// import { format } from 'date-fns';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.vars.userId,
        canceled_at: null,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.gte]: new Date(),
            },
          },
        },
      ],
      order: [[{ model: Meetup, as: 'meetup' }, 'date', 'asc']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (meetup.user_id === req.vars.userId) {
      return res
        .status(400)
        .json({ error: 'Owners can not subscribe on their own meetup' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup has already happened' });
    }

    const existingSubscription = await Subscription.findOne({
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
        },
      ],
      where: {
        user_id: req.vars.userId,
        canceled_at: null,
        [Op.or]: [{ meetup_id: meetup.id }, { '$meetup.date$': meetup.date }],
      },
    });

    if (existingSubscription) {
      if (existingSubscription.meetup_id === meetup.id) {
        return res
          .status(400)
          .json({ error: 'User already subscribed to this meeting' });
      }

      return res.status(400).json({
        error: 'User already subscribed to a meeting on the same time',
      });
    }

    const subscription = await Subscription.create(
      {
        meetup_id: meetup.id,
        user_id: req.vars.userId,
      },
      {
        include: [
          {
            model: Meetup,
            as: 'meetup',
            required: true,
            include: [
              {
                model: User,
                as: 'user',
                required: true,
              },
            ],
          },
          {
            model: User,
            as: 'user',
            required: true,
          },
        ],
      }
    ).then(newSubscription => {
      return newSubscription.reload();
    });

    Queue.add(SubscriptionMail.key, {
      subscription,
    });

    return res.json(subscription);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup has already happened' });
    }

    const existingSubscription = await Subscription.findOne({
      include: [
        {
          model: Meetup,
          as: 'meetup',
          required: true,
        },
      ],
      where: {
        user_id: req.vars.userId,
        canceled_at: null,
        meetup_id: meetup.id,
      },
    });

    if (!existingSubscription) {
      return res
        .status(400)
        .json({ error: 'User not subscribed to this meeting' });
    }

    existingSubscription.canceled_at = new Date();
    await existingSubscription.save();
    return res.json(existingSubscription);
  }
}

export default new SubscriptionController();
