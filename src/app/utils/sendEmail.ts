import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // true for port 465, false for other ports
    auth: {
      user: 'ranam5060@gmail.com',
      pass: 'yrfz kpas lnbf lytg',
    },
  });
  await transporter.sendMail({
    from: 'ranam5060@gmail.com', // sender address
    to: to, // list of receivers
    subject: 'Change Password', // Subject line
    text: 'Reset Link', // plain text body
    html: html, // html body
  });
};
