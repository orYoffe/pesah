const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
let mailTransport;
try {
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

} catch (e) {

}

// Sends an email confirmation when a user changes his mailing list subscription.
// exports.sendEmailConfirmation = functions.database.ref('/users/{uid}').onWrite(event => {
const sendEmailToMe = (req, res) => {
    const mailOptions = {
        from: '"Raise The Bar." <noreply@raisethebar.com>',
        to: req.user.email
    };

    mailOptions.subject = 'I am an email subject';
    mailOptions.text = 'this is the email text field';
    if (mailTransport) {
        return mailTransport.sendMail(mailOptions).then(() => {
            console.log('email sent to:', req.user.email);
            return res.status(200).json({ code: 200, message: 'ok' });
        }).catch(error => {
            console.error('There was an error while sending the email:', error);
            return res.status(400).json({ errorCode: 400, errorMessage: 'no email' });
        });
    } else {
        return res.status(400).json({ errorCode: 400, errorMessage: 'no email configuration' });
    }
};

exports.default = sendEmailToMe;
