const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "KKMART <noreply>",
    to: options.email,
    subject: options.subject,
    text: "Your otp is  " + options.otp,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;