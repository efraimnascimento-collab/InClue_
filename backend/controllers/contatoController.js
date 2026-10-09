
const { enviarEmail } = require("../services/emailService");

async function enviarContato(req, res) {
    try {
        const nome = typeof req.body.nome === "string"
            ? req.body.nome.trim()
            : "";

        const email = typeof req.body.email === "string"
            ? req.body.email.trim()
            : "";

        const mensagem = typeof req.body.mensagem === "string"
            ? req.body.mensagem.trim()
            : "";

        // Validar os campos
        if (!nome || !email || !mensagem) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        if (
            nome.length > 100 ||
            email.length > 254 ||
            mensagem.length > 5000
        ) {
            return res.status(400).json({
                mensagem: "Verifique o tamanho dos campos preenchidos."
            });
        }

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValido) {
            return res.status(400).json({
                mensagem: "Informe um e-mail válido."
            });
        }

        // Montar o conteúdo do e-mail
        const assunto = "Nova mensagem de contato - InClue";

        const texto = [
            "Nova mensagem recebida pelo formulário de contato do InClue.",
            "",
            `Nome: ${nome}`,
            `E-mail: ${email}`,
            "",
            "Mensagem:",
            mensagem
        ].join("\n");

        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #176b45;">InClue - Contato</h2>

                <p><strong>Nova mensagem recebida pelo site.</strong></p>

                <p><strong>Nome:</strong> ${escaparHtml(nome)}</p>
                <p><strong>E-mail:</strong> ${escaparHtml(email)}</p>

                <p><strong>Mensagem:</strong></p>

                <div style="white-space: pre-wrap;">${escaparHtml(mensagem)}</div>
            </div>
        `;

        // Enviar para o e-mail de suporte configurado no .env
        const destinatario = process.env.SMTP_USER;

        if (!destinatario) {
            throw new Error("SMTP_USER não está configurado.");
        }

        await enviarEmail(
            destinatario,
            assunto,
            texto,
            html,
            { replyTo: email }
        );

        return res.status(200).json({
            mensagem: "Mensagem enviada com sucesso! Obrigado por entrar em contato."
        });

    } catch (erro) {
        console.error("Erro ao enviar mensagem de contato:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde."
        });
    }
}

// Evita que conteúdo digitado pelo usuário seja interpretado como HTML.
function escaparHtml(valor) {
    return valor.replace(/[&<>"']/g, caractere => {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entidades[caractere];
    });
}

module.exports = {
    enviarContato
};