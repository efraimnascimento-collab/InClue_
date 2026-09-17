// =========================================
// BANNERS DO HOME
// =========================================

const imagens = [
    "img/banner1.png",
    "img/banner2.png",
    "img/banner3.png",
    "img/banner4.png",
    "img/banner5.png"
];


// =========================================
// ELEMENTOS DO BANNER
// =========================================

const imagemBanner =
    document.getElementById("banner-img");

const botaoAnterior =
    document.getElementById("anterior");

const botaoProximo =
    document.getElementById("proximo");


// =========================================
// ÍNDICE DA IMAGEM
// =========================================

let indiceAtual = 0;


// =========================================
// MOSTRAR IMAGEM
// =========================================

function mostrarBanner(indice) {

    if (!imagemBanner) {
        return;
    }

    imagemBanner.src = imagens[indice];

}


// =========================================
// PRÓXIMO
// =========================================

if (botaoProximo) {

    botaoProximo.addEventListener("click", function () {

        indiceAtual++;

        if (indiceAtual >= imagens.length) {
            indiceAtual = 0;
        }

        mostrarBanner(indiceAtual);

    });

}


// =========================================
// ANTERIOR
// =========================================

if (botaoAnterior) {

    botaoAnterior.addEventListener("click", function () {

        indiceAtual--;

        if (indiceAtual < 0) {
            indiceAtual = imagens.length - 1;
        }

        mostrarBanner(indiceAtual);

    });

}


// =========================================
// INICIAR BANNER
// =========================================

mostrarBanner(indiceAtual);


// =========================================
// TROCA AUTOMÁTICA
// =========================================

setInterval(function () {

    indiceAtual++;

    if (indiceAtual >= imagens.length) {
        indiceAtual = 0;
    }

    mostrarBanner(indiceAtual);

}, 5000);


// =========================================
// LOGIN / USUÁRIO
// =========================================

const usuarioLogado =
    document.getElementById("usuario-logado");

const btnLogin =
    document.getElementById("btn-login");

const btnCadastro =
    document.getElementById("btn-cadastro");

const btnAcessar =
    document.getElementById("btn-acessar");

const btnLogout =
    document.getElementById("logout");


// =========================================
// VERIFICAR USUÁRIO
// =========================================

function verificarUsuario() {

    const usuarioSalvo =
        localStorage.getItem("usuario");


    // =====================================
    // NÃO ESTÁ LOGADO
    // =====================================

    if (!usuarioSalvo) {

        if (btnAcessar) {
            btnAcessar.style.display = "none";
        }

        if (btnLogout) {
            btnLogout.style.display = "none";
        }

        return;
    }


    // =====================================
    // CONVERTER USUÁRIO
    // =====================================

    let usuario;

    try {

        usuario = JSON.parse(usuarioSalvo);

    } catch (erro) {

        usuario = usuarioSalvo;

    }


    // =====================================
    // PEGAR NOME
    // =====================================

    let nome = "Usuário";


    if (typeof usuario === "object" && usuario !== null) {

        nome = usuario.nome || "Usuário";

    } else if (typeof usuario === "string") {

        nome = usuario;

    }


    // =====================================
    // MOSTRAR NOME
    // =====================================

    if (usuarioLogado) {

        usuarioLogado.innerText =
            "Bem-vindo, " + nome + "!";

    }


    // =====================================
    // ESCONDER LOGIN/CADASTRO
    // =====================================

    if (btnLogin) {
        btnLogin.style.display = "none";
    }

    if (btnCadastro) {
        btnCadastro.style.display = "none";
    }


    // =====================================
    // MOSTRAR ACESSIBILIDADE
    // =====================================

    if (btnAcessar) {
        btnAcessar.style.display = "inline-block";
    }


    // =====================================
    // MOSTRAR SAIR
    // =====================================

    if (btnLogout) {
        btnLogout.classList.remove("hidden");
        btnLogout.style.display = "inline-block";
    }

}


// =========================================
// LOGOUT
// =========================================

if (btnLogout) {

    btnLogout.addEventListener("click", function () {

        localStorage.removeItem("usuario");

        window.location.reload();

    });

}


// =========================================
// EXECUTAR
// =========================================

verificarUsuario();