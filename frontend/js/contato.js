// =========================================
// CONTATO - INCLUE
// =========================================

const formulario =
    document.getElementById(
        "contato-form"
    );

const retorno =
    document.getElementById(
        "retorno"
    );


// =========================================
// ENVIO DO FORMULÁRIO
// =========================================

formulario.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        // =====================================
        // PEGAR DADOS
        // =====================================

        const nome =
            document
                .getElementById(
                    "contato-nome"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "contato-email"
                )
                .value
                .trim();


        const mensagem =
            document
                .getElementById(
                    "mensagem-texto"
                )
                .value
                .trim();


        // =====================================
        // VALIDAR
        // =====================================

        if (
            !nome ||
            !email ||
            !mensagem
        ) {

            retorno.innerText =
                "Preencha todos os campos.";

            return;

        }


        // =====================================
        // CRIAR ASSUNTO
        // =====================================

        const assunto =
            encodeURIComponent(
                "Contato pelo site InClue"
            );


        // =====================================
        // CRIAR CORPO DO E-MAIL
        // =====================================

        const corpo =
            encodeURIComponent(

                `Olá, equipe InClue!

Nome: ${nome}

E-mail: ${email}

Mensagem:

${mensagem}

--------------------------------
Mensagem enviada pelo site InClue.
`

            );


        // =====================================
        // ABRIR E-MAIL
        // =====================================

        const endereco =
            `mailto:inclue.suporte@gmail.com?subject=${assunto}&body=${corpo}`;


        window.location.href =
            endereco;


        // =====================================
        // MENSAGEM
        // =====================================

        retorno.innerText =
            "Abrindo seu aplicativo de e-mail...";


        // =====================================
        // LIMPAR FORMULÁRIO
        // =====================================

        formulario.reset();

    }
);