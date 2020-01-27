import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription } = data;

    await Mail.sendMail({
      to: `${subscription.meetup.user.name} <${subscription.meetup.user.email}>`,
      subject: `New subscription to ${subscription.meetup.title}`,
      template: 'subscription',
      context: {
        owner: subscription.meetup.user.name,
        title: subscription.meetup.title,
        description: subscription.meetup.description,
        user: subscription.user.name,
        date: format(parseISO(subscription.meetup.date), "MMMM dd, H:mm'h'"),
      },
    });
  }
}

export default new SubscriptionMail();
