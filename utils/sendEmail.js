const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT) || 465;

  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"BookMyStay Reservation" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.htmlMessage,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;