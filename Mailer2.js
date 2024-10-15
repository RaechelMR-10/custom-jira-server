const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alorchelmarie@gmail.com',
        pass: '.6Maribelfelix6.60.' 
    }
});

const mailOptions = {
    from: '"Raechel" <alorchelmarie@gmail.com>',
    to: 'cjvendicacion@icloud.com',
    subject: 'Hello from Nodemailer!',
    text: 'This is a test email sent using Nodemailer with Gmail.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error(`Error sending email: ${error.message}`);
    }
    console.log(`Email sent: ${info.messageId}`);
});
