import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || '',
    host: process.env.MAIL_HOST || '',
    port: Number( process.env.MAIL_PORTS || 0),
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
});
