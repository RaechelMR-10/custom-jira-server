var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'localhost',    // MailHog server host
    port: 1025,           // MailHog default SMTP port
    secure: false         // No TLS/SSL required for MailHog
  });
  
const mailOptions = {
    from: '"Raechel" <raechelmarierola@gmail.com>',
    to: 'cjvendicacion@icloud.com',
    subject: 'Hello from MailHog!',
    text: 'This is a test email sent using MailHog and Nodemailer.'
};
  
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(`Error sending email: ${error.message}`);
    }
    console.log(`Email sent: ${info.messageId}`);
  });