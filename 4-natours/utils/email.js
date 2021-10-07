const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1)Create a transporter
  //   console.log(options);
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    //Activate in gmail "less secure app" option
    //this is not good for a production environment because if you send too much mails(>500) then you will be marked as a spammer and that will affect you
    //services for mail, "Send grid" , "Mail gun"
    //mail trap
  });

  //   console.log(process.env);
  //2)Define the email options
  const mailOptions = {
    from: 'Grigore Nath <grigore.nath@yahoo.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //   html:
  };
  //   console.log(mailOptions);
  //3)Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
