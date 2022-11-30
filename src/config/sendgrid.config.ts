import { registerAs } from '@nestjs/config';

export default registerAs('sendgrid', () => ({
  inviteUser: {
    sender: process.env.SENDGRID_INVITE_USER_SENDER,
    templateId: process.env.SENDGRID_INVITE_USER_TEMPLATE_ID,
  },
  offerTalent: {
    sender: process.env.SENDGRID_INVITE_USER_SENDER,
    templateId: process.env.SENDGRID_OFFER_TALENT_TEMPLATE_ID,
  },
  sandboxMode: process.env.SENDGRID_SANDBOX_MODE === 'true',
}));