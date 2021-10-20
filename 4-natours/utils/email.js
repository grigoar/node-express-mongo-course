const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Grigore Nath <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production ') {
      // Send email via SendGrid
      console.log('this is hitting');
      console.log(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    // res.render("")
    //this will render the pug page into a html page in order to pass it to the email
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      //this might be optional and it is better for avoiding spam, and people might prefer text over to formatted html email
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    // await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password token (valid for only 10 minutes)'
    );
  }
};

const sendEmail = async (options) => {
  //1)Create a transporter
  //   console.log(options);
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   // service: 'Gmail',
  //   // auth: {
  //   //   user: process.env.EMAIL_USERNAME,
  //   //   pass: process.env.EMAIL_PASSWORD,
  //   // },
  //   //Activate in gmail "less secure app" option
  //   //this is not good for a production environment because if you send too much mails(>500) then you will be marked as a spammer and that will affect you
  //   //services for mail, "Send grid" , "Mail gun"
  //   //mail trap
  // });
  //   console.log(process.env);
  //2)Define the email options
  // const mailOptions = {
  //   from: 'Grigore Nath <grigore.nath@yahoo.com>',
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  //   //   html:
  // };
  //   console.log(mailOptions);
  //3)Actually send the email
  // await transporter.sendMail(mailOptions);
};

// module.exports = sendEmail;
