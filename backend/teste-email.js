
require('dotenv').config();
const { enviarEmail, testarEmail } = require('./services/emailService');

async function iniciarTeste() {
    try {
        await testarEmail();

        await enviarEmail(
            process.env.SMTP_USER,
            'Teste de e-mail - InClue',
            'Se você recebeu esta mensagem, o envio de e-mails está funcionando!',
            `
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="color: #176b45;">InClue 💚</h2>
                    <p>O envio de e-mails foi configurado.</p>
                    <p>Agora podemos implementar a recuperação de senha.</p>
                </div>
            `
        );

        console.log('E-mail de teste enviado!');
    } catch (erro) {
        console.error('Falha no teste de e-mail:', erro.message);
    }
}

iniciarTeste();
