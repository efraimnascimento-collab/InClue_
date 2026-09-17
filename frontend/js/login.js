// =========================================
// LOGIN - INCLUE
// =========================================

const formulario = document.getElementById("contato-form");


// =========================================
// ENVIO DO FORMULÁRIO
// =========================================

formulario.addEventListener("submit", async function (evento) {

    evento.preventDefault();


    // =========================================
    // PEGAR DADOS
    // =========================================

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();


    // =========================================
    // VALIDAÇÃO
    // =========================================

    if (!email || !senha) {

        alert("Preencha todos os campos!");

        return;
    }


    try {

        // =========================================
        // ENVIAR PARA A API
        // =========================================

        const resposta = await fetch(
            "http://localhost:3000/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        // =========================================
        // CONVERTER RESPOSTA PARA JSON
        // =========================================

        const dados = await resposta.json();


        // =========================================
        // LOGIN INVÁLIDO
        // =========================================

        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "E-mail ou senha inválidos."
            );

            return;
        }


        // =========================================
        // LOGIN REALIZADO
        // =========================================

        alert(
            "Bem-vindo, " +
            dados.usuario.nome +
            "!"
        );


        // =========================================
        // SALVAR USUÁRIO
        // =========================================

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados.usuario)
        );


        // =========================================
        // IR PARA A HOME
        // =========================================

        window.location.href = "index.html";


    } catch (erro) {

        console.error(
            "Erro ao conectar com a API:",
            erro
        );

        alert(
            "Não foi possível conectar com o servidor. " +
            "Verifique se o backend está funcionando."
        );

    }

});