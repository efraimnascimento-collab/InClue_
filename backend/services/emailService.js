
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function testarEmail() {
    await transporter.verify();
    console.log('Servidor de e-mail conectado!');
}

async function enviarEmail(destinatario, assunto, texto, html) {
    return transporter.sendMail({
        from: `"InClue" <${process.env.SMTP_USER}>`,
        to: destinatario,
        subject: assunto,
        text: texto,
        html
    });
}

module.exports = { enviarEmail, testarEmail };

