const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: process.env.SMTP_PORT,
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});


async function sendMail(to, subject, text) {
if (!process.env.SMTP_HOST) {
console.log(`Email to ${to}: ${subject}\n${text}`);
return;
}
await transporter.sendMail({ from: process.env.OTP_FROM_EMAIL, to, subject, text });
}


module.exports = { sendMail };