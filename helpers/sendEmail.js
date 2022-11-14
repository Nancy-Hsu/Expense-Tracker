const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const { promisify } = require('util')
const fs = require('fs')

const readFile = promisify(fs.readFile)


//宣告發信物件
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
})

const sendMail = async (data) => {
  let emailHtml = await readFile(data.mailFile, 'utf8')

  let template = handlebars.compile(emailHtml)
  let htmlToSend = template(data)

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: data.email,
    subject: data.subject,
    html: htmlToSend
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
  });

}

module.exports = sendMail

