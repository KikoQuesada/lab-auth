const nodemailer = require('nodemailer');
const app_url = process.env.APP_URL;
const user = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: user,
        password: password
    }
});

module.exports.sendValidationEmail = (email, activationToken, name) =>{
    transport.sendMail({
        to: email,
        from: `<${user}>`,
        subject: 'Please, follow the link to activate your account',
        html: `<h1>Hi ${name}</h1>
        <p>Click on the button below to activate your account ❤️</p>
        <a href="${app_url}/activate?token=${activationToken}" style="padding: 10px 20px; color: white; background-color: pink; border-radius: 5px;">Click here</a>`
    });
};

