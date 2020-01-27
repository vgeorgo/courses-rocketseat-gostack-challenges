import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO, isBefore } from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const schema = Yup.object().shape({
      page: Yup.number(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Wrong data.' });
    }

    const { date, page = 1 } = req.query;
    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        user_id: req.vars.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Bad request' });
    }

    const { title, description, location, date, banner_id } = req.body;

    /**
     * Check for past dates
     */
    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(400)
        .json({ error: 'Meetup date can not be in the past.' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      user_id: req.vars.userId,
      date,
      banner_id,
    });
    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup does not exist' });
    }

    if (meetup.user_id !== req.vars.userId) {
      return res.status(401).json({ error: 'Only owners can edit meetups' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        error: 'Meetups can only be updated before they happen',
      });
    }

    const { title, description, location, date, banner_id } = req.body;

    /**
     * Check for past dates
     */
    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(400)
        .json({ error: 'Meetup date can not be in the past.' });
    }

    meetup.title = title || meetup.title;
    meetup.description = description || meetup.description;
    meetup.location = location || meetup.location;
    meetup.date = date || meetup.date;
    meetup.banner_id = banner_id || meetup.banner_id;
    await meetup.save();
    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (meetup.user_id !== req.vars.userId) {
      return res.status(401).json({ error: 'Only owners can cancel meetups' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        error: 'Meetups can only be canceled before they happen',
      });
    }

    meetup.canceled_at = new Date();
    await meetup.save();
    return res.json(meetup);
  }
}

export default new MeetupController();
