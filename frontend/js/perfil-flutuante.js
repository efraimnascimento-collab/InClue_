// =========================================
// ÍCONE DE PERFIL FLUTUANTE - INCLUE
// =========================================

const API_URL_PERFIL =
    "http://localhost:3000";


// =========================================
// FOTO PADRÃO DO PERFIL
// =========================================

const FOTO_PADRAO_PERFIL =
    "img/perfil-padrao.png";


// =========================================
// PEGAR USUÁRIO LOGADO
// =========================================

let usuarioPerfil = null;

const usuarioSalvoPerfil =
    localStorage.getItem("usuario");


if (usuarioSalvoPerfil) {

    try {

        usuarioPerfil =
            JSON.parse(usuarioSalvoPerfil);

    } catch (erro) {

        console.error(
            "Erro ao carregar usuário:",
            erro
        );

    }

}


// =========================================
// NÃO ESTÁ LOGADO
// =========================================

if (
    !usuarioPerfil ||
    !usuarioPerfil.id
) {

    console.log(
        "Nenhum usuário logado."
    );

} else {

    criarIconePerfil();

}


// =========================================
// CRIAR ÍCONE
// =========================================

function criarIconePerfil() {

    // Evitar criar duas vezes

    if (
        document.getElementById(
            "perfil-flutuante"
        )
    ) {

        return;

    }


    // =====================================
    // CONTAINER
    // =====================================

    const container =
        document.createElement("div");

    container.id =
        "perfil-flutuante";


    // =====================================
    // BOTÃO
    // =====================================

    const botao =
        document.createElement("button");

    botao.id =
        "botao-perfil-flutuante";

    botao.type =
        "button";


    // =====================================
    // IMAGEM
    // =====================================

    const imagem =
        document.createElement("img");

    imagem.id =
        "imagem-perfil-flutuante";

    imagem.alt =
        "Meu perfil";


    // =====================================
    // ÍCONE PADRÃO
    // =====================================

    const icone =
        document.createElement("div");

    icone.id =
        "icone-padrao-perfil";


    // =====================================
    // MONTAR
    // =====================================

    botao.appendChild(imagem);

    botao.appendChild(icone);

    container.appendChild(botao);

    document.body.appendChild(container);


    // =====================================
    // MOSTRAR FOTO
    // =====================================

    mostrarFotoPerfilFlutuante();


    // =====================================
    // CLICAR
    // =====================================

    botao.addEventListener(
        "click",
        function () {

            window.location.href =
                "perfil.html";

        }
    );

}


// =========================================
// MONTAR CAMINHO DA FOTO
// =========================================

function montarCaminhoFotoFlutuante(foto) {

    if (!foto) {

        return "";

    }


    // URL completa

    if (
        foto.startsWith("http://") ||
        foto.startsWith("https://")
    ) {

        return foto;

    }


    // Caminho vindo do backend

    if (
        foto.startsWith("/")
    ) {

        return (
            API_URL_PERFIL +
            foto
        );

    }


    // Somente nome do arquivo

    return (
        API_URL_PERFIL +
        "/uploads/perfis/" +
        foto
    );

}


// =========================================
// MOSTRAR FOTO
// =========================================

function mostrarFotoPerfilFlutuante() {

    const imagem =
        document.getElementById(
            "imagem-perfil-flutuante"
        );

    const icone =
        document.getElementById(
            "icone-padrao-perfil"
        );


    if (!imagem) {

        return;

    }


    const foto =
        usuarioPerfil.foto_perfil ||
        usuarioPerfil.foto ||
        null;


    // =====================================
    // SEM FOTO
    // MOSTRAR FOTO PADRÃO
    // =====================================

    if (!foto) {

        imagem.src =
            FOTO_PADRAO_PERFIL;

        imagem.alt =
            "Foto padrão do perfil";

        imagem.style.display =
            "block";


        if (icone) {

            icone.style.display =
                "none";

        }


        return;

    }


    // =====================================
    // COM FOTO
    // =====================================

    const caminho =
        montarCaminhoFotoFlutuante(
            foto
        );


    imagem.src =
        caminho;

    imagem.alt =
        "Minha foto de perfil";

    imagem.style.display =
        "block";


    if (icone) {

        icone.style.display =
            "none";

    }


    // =====================================
    // CASO A FOTO NÃO CARREGUE
    // VOLTAR PARA FOTO PADRÃO
    // =====================================

    imagem.onerror =
        function () {

            console.error(
                "Erro ao carregar foto do perfil:",
                caminho
            );


            imagem.onerror =
                null;


            imagem.src =
                FOTO_PADRAO_PERFIL;

            imagem.alt =
                "Foto padrão do perfil";

            imagem.style.display =
                "block";


            if (icone) {

                icone.style.display =
                    "none";

            }

        };

}


// =========================================
// ATUALIZAR FOTO QUANDO USUÁRIO MUDAR
// =========================================

window.addEventListener(
    "storage",
    function (evento) {

        if (
            evento.key !== "usuario"
        ) {

            return;

        }


        if (!evento.newValue) {

            return;

        }


        try {

            usuarioPerfil =
                JSON.parse(
                    evento.newValue
                );

        } catch (erro) {

            console.error(
                "Erro ao atualizar usuário:",
                erro
            );

            return;

        }


        mostrarFotoPerfilFlutuante();

    }
);


// =========================================
// ATUALIZAR AO VOLTAR PARA A PÁGINA
// =========================================

window.addEventListener(
    "pageshow",
    function () {

        const usuarioAtual =
            localStorage.getItem(
                "usuario"
            );


        if (!usuarioAtual) {

            return;

        }


        try {

            usuarioPerfil =
                JSON.parse(
                    usuarioAtual
                );

        } catch (erro) {

            console.error(
                "Erro ao atualizar usuário:",
                erro
            );

            return;

        }


        mostrarFotoPerfilFlutuante();

    }
);