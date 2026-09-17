// =========================================
// CADASTRO DE USUÁRIO - INCLUE
// =========================================


// =========================================
// FORMULÁRIO
// =========================================

const formulario =
    document.getElementById("contato-form");


// =========================================
// VERIFICAR SE O FORMULÁRIO EXISTE
// =========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // =================================
            // PEGAR DADOS
            // =================================

            const nomeCampo =
                document.getElementById("nome");

            const usernameCampo =
                document.getElementById("username");

            const emailCampo =
                document.getElementById("email");

            const senhaCampo =
                document.getElementById("senha");


            // =================================
            // VERIFICAR CAMPOS
            // =================================

            if (
                !nomeCampo ||
                !usernameCampo ||
                !emailCampo ||
                !senhaCampo
            ) {

                alert(
                    "Erro: não foi possível encontrar todos os campos do cadastro."
                );

                return;

            }


            // =================================
            // PEGAR VALORES
            // =================================

            const nome =
                nomeCampo.value.trim();


            const username =
                usernameCampo.value.trim();


            const email =
                emailCampo.value.trim();


            const senha =
                senhaCampo.value.trim();


            // =================================
            // VALIDAÇÃO
            // =================================

            if (
                !nome ||
                !username ||
                !email ||
                !senha
            ) {

                alert(
                    "Preencha todos os campos obrigatórios!"
                );

                return;

            }


            // =================================
            // LIMPAR USERNAME
            // =================================

            let usernameLimpo =
                username
                    .toLowerCase()
                    .trim();


            // Remove @ caso a pessoa
            // tenha digitado

            if (
                usernameLimpo.startsWith("@")
            ) {

                usernameLimpo =
                    usernameLimpo.substring(1);

            }


            // =================================
            // VALIDAR USERNAME
            // =================================

            if (
                !/^[a-zA-Z0-9._]+$/.test(
                    usernameLimpo
                )
            ) {

                alert(
                    "O @usuário pode conter apenas letras, números, ponto e underline."
                );

                return;

            }


            // =================================
            // VALIDAR TAMANHO
            // =================================

            if (
                usernameLimpo.length < 3
            ) {

                alert(
                    "O @usuário deve ter pelo menos 3 caracteres."
                );

                return;

            }


            // =================================
            // ENVIAR PARA API
            // =================================

            try {

                const resposta =
                    await fetch(
                        "http://localhost:3000/usuarios",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    nome:
                                        nome,

                                    username:
                                        usernameLimpo,

                                    email:
                                        email,

                                    senha:
                                        senha

                                })
                        }
                    );


                // =================================
                // TENTAR LER RESPOSTA
                // =================================

                let dadosResposta;


                try {

                    dadosResposta =
                        await resposta.json();

                } catch (erro) {

                    dadosResposta = {};

                }


                // =================================
                // VERIFICAR ERRO
                // =================================

                if (!resposta.ok) {

                    alert(
                        dadosResposta.mensagem ||
                        "Não foi possível realizar o cadastro."
                    );

                    return;

                }


                // =================================
                // CADASTRO REALIZADO
                // =================================

                alert(
                    dadosResposta.mensagem ||
                    "Cadastro realizado com sucesso!"
                );


                // =================================
                // IR PARA LOGIN
                // =================================

                window.location.href =
                    "login.html";

            }


            // =================================
            // ERRO DE CONEXÃO
            // =================================

            catch (erro) {

                console.error(
                    "Erro ao conectar com a API:",
                    erro
                );


                alert(
                    "Não foi possível conectar com o servidor. Verifique se a API está funcionando."
                );

            }

        }
    );

}