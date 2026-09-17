// =========================================
// PERFIL - INCLUE
// =========================================

const API_URL = "http://localhost:3000";

const FOTO_PADRAO = "img/perfil-padrao.png";


// =========================================
// USUÁRIO LOGADO
// =========================================

let usuarioLogado = null;

const usuarioSalvo =
    localStorage.getItem("usuario");

if (usuarioSalvo) {

    try {

        usuarioLogado =
            JSON.parse(usuarioSalvo);

    } catch (erro) {

        console.error(
            "Erro ao ler usuário:",
            erro
        );

    }

}


// =========================================
// VERIFICAR LOGIN
// =========================================

if (!usuarioLogado || !usuarioLogado.id) {

    alert(
        "Você precisa estar logado para acessar seu perfil."
    );

    window.location.href =
        "login.html";

}


// =========================================
// ELEMENTOS
// =========================================

const btnEditar =
    document.getElementById(
        "btn-editar-perfil"
    );

const modalEditar =
    document.getElementById(
        "modal-editar"
    );

const fecharModal =
    document.getElementById(
        "fechar-modal"
    );

const btnCancelar =
    document.getElementById(
        "btn-cancelar-edicao"
    );

const btnAlterarFoto =
    document.getElementById(
        "btn-alterar-foto"
    );

const inputFoto =
    document.getElementById(
        "input-foto"
    );

const btnSalvar =
    document.getElementById(
        "btn-salvar-edicao"
    );


// =========================================
// EVENTOS
// =========================================

if (btnEditar) {

    btnEditar.addEventListener(
        "click",
        abrirEditarPerfil
    );

}


if (fecharModal) {

    fecharModal.addEventListener(
        "click",
        fecharEditarPerfil
    );

}


if (btnCancelar) {

    btnCancelar.addEventListener(
        "click",
        fecharEditarPerfil
    );

}


if (btnAlterarFoto) {

    btnAlterarFoto.addEventListener(
        "click",
        function () {

            if (inputFoto) {

                inputFoto.click();

            }

        }
    );

}


if (btnSalvar) {

    btnSalvar.addEventListener(
        "click",
        salvarAlteracoes
    );

}


if (modalEditar) {

    modalEditar.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === modalEditar
            ) {

                fecharEditarPerfil();

            }

        }
    );

}


// =========================================
// ABRIR MODAL
// =========================================

function abrirEditarPerfil() {

    if (!modalEditar) {

        return;

    }


    const campoNome =
        document.getElementById(
            "editar-nome"
        );

    const campoUsername =
        document.getElementById(
            "editar-username"
        );


    if (campoNome) {

        campoNome.value =
            usuarioLogado.nome || "";

    }


    if (campoUsername) {

        campoUsername.value =
            usuarioLogado.username || "";

    }


    // Mostrar foto atual

    mostrarFotoPreview(
        usuarioLogado.foto_perfil ||
        usuarioLogado.foto ||
        null
    );


    modalEditar.classList.add(
        "ativo"
    );

}


// =========================================
// FECHAR MODAL
// =========================================

function fecharEditarPerfil() {

    if (!modalEditar) {

        return;

    }

    modalEditar.classList.remove(
        "ativo"
    );

}


// =========================================
// FOTO - PREVIEW
// =========================================

if (inputFoto) {

    inputFoto.addEventListener(
        "change",
        function () {

            const arquivo =
                inputFoto.files[0];

            if (!arquivo) {

                return;

            }


            // =================================
            // TIPOS PERMITIDOS
            // =================================

            const tiposPermitidos = [

                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp"

            ];


            if (
                !tiposPermitidos.includes(
                    arquivo.type
                )
            ) {

                alert(
                    "Escolha uma imagem JPG, JPEG, PNG ou WEBP."
                );

                inputFoto.value = "";

                return;

            }


            // =================================
            // TAMANHO
            // =================================

            if (
                arquivo.size >
                5 * 1024 * 1024
            ) {

                alert(
                    "A imagem deve ter no máximo 5 MB."
                );

                inputFoto.value = "";

                return;

            }


            // =================================
            // PREVIEW
            // =================================

            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {

                    const preview =
                        document.getElementById(
                            "preview-foto"
                        );


                    if (preview) {

                        preview.src =
                            evento.target.result;

                        preview.style.display =
                            "block";

                    }

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


// =========================================
// MOSTRAR FOTO PREVIEW
// =========================================

function mostrarFotoPreview(foto) {

    const imagem =
        document.getElementById(
            "preview-foto"
        );


    if (!imagem) {

        return;

    }


    // =====================================
    // SEM FOTO
    // =====================================

    if (!foto) {

        imagem.src =
            FOTO_PADRAO;

        imagem.style.display =
            "block";

        return;

    }


    // =====================================
    // COM FOTO
    // =====================================

    const caminho =
        montarCaminhoFoto(foto);


    imagem.src =
        caminho;


    imagem.style.display =
        "block";


    // =====================================
    // ERRO
    // =====================================

    imagem.onerror =
        function () {

            console.warn(
                "Foto não carregou. Usando foto padrão."
            );

            imagem.onerror =
                null;

            imagem.src =
                FOTO_PADRAO;

        };

}


// =========================================
// MONTAR CAMINHO DA FOTO
// =========================================

function montarCaminhoFoto(foto) {

    if (!foto) {

        return FOTO_PADRAO;

    }


    // =====================================
    // URL COMPLETA
    // =====================================

    if (
        foto.startsWith("http://") ||
        foto.startsWith("https://")
    ) {

        return foto;

    }


    // =====================================
    // CAMINHO DO BACKEND
    // =====================================

    if (
        foto.startsWith("/")
    ) {

        return `${API_URL}${foto}`;

    }


    // =====================================
    // SOMENTE NOME DO ARQUIVO
    // =====================================

    return `${API_URL}/uploads/perfis/${foto}`;

}


// =========================================
// CARREGAR PERFIL
// =========================================

async function carregarPerfil() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/usuarios/${usuarioLogado.id}/perfil`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar perfil."
            );

        }


        const perfil =
            await resposta.json();


        console.log(
            "Perfil recebido:",
            perfil
        );


        // =====================================
        // USERNAME
        // =====================================

        const usernameElemento =
            document.getElementById(
                "username-usuario"
            );


        if (usernameElemento) {

            usernameElemento.textContent =
                perfil.username
                    ? `@${perfil.username}`
                    : "@usuario";

        }


        // =====================================
        // NOME
        // =====================================

        const nomeElemento =
            document.getElementById(
                "nome-usuario"
            );


        if (nomeElemento) {

            nomeElemento.textContent =
                perfil.nome ||
                "Usuário";

        }


        // =====================================
        // EMAIL
        // =====================================

        const emailElemento =
            document.getElementById(
                "email-usuario"
            );


        if (emailElemento) {

            emailElemento.textContent =
                perfil.email ||
                "";

        }


        // =====================================
        // FOTO
        // =====================================

        mostrarFotoPerfil(
            perfil.foto_perfil ||
            perfil.foto ||
            null
        );


        // =====================================
        // ATUALIZAR LOCALSTORAGE
        // =====================================

        usuarioLogado.id =
            perfil.id;

        usuarioLogado.nome =
            perfil.nome;

        usuarioLogado.username =
            perfil.username;

        usuarioLogado.email =
            perfil.email;

        usuarioLogado.tipo =
            perfil.tipo;

        usuarioLogado.foto_perfil =
            perfil.foto_perfil ||
            null;


        usuarioLogado.foto =
            perfil.foto_perfil ||
            null;


        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuarioLogado
            )
        );


        // =====================================
        // CONTEÚDOS
        // =====================================

        await carregarMinhasAvaliacoes();

        await carregarCurtidas();

        await carregarFavoritos();


    } catch (erro) {

        console.error(
            "Erro ao carregar perfil:",
            erro
        );


        const nomeElemento =
            document.getElementById(
                "nome-usuario"
            );


        if (nomeElemento) {

            nomeElemento.textContent =
                "Erro ao carregar perfil.";

        }


        // Mesmo se a API falhar,
        // mostra a foto padrão

        mostrarFotoPerfil(null);

    }

}


// =========================================
// MOSTRAR FOTO DE PERFIL
// =========================================

function mostrarFotoPerfil(foto) {

    const imagem =
        document.getElementById(
            "foto-usuario"
        );


    if (!imagem) {

        return;

    }


    // =====================================
    // SEM FOTO
    // =====================================

    if (!foto) {

        imagem.src =
            FOTO_PADRAO;

        imagem.style.display =
            "block";

        imagem.onerror =
            null;

        return;

    }


    // =====================================
    // FOTO DO USUÁRIO
    // =====================================

    const caminho =
        montarCaminhoFoto(foto);


    imagem.src =
        caminho;


    imagem.style.display =
        "block";


    // =====================================
    // SE DER ERRO
    // =====================================

    imagem.onerror =
        function () {

            console.warn(
                "Não foi possível carregar a foto do usuário."
            );


            imagem.onerror =
                null;


            imagem.src =
                FOTO_PADRAO;


            imagem.style.display =
                "block";

        };

}


// =========================================
// SALVAR ALTERAÇÕES
// =========================================

async function salvarAlteracoes() {

    const campoNome =
        document.getElementById(
            "editar-nome"
        );

    const campoUsername =
        document.getElementById(
            "editar-username"
        );


    if (
        !campoNome ||
        !campoUsername
    ) {

        return;

    }


    const nome =
        campoNome.value.trim();


    let username =
        campoUsername.value
            .trim()
            .toLowerCase();


    // =====================================
    // VALIDAR NOME
    // =====================================

    if (!nome) {

        alert(
            "Digite seu nome."
        );

        return;

    }


    // =====================================
    // REMOVER @
    // =====================================

    if (
        username.startsWith("@")
    ) {

        username =
            username.substring(1);

    }


    // =====================================
    // VALIDAR USERNAME
    // =====================================

    if (!username) {

        alert(
            "Digite seu @usuário."
        );

        return;

    }


    const usernameValido =
        /^[a-zA-Z0-9._]+$/.test(
            username
        );


    if (!usernameValido) {

        alert(
            "O @usuário pode conter apenas letras, números, ponto e underline."
        );

        return;

    }


    try {

        btnSalvar.disabled =
            true;

        btnSalvar.textContent =
            "Salvando...";


        // =================================
        // ATUALIZAR NOME E USERNAME
        // =================================

        const resposta =
            await fetch(
                `${API_URL}/usuarios/${usuarioLogado.id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        nome:
                            nome,

                        username:
                            username

                    })

                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível salvar as alterações."
            );

            return;

        }


        // =================================
        // ATUALIZAR LOCALSTORAGE
        // =================================

        usuarioLogado.nome =
            nome;

        usuarioLogado.username =
            username;


        if (dados.usuario) {

            usuarioLogado.foto_perfil =
                dados.usuario.foto_perfil ||
                usuarioLogado.foto_perfil ||
                null;

        }


        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuarioLogado
            )
        );


        // =================================
        // ATUALIZAR PÁGINA
        // =================================

        const usernameElemento =
            document.getElementById(
                "username-usuario"
            );


        if (usernameElemento) {

            usernameElemento.textContent =
                `@${username}`;

        }


        const nomeElemento =
            document.getElementById(
                "nome-usuario"
            );


        if (nomeElemento) {

            nomeElemento.textContent =
                nome;

        }


        alert(
            "Perfil atualizado com sucesso!"
        );


        fecharEditarPerfil();


    } catch (erro) {

        console.error(
            "Erro ao atualizar perfil:",
            erro
        );


        alert(
            "Não foi possível conectar com o servidor."
        );


    } finally {

        btnSalvar.disabled =
            false;

        btnSalvar.textContent =
            "Salvar alterações";

    }

}


// =========================================
// SALVAR FOTO
// =========================================

async function salvarFotoPerfil() {

    if (
        !inputFoto ||
        !inputFoto.files[0]
    ) {

        return true;

    }


    const arquivo =
        inputFoto.files[0];


    try {

        const formulario =
            new FormData();


        formulario.append(
            "foto",
            arquivo
        );


        const resposta =
            await fetch(
                `${API_URL}/usuarios/${usuarioLogado.id}/foto`,
                {

                    method: "POST",

                    body:
                        formulario

                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível atualizar a foto."
            );

            return false;

        }


        console.log(
            "Resposta atualização foto:",
            dados
        );


        // =================================
        // USUÁRIO ATUALIZADO
        // =================================

        if (dados.usuario) {

            usuarioLogado =
                {
                    ...usuarioLogado,
                    ...dados.usuario
                };

        }


        // =================================
        // GARANTIR FOTO
        // =================================

        usuarioLogado.foto_perfil =
            (
                dados.usuario &&
                dados.usuario.foto_perfil
            ) ||
            null;


        usuarioLogado.foto =
            usuarioLogado.foto_perfil ||
            null;


        // =================================
        // SALVAR LOCALSTORAGE
        // =================================

        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuarioLogado
            )
        );


        // =================================
        // MOSTRAR FOTO
        // =================================

        mostrarFotoPerfil(
            usuarioLogado.foto_perfil
        );


        // Atualizar preview

        mostrarFotoPreview(
            usuarioLogado.foto_perfil
        );


        return true;


    } catch (erro) {

        console.error(
            "Erro ao atualizar foto:",
            erro
        );


        alert(
            "Não foi possível conectar com o servidor."
        );


        return false;

    }

}


// =========================================
// CARREGAR MINHAS AVALIAÇÕES
// =========================================

async function carregarMinhasAvaliacoes() {

    const lista =
        document.getElementById(
            "lista-minhas-avaliacoes"
        );


    if (!lista) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/avaliacoes`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar avaliações."
            );

        }


        const avaliacoes =
            await resposta.json();


        const minhasAvaliacoes =
            avaliacoes.filter(
                avaliacao =>
                    Number(
                        avaliacao.usuario_id
                    ) ===
                    Number(
                        usuarioLogado.id
                    )
            );


        // =====================================
        // CONTADOR
        // =====================================

        const contador =
            document.getElementById(
                "total-avaliacoes"
            );


        if (contador) {

            contador.textContent =
                minhasAvaliacoes.length;

        }


        lista.innerHTML = "";


        // =====================================
        // NENHUMA
        // =====================================

        if (
            minhasAvaliacoes.length === 0
        ) {

            lista.innerHTML = `

                <div class="post">

                    <p>
                        Você ainda não fez nenhuma avaliação.
                    </p>

                    <br>

                    <a
                        href="avaliar.html"
                        class="btn-editar"
                    >
                        Fazer avaliação
                    </a>

                </div>

            `;

            return;

        }


        // =====================================
        // MOSTRAR
        // =====================================

        minhasAvaliacoes.forEach(
            avaliacao => {

                const post =
                    document.createElement(
                        "div"
                    );


                post.className =
                    "post";


                const nota =
                    Number(
                        avaliacao.nota
                    ) || 0;


                const estrelas =
                    "⭐".repeat(nota);


                const username =
                    usuarioLogado.username ||
                    "usuario";


                post.innerHTML = `

                    <div class="post-cabecalho">

                        <strong>
                            @${username}
                        </strong>

                        <span>
                            ${usuarioLogado.nome || ""}
                        </span>

                    </div>


                    <p class="post-local">

                        📍
                        ${avaliacao.local_nome || "Local"}

                    </p>


                    <div class="post-estrelas">

                        ${estrelas}

                    </div>


                    <p class="post-comentario">

                        ${avaliacao.comentario || "Sem comentário."}

                    </p>


                    <div class="post-acoes">

                        ❤️

                        <span>
                            Curtidas
                        </span>

                    </div>

                `;


                lista.appendChild(
                    post
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );


        lista.innerHTML = `

            <div class="post">

                <p>
                    Não foi possível carregar suas avaliações.
                </p>

            </div>

        `;

    }

}


// =========================================
// CARREGAR CURTIDAS
// =========================================

async function carregarCurtidas() {

    const lista =
        document.getElementById(
            "lista-curtidas"
        );


    if (!lista) {

        return;

    }


    try {

        console.log(
            "Buscando curtidas do usuário:",
            usuarioLogado.id
        );


        const resposta =
            await fetch(
                `${API_URL}/curtidas/usuario/${usuarioLogado.id}`
            );


        console.log(
            "Status curtidas:",
            resposta.status
        );


        if (!resposta.ok) {

            const erroTexto =
                await resposta.text();


            console.error(
                "Resposta de erro das curtidas:",
                erroTexto
            );


            throw new Error(
                `Erro HTTP ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        let curtidas = [];


        if (Array.isArray(dados)) {

            curtidas =
                dados;

        } else if (
            dados &&
            Array.isArray(
                dados.curtidas
            )
        ) {

            curtidas =
                dados.curtidas;

        }


        // =====================================
        // CONTADOR
        // =====================================

        const contador =
            document.getElementById(
                "total-curtidas"
            );


        if (contador) {

            contador.textContent =
                curtidas.length;

        }


        lista.innerHTML = "";


        // =====================================
        // NENHUMA
        // =====================================

        if (
            curtidas.length === 0
        ) {

            lista.innerHTML = `

                <div class="post">

                    <p>
                        Você ainda não curtiu nenhuma avaliação.
                    </p>

                    <br>

                    <a
                        href="avaliacoes.html"
                        class="btn-editar"
                    >
                        Explorar avaliações
                    </a>

                </div>

            `;

            return;

        }


        // =====================================
        // MOSTRAR
        // =====================================

        curtidas.forEach(
            avaliacao => {

                const post =
                    document.createElement(
                        "div"
                    );


                post.className =
                    "post";


                const nota =
                    Number(
                        avaliacao.nota
                    ) || 0;


                const estrelas =
                    "⭐".repeat(nota);


                post.innerHTML = `

                    <div class="post-cabecalho">

                        <strong>
                            Avaliação
                        </strong>

                    </div>


                    <p class="post-local">

                        📍
                        ${avaliacao.local_nome || "Local"}

                    </p>


                    <div class="post-estrelas">

                        ${estrelas}

                    </div>


                    <p class="post-comentario">

                        ${avaliacao.comentario || "Sem comentário."}

                    </p>


                    <div class="post-acoes">

                        ❤️

                        <span>
                            Você curtiu esta avaliação
                        </span>

                    </div>

                `;


                lista.appendChild(
                    post
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar curtidas:",
            erro
        );


        lista.innerHTML = `

            <div class="post">

                <p>
                    Não foi possível carregar suas curtidas.
                </p>

            </div>

        `;


        const contador =
            document.getElementById(
                "total-curtidas"
            );


        if (contador) {

            contador.textContent =
                "0";

        }

    }

}


// =========================================
// CARREGAR FAVORITOS
// =========================================

async function carregarFavoritos() {

    const lista =
        document.getElementById(
            "lista-favoritos"
        );


    if (!lista) {

        return;

    }


    const contador =
        document.getElementById(
            "total-favoritos"
        );


    lista.innerHTML = `

        <div class="post">

            <p>
                Carregando seus favoritos...
            </p>

        </div>

    `;


    try {

        const resposta =
            await fetch(
                `${API_URL}/usuarios/${usuarioLogado.id}/favoritos`
            );


        if (!resposta.ok) {

            const textoErro =
                await resposta.text();


            console.error(
                "Erro retornado pelo servidor:",
                textoErro
            );


            throw new Error(
                `Erro HTTP ${resposta.status}`
            );

        }


        const favoritos =
            await resposta.json();


        let listaFavoritos = [];


        if (
            Array.isArray(
                favoritos
            )
        ) {

            listaFavoritos =
                favoritos;

        } else if (
            favoritos &&
            Array.isArray(
                favoritos.favoritos
            )
        ) {

            listaFavoritos =
                favoritos.favoritos;

        }


        // =====================================
        // CONTADOR
        // =====================================

        if (contador) {

            contador.textContent =
                listaFavoritos.length;

        }


        lista.innerHTML = "";


        // =====================================
        // NENHUM FAVORITO
        // =====================================

        if (
            listaFavoritos.length === 0
        ) {

            lista.innerHTML = `

                <div class="post">

                    <h3>
                        Você ainda não tem favoritos ❤️
                    </h3>

                    <p>
                        Os locais que você salvar
                        como favoritos aparecerão aqui.
                    </p>

                    <br>

                    <a
                        href="avaliacoes.html"
                        class="btn-editar"
                    >
                        Explorar locais
                    </a>

                </div>

            `;

            return;

        }


        // =====================================
        // MOSTRAR FAVORITOS
        // =====================================

        listaFavoritos.forEach(
            favorito => {

                const post =
                    document.createElement(
                        "div"
                    );


                post.className =
                    "post";


                // =================================
                // IMAGEM
                // =================================

                let imagemHTML =
                    "";


                if (
                    favorito.imagem
                ) {

                    let caminhoImagem =
                        favorito.imagem;


                    if (
                        !caminhoImagem.startsWith(
                            "http://"
                        ) &&
                        !caminhoImagem.startsWith(
                            "https://"
                        )
                    ) {

                        if (
                            caminhoImagem.startsWith(
                                "/"
                            )
                        ) {

                            caminhoImagem =
                                `${API_URL}${caminhoImagem}`;

                        } else {

                            caminhoImagem =
                                `${API_URL}/${caminhoImagem}`;

                        }

                    }


                    imagemHTML = `

                        <img
                            src="${caminhoImagem}"
                            alt="${favorito.local_nome || "Local"}"
                            class="post-imagem"
                            onerror="this.style.display='none'"
                        >

                    `;

                }


                // =================================
                // CARD
                // =================================

                post.innerHTML = `

                    ${imagemHTML}

                    <div class="post-cabecalho">

                        <strong>
                            ❤️ ${favorito.local_nome || "Local"}
                        </strong>

                    </div>


                    <p class="post-local">

                        📍
                        ${favorito.cidade || "Salvador"}

                    </p>


                    <p class="post-comentario">

                        ${
                            favorito.descricao ||
                            "Informações sobre este local."
                        }

                    </p>


                    <div class="post-acoes">

                        <button
                            class="btn-remover-favorito"
                            data-local-id="${favorito.local_id}"
                        >
                            💔 Remover dos favoritos
                        </button>

                    </div>

                `;


                const botaoRemover =
                    post.querySelector(
                        ".btn-remover-favorito"
                    );


                if (botaoRemover) {

                    botaoRemover.addEventListener(
                        "click",
                        function () {

                            removerFavoritoPerfil(
                                favorito.local_id
                            );

                        }
                    );

                }


                lista.appendChild(
                    post
                );

            }
        );


    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR FAVORITOS:",
            erro
        );


        if (contador) {

            contador.textContent =
                "0";

        }


        lista.innerHTML = `

            <div class="post">

                <h3>
                    Não foi possível carregar seus favoritos.
                </h3>

                <p>
                    Verifique se o servidor está funcionando.
                </p>

                <br>

                <button
                    class="btn-editar"
                    onclick="carregarFavoritos()"
                >
                    Tentar novamente
                </button>

            </div>

        `;

    }

}


// =========================================
// REMOVER FAVORITO
// =========================================

async function removerFavoritoPerfil(
    localId
) {

    const confirmar =
        confirm(
            "Deseja remover este local dos favoritos?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/favoritos`,
                {

                    method:
                        "DELETE",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            usuario_id:
                                usuarioLogado.id,

                            local_id:
                                localId

                        })

                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível remover o favorito."
            );

            return;

        }


        await carregarFavoritos();


    } catch (erro) {

        console.error(
            "ERRO AO REMOVER FAVORITO:",
            erro
        );


        alert(
            "Não foi possível conectar com o servidor."
        );

    }

}


// =========================================
// ABAS
// =========================================

document
    .querySelectorAll(".aba")
    .forEach(
        botao => {

            botao.addEventListener(
                "click",
                function () {

                    const aba =
                        this.dataset.aba;

                    mostrarAba(aba);

                }
            );

        }
    );


// =========================================
// MOSTRAR ABA
// =========================================

function mostrarAba(aba) {

    document
        .querySelectorAll(".aba")
        .forEach(
            botao => {

                botao.classList.remove(
                    "ativa"
                );

            }
        );


    document
        .querySelectorAll(
            ".conteudo-aba"
        )
        .forEach(
            conteudo => {

                conteudo.classList.remove(
                    "ativa"
                );

            }
        );


    const botaoAtivo =
        document.querySelector(
            `.aba[data-aba="${aba}"]`
        );


    if (botaoAtivo) {

        botaoAtivo.classList.add(
            "ativa"
        );

    }


    const conteudo =
        document.getElementById(
            `aba-${aba}`
        );


    if (conteudo) {

        conteudo.classList.add(
            "ativa"
        );

    }

}


// =========================================
// SALVAR FOTO QUANDO ESCOLHER
// =========================================

if (inputFoto) {

    inputFoto.addEventListener(
        "change",
        async function () {

            if (
                !inputFoto.files[0]
            ) {

                return;

            }


            const sucesso =
                await salvarFotoPerfil();


            if (sucesso) {

                alert(
                    "Foto de perfil atualizada com sucesso!"
                );


                inputFoto.value = "";

            }

        }
    );

}


// =========================================
// INICIAR
// =========================================

if (usuarioLogado) {

    carregarPerfil();

}