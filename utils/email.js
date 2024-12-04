const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email),
      (this.firstName = user.name.split(" ")[0]),
      (this.url = url),
      (this.from = `Mohamed Nashaat ${process.env.EMAIL_FROM}`);
  }
  createTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  send(template, subject) {
    const mailOptions = {
      from: "Mohamed Nashaat",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  }
};

const sendEmail = async (options) => {
  // 1) Create a transporter
  // 2) Define the email options

  const mailOptions = {
    from: "Mohamed Nashaat",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
