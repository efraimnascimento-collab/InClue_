const formulario = document.getElementById("contato-form");
const retorno = document.getElementById("retorno");
const botaoEnviar = formulario.querySelector('button[type="submit"]');

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("contato-nome").value.trim();
    const email = document.getElementById("contato-email").value.trim();
    const mensagem = document.getElementById("mensagem-texto").value.trim();

    if (!nome || !email || !mensagem) {
        retorno.textContent = "Preencha todos os campos.";
        return;
    }

    if (mensagem.length > 5000) {
        retorno.textContent = "A mensagem deve ter no máximo 5.000 caracteres.";
        return;
    }

    retorno.textContent = "";
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";

    try {
        const resposta = await fetch("http://localhost:3000/contato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                mensagem
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível enviar sua mensagem.");
        }

        retorno.textContent = dados.mensagem || "Mensagem enviada com sucesso!";
        formulario.reset();

    } catch (erro) {
        console.error("Erro ao enviar mensagem:", erro);

        retorno.textContent =
            erro.message === "Failed to fetch"
                ? "Não foi possível conectar ao servidor. Tente novamente."
                : erro.message || "Ocorreu um erro ao enviar a mensagem.";

    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = "Enviar mensagem";
    }
});