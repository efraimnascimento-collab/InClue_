// =========================================
// AVALIAÇÕES - INCLUE
// =========================================

const API_URL = "http://localhost:3000";

const FOTO_PERFIL_PADRAO =
    "img/perfil-padrao.png";


// =========================================
// ELEMENTOS
// =========================================

const listaAvaliacoes =
    document.getElementById(
        "lista-avaliacoes"
    );

const tituloLocal =
    document.getElementById(
        "titulo-local"
    );

const descricaoLocal =
    document.getElementById(
        "descricao-local"
    );


// =========================================
// USUÁRIO LOGADO
// =========================================

let usuarioLogado = null;

const usuarioSalvo =
    localStorage.getItem(
        "usuario"
    );

if (usuarioSalvo) {

    try {

        usuarioLogado =
            JSON.parse(
                usuarioSalvo
            );

    } catch (erro) {

        console.error(
            "Erro ao ler usuário:",
            erro
        );

    }

}


// =========================================
// LOCAL SELECIONADO
// =========================================

let localSelecionado = null;

const localSalvo =
    localStorage.getItem(
        "localSelecionado"
    );

if (localSalvo) {

    try {

        localSelecionado =
            JSON.parse(
                localSalvo
            );

    } catch (erro) {

        console.error(
            "Erro ao ler local selecionado:",
            erro
        );

        localStorage.removeItem(
            "localSelecionado"
        );

    }

}


// =========================================
// FALLBACK PELO URL
// =========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const localIdURL =
    parametros.get(
        "local_id"
    );

if (
    !localSelecionado &&
    localIdURL
) {

    localSelecionado = {

        id: localIdURL

    };

}


// =========================================
// ESCAPAR HTML
// =========================================

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }

    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// FOTO DE PERFIL
// =========================================

function montarCaminhoFotoPerfil(
    foto
) {

    if (!foto) {

        return FOTO_PERFIL_PADRAO;

    }

    if (
        foto.startsWith(
            "data:image/"
        )
    ) {

        return foto;

    }

    if (
        foto.startsWith(
            "http://"
        ) ||
        foto.startsWith(
            "https://"
        )
    ) {

        return foto;

    }

    if (
        foto.startsWith("/")
    ) {

        return (
            API_URL +
            foto
        );

    }

    return (
        API_URL +
        "/uploads/perfis/" +
        foto
    );

}


function pegarFotoPerfilAvaliacao(
    avaliacao
) {

    const foto =
        avaliacao.foto_perfil ||
        avaliacao.usuario_foto ||
        avaliacao.usuario_foto_perfil ||
        avaliacao.foto_usuario ||
        avaliacao.perfil_foto ||
        null;

    return montarCaminhoFotoPerfil(
        foto
    );

}


// =========================================
// MOSTRAR INFORMAÇÕES DO LOCAL
// =========================================

function mostrarInformacoesLocal() {

    if (!localSelecionado) {

        tituloLocal.innerText =
            "Avaliações da comunidade";

        descricaoLocal.innerText =
            "Veja as experiências compartilhadas por pessoas que visitaram locais turísticos de Salvador.";

        return;

    }

    const nome =
        localSelecionado.nome ||
        "Local selecionado";

    tituloLocal.innerText =
        "Avaliações - " +
        nome;

    descricaoLocal.innerText =
        "Veja as experiências compartilhadas por pessoas que visitaram " +
        nome +
        ".";

}


// =========================================
// CONVERTER ACESSIBILIDADE
// =========================================

function transformarListaAcessibilidade(
    valor
) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return [];

    }

    let dados =
        valor;

    if (
        typeof valor === "string"
    ) {

        try {

            dados =
                JSON.parse(
                    valor
                );

        } catch (erro) {

            return [
                valor
            ];

        }

    }

    if (
        Array.isArray(dados)
    ) {

        return dados
            .filter(
                item =>
                    item !== null &&
                    item !== undefined &&
                    String(item).trim() !== ""
            )
            .map(
                item =>
                    String(item)
            );

    }

    return [
        String(dados)
    ];

}


// =========================================
// CRIAR ÁREA DE ACESSIBILIDADE
// =========================================

function criarAcessibilidadeHTML(
    avaliacao
) {

    const necessidades =
        transformarListaAcessibilidade(
            avaliacao.necessidade_acessibilidade ||
            avaliacao.deficiencias
        );

    const impactos =
        transformarListaAcessibilidade(
            avaliacao.impacto_acessibilidade ||
            avaliacao.impactos
        );


    if (
        necessidades.length === 0 &&
        impactos.length === 0
    ) {

        return "";

    }


    let html = `

        <div class="informacoes-acessibilidade">

    `;


    // =====================================
    // NECESSIDADE
    // =====================================

    if (
        necessidades.length > 0
    ) {

        html += `

            <div class="campo-acessibilidade">

                <strong>
                    Qual necessidade de acessibilidade?
                </strong>

                <div class="tags-acessibilidade">

        `;


        necessidades.forEach(
            item => {

                html += `

                    <span class="tag-acessibilidade tag-necessidade">
                        ${escaparHTML(item)}
                    </span>

                `;

            }
        );


        html += `

                </div>

            </div>

        `;

    }


    // =====================================
    // IMPACTO
    // =====================================

    if (
        impactos.length > 0
    ) {

        html += `

            <div class="campo-acessibilidade">

                <strong>
                    O que afetou a acessibilidade?
                </strong>

                <div class="tags-acessibilidade">

        `;


        impactos.forEach(
            item => {

                html += `

                    <span class="tag-acessibilidade tag-impacto">
                        ${escaparHTML(item)}
                    </span>

                `;

            }
        );


        html += `

                </div>

            </div>

        `;

    }


    html += `

        </div>

    `;


    return html;

}


// =========================================
// BUSCAR AVALIAÇÕES
// =========================================

async function carregarAvaliacoes() {

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


        // =====================================
        // FILTRAR PELO LOCAL
        // =====================================

        let avaliacoesDoLocal =
            avaliacoes;


        if (localSelecionado) {

            avaliacoesDoLocal =
                avaliacoes.filter(
                    avaliacao => {

                        return (
                            Number(
                                avaliacao.local_id
                            ) ===
                            Number(
                                localSelecionado.id
                            )
                        );

                    }
                );

        }


        // =====================================
        // LIMPAR LISTA
        // =====================================

        listaAvaliacoes.innerHTML =
            "";


        // =====================================
        // NENHUMA AVALIAÇÃO
        // =====================================

        if (
            !Array.isArray(
                avaliacoesDoLocal
            ) ||
            avaliacoesDoLocal.length === 0
        ) {

            const nome =
                localSelecionado &&
                localSelecionado.nome
                    ? localSelecionado.nome
                    : "este local";


            listaAvaliacoes.innerHTML = `

                <div class="card">

                    <h3>
                        Ainda não existem avaliações para
                        ${escaparHTML(nome)}.
                    </h3>

                    <p>
                        Seja a primeira pessoa a
                        compartilhar uma experiência!
                    </p>

                </div>

            `;

            return;

        }


        // =====================================
        // CRIAR CARDS
        // =====================================

        avaliacoesDoLocal.forEach(
            avaliacao => {

                criarCardAvaliacao(
                    avaliacao
                );

            }
        );


        criarModalFoto();


    } catch (erro) {

        console.error(
            "Erro ao carregar avaliações:",
            erro
        );


        listaAvaliacoes.innerHTML = `

            <div class="card">

                <h3>
                    Não foi possível carregar
                    as avaliações.
                </h3>

                <p>
                    Verifique se o servidor está
                    funcionando.
                </p>

            </div>

        `;

    }

}


// =========================================
// CRIAR CARD DE AVALIAÇÃO
// =========================================

function criarCardAvaliacao(
    avaliacao
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card card-avaliacao";


    // =====================================
    // NOTA
    // =====================================

    const nota =
        Number(
            avaliacao.nota
        ) || 0;


    const estrelas =
        "★".repeat(
            nota
        ) +
        "☆".repeat(
            Math.max(
                0,
                5 - nota
            )
        );


    // =====================================
    // USUÁRIO
    // =====================================

    const nomeUsuario =
        avaliacao.usuario_nome ||
        avaliacao.nome ||
        "Usuário";


    const username =
        avaliacao.username ||
        avaliacao.usuario_username ||
        avaliacao.usuario_nome_usuario ||
        null;


    const usernameExibicao =
        username
            ? `@${String(username).replace(/^@/, "")}`
            : `@${nomeUsuario
                .toLowerCase()
                .replace(/\s+/g, "")}`;


    // =====================================
    // FOTO DE PERFIL
    // =====================================

    const fotoPerfil =
        pegarFotoPerfilAvaliacao(
            avaliacao
        );


    // =====================================
    // COMENTÁRIO
    // =====================================

    const comentario =
        avaliacao.comentario ||
        "Sem comentário.";


    // =====================================
    // FOTO DA AVALIAÇÃO
    // =====================================

    let imagemFoto =
        "";


    if (
        avaliacao.foto
    ) {

        let urlFoto =
            avaliacao.foto;


        if (
            !urlFoto.startsWith(
                "http://"
            ) &&
            !urlFoto.startsWith(
                "https://"
            )
        ) {

            if (
                urlFoto.startsWith("/")
            ) {

                urlFoto =
                    API_URL +
                    urlFoto;

            } else {

                urlFoto =
                    API_URL +
                    "/" +
                    urlFoto;

            }

        }


        imagemFoto = `

            <div class="foto-avaliacao">

                <img
                    src="${escaparHTML(urlFoto)}"
                    alt="Foto enviada na avaliação"
                    onclick="abrirFoto('${escaparHTML(urlFoto)}')"
                >

            </div>

        `;

    }


    // =====================================
    // ACESSIBILIDADE
    // =====================================

    const acessibilidadeHTML =
        criarAcessibilidadeHTML(
            avaliacao
        );


    // =====================================
    // CARD
    // =====================================

    card.innerHTML = `

        <div class="cabecalho-avaliacao">

            <img
                class="foto-perfil-avaliacao"
                src="${escaparHTML(fotoPerfil)}"
                alt="Foto de perfil de ${escaparHTML(nomeUsuario)}"
                onerror="this.src='${FOTO_PERFIL_PADRAO}'"
            >

            <div class="dados-usuario">

                <strong>
                    ${escaparHTML(nomeUsuario)}
                </strong>

                <span>
                    ${escaparHTML(usernameExibicao)}
                </span>

            </div>

        </div>


        <div class="nota-avaliacao">

            <span>
                ${estrelas}
            </span>

            <span>
                ${nota}/5
            </span>

        </div>


        <div class="comentario-avaliacao">

            ${escaparHTML(comentario)}

        </div>


        ${acessibilidadeHTML}


        ${imagemFoto}


        <div class="acoes-avaliacao">

            <button
                type="button"
                class="botao-curtir"
                id="botao-curtir-${avaliacao.id}"
                onclick="alternarCurtida(${avaliacao.id})"
                aria-label="Curtir avaliação"
            >
                ♡ Curtir
            </button>


            <span
                class="contador-curtidas"
                id="contador-curtidas-${avaliacao.id}"
            >
                0 curtidas
            </span>

        </div>

    `;


    // =====================================
    // EXCLUIR AVALIAÇÃO
    // =====================================

    if (
        usuarioLogado &&
        (
            Number(
                usuarioLogado.id
            ) ===
            Number(
                avaliacao.usuario_id
            ) ||
            usuarioLogado.tipo ===
            "admin" ||
            usuarioLogado.role ===
            "admin"
        )
    ) {

        const botaoExcluir =
            document.createElement(
                "button"
            );


        botaoExcluir.type =
            "button";


        botaoExcluir.className =
            "botao-excluir";


        botaoExcluir.textContent =
            "Excluir avaliação";


        botaoExcluir.addEventListener(
            "click",
            function() {

                excluirAvaliacao(
                    avaliacao.id
                );

            }
        );


        card.appendChild(
            botaoExcluir
        );

    }


    listaAvaliacoes.appendChild(
        card
    );


    carregarEstadoCurtida(
        avaliacao.id
    );

}


// =========================================
// ESTADO DA CURTIDA
// =========================================

async function carregarEstadoCurtida(
    avaliacaoId
) {

    const botao =
        document.getElementById(
            `botao-curtir-${avaliacaoId}`
        );


    const contador =
        document.getElementById(
            `contador-curtidas-${avaliacaoId}`
        );


    if (
        !botao ||
        !contador
    ) {

        return;

    }


    try {

        const usuarioId =
            usuarioLogado
                ? usuarioLogado.id
                : 0;


        const resposta =
            await fetch(

                `${API_URL}/curtidas/${usuarioId}/${avaliacaoId}`

            );


        if (!resposta.ok) {

            return;

        }


        const dados =
            await resposta.json();


        atualizarBotaoCurtida(
            botao,
            dados.curtido
        );


        atualizarContador(
            contador,
            dados.total
        );


    } catch (erro) {

        console.error(
            "Erro ao verificar curtida:",
            erro
        );

    }

}


// =========================================
// ALTERNAR CURTIDA
// =========================================

async function alternarCurtida(
    avaliacaoId
) {

    if (!usuarioLogado) {

        alert(
            "Você precisa fazer login para curtir uma avaliação."
        );


        window.location.href =
            "login.html";


        return;

    }


    const botao =
        document.getElementById(
            `botao-curtir-${avaliacaoId}`
        );


    const contador =
        document.getElementById(
            `contador-curtidas-${avaliacaoId}`
        );


    if (
        !botao ||
        !contador
    ) {

        return;

    }


    const estaCurtido =
        botao.classList.contains(
            "curtido"
        );


    try {

        let resposta;


        if (estaCurtido) {

            resposta =
                await fetch(

                    `${API_URL}/curtidas`,

                    {

                        method: "DELETE",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                usuario_id:
                                    usuarioLogado.id,

                                avaliacao_id:
                                    avaliacaoId

                            })

                    }

                );

        } else {

            resposta =
                await fetch(

                    `${API_URL}/curtidas`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                usuario_id:
                                    usuarioLogado.id,

                                avaliacao_id:
                                    avaliacaoId

                            })

                    }

                );

        }


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível alterar a curtida."
            );

            return;

        }


        atualizarBotaoCurtida(
            botao,
            dados.curtido
        );


        atualizarContador(
            contador,
            dados.total
        );


    } catch (erro) {

        console.error(
            "Erro ao alterar curtida:",
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


// =========================================
// ATUALIZAR BOTÃO DE CURTIDA
// =========================================

function atualizarBotaoCurtida(
    botao,
    curtido
) {

    if (curtido) {

        botao.innerText =
            "♥ Curtido";

        botao.classList.add(
            "curtido"
        );

        botao.setAttribute(
            "aria-label",
            "Descurtir avaliação"
        );

    } else {

        botao.innerText =
            "♡ Curtir";

        botao.classList.remove(
            "curtido"
        );

        botao.setAttribute(
            "aria-label",
            "Curtir avaliação"
        );

    }

}


// =========================================
// CONTADOR DE CURTIDAS
// =========================================

function atualizarContador(
    contador,
    total
) {

    const quantidade =
        Number(total) || 0;


    if (
        quantidade === 1
    ) {

        contador.innerText =
            "1 curtida";

    } else {

        contador.innerText =
            `${quantidade} curtidas`;

    }

}


// =========================================
// MODAL DA FOTO
// =========================================

function criarModalFoto() {

    if (
        document.getElementById(
            "modal-foto"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "modal-foto";


    modal.className =
        "modal-foto";


    modal.innerHTML = `

        <button
            class="fechar-modal-foto"
            onclick="fecharFoto()"
            type="button"
            aria-label="Fechar foto"
        >
            ×
        </button>


        <img
            id="imagem-modal"
            src=""
            alt="Foto ampliada"
        >

    `;


    modal.addEventListener(
        "click",
        function(evento) {

            if (
                evento.target ===
                modal
            ) {

                fecharFoto();

            }

        }
    );


    document.body.appendChild(
        modal
    );

}


// =========================================
// ABRIR FOTO
// =========================================

function abrirFoto(
    url
) {

    let modal =
        document.getElementById(
            "modal-foto"
        );


    let imagem =
        document.getElementById(
            "imagem-modal"
        );


    if (
        !modal ||
        !imagem
    ) {

        criarModalFoto();


        modal =
            document.getElementById(
                "modal-foto"
            );


        imagem =
            document.getElementById(
                "imagem-modal"
            );

    }


    if (
        !modal ||
        !imagem
    ) {

        return;

    }


    imagem.src =
        url;


    modal.classList.add(
        "ativo"
    );

}


// =========================================
// FECHAR FOTO
// =========================================

function fecharFoto() {

    const modal =
        document.getElementById(
            "modal-foto"
        );


    const imagem =
        document.getElementById(
            "imagem-modal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "ativo"
    );


    if (imagem) {

        imagem.src =
            "";

    }

}


// =========================================
// EXCLUIR AVALIAÇÃO
// =========================================

async function excluirAvaliacao(
    id
) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir esta avaliação?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(

                `${API_URL}/avaliacoes/${id}`,

                {

                    method: "DELETE"

                }

            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Não foi possível excluir a avaliação."
            );

            return;

        }


        alert(
            "Avaliação excluída com sucesso!"
        );


        carregarAvaliacoes();


    } catch (erro) {

        console.error(
            "Erro ao excluir avaliação:",
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


// =========================================
// INICIAR
// =========================================

mostrarInformacoesLocal();

carregarAvaliacoes();