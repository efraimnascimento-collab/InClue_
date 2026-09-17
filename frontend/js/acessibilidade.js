// =========================================
// ACESSIBILIDADE - INCLUE
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const pesquisa =
    document.getElementById(
        "pesquisa"
    );


const listaLocais =
    document.getElementById(
        "lista-locais"
    );


const filtroCategoria =
    document.getElementById(
        "filtro-categoria"
    );


const mapa =
    document.getElementById(
        "mapa-local"
    );


const imagem =
    document.getElementById(
        "imagem-local"
    );


const nomeLocal =
    document.getElementById(
        "nome-local"
    );


const categoriaLocal =
    document.getElementById(
        "categoria-local"
    );


const enderecoLocal =
    document.getElementById(
        "endereco-local"
    );


const cidadeLocal =
    document.getElementById(
        "cidade-local"
    );


const descricaoLocal =
    document.getElementById(
        "descricao"
    );


const acessibilidadeLocal =
    document.getElementById(
        "acessibilidade-local"
    );


const botaoFavorito =
    document.getElementById(
        "botao-favorito"
    );


const botaoAvaliacoes =
    document.getElementById(
        "botao-avaliacoes"
    );


const botaoAvaliar =
    document.getElementById(
        "botao-avaliar"
    );


// =========================================
// VARIÁVEIS
// =========================================

let locais = [];

let localAtual = null;


// =========================================
// LOCAIS QUE NÃO DEVEM TER IMAGEM PRÓPRIA
// =========================================
//
// Esses três locais são tratados como
// duplicados de outros pontos já cadastrados.
//
// Por isso NÃO precisamos dos arquivos:
//
// igreja-do-senhor-do-bonfim.png
// forte-de-santo-antonio-da-barra.png
// casa-de-jorge-amado.png
//
// =========================================

const locaisSemImagemPropria = [

    "igreja do senhor do bonfim",

    "forte de santo antonio da barra",

    "casa de jorge amado"

];


// =========================================
// CONVERTER NOME EM NOME DE ARQUIVO
// =========================================

function transformarNomeEmArquivo(
    nome
) {

    if (!nome) {

        return "";

    }


    return nome

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""
        )

        + ".png";

}


// =========================================
// OBTER IMAGEM DO LOCAL
// =========================================

function obterImagemLocal(
    local
) {

    if (!local) {

        return null;

    }


    const nomeNormalizado =
        (local.nome || "")
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();


    // =====================================
    // LOCAIS SEM IMAGEM PRÓPRIA
    // =====================================

    if (
        locaisSemImagemPropria.includes(
            nomeNormalizado
        )
    ) {

        return null;

    }


    // =====================================
    // IMAGEM CADASTRADA NO BANCO
    // =====================================

    if (
        local.imagem &&
        local.imagem.trim() !== ""
    ) {

        let caminho =
            local.imagem.trim();


        // Caminho completo

        if (
            caminho.startsWith(
                "http://"
            ) ||

            caminho.startsWith(
                "https://"
            ) ||

            caminho.startsWith("/")
        ) {

            return caminho;

        }


        // Caminho contendo pasta

        if (
            caminho.includes("/")
        ) {

            return caminho;

        }


        return (
            "img/locais/" +
            caminho
        );

    }


    // =====================================
    // IMAGEM AUTOMÁTICA PELO NOME
    // =====================================

    const nomeArquivo =
        transformarNomeEmArquivo(
            local.nome
        );


    if (!nomeArquivo) {

        return null;

    }


    return (
        "img/locais/" +
        nomeArquivo
    );

}


// =========================================
// IMAGEM PADRÃO
// =========================================

function mostrarImagemPadrao() {

    if (!imagem) {

        return;

    }


    imagem.onerror =
        null;


    imagem.src =
        "img/inclue.png";


    imagem.alt =
        "InClue";


    imagem.classList.add(
        "imagem-inclue"
    );

}


// =========================================
// IMAGEM DO LOCAL
// =========================================

function mostrarImagemLocal(
    local
) {

    if (
        !imagem ||
        !local
    ) {

        return;

    }


    const caminhoImagem =
        obterImagemLocal(
            local
        );


    if (!caminhoImagem) {

        mostrarImagemPadrao();

        return;

    }


    imagem.onerror =
        function() {

            console.warn(
                "Imagem não encontrada:",
                caminhoImagem
            );


            mostrarImagemPadrao();

        };


    imagem.src =
        caminhoImagem;


    imagem.alt =
        "Imagem de " +
        (
            local.nome ||
            "local"
        );


    imagem.classList.remove(
        "imagem-inclue"
    );

}


// =========================================
// ADICIONAR FORTE DE SÃO MARCELO
// =========================================
//
// IMPORTANTE:
// Se ele já estiver no MySQL,
// não será duplicado.
//
// Se ainda não estiver no banco,
// ele aparece no catálogo.
//
// Para favoritos/avaliações,
// o ideal é depois cadastrar
// oficialmente no MySQL.
//
// =========================================

function adicionarForteSaoMarcelo() {

    const existe =
        locais.some(
            local => {

                const nome =
                    (
                        local.nome ||
                        ""
                    )
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .toLowerCase()
                    .trim();


                return (
                    nome ===
                    "forte de sao marcelo"
                );

            }
        );


    if (existe) {

        return;

    }


    locais.push({

        id:
            "forte-sao-marcelo",

        nome:
            "Forte de São Marcelo",

        categoria:
            "História",

        endereco:
            "Baía de Todos-os-Santos, Salvador - BA",

        cidade:
            "Salvador",

        descricao:
            "Fortificação histórica localizada na Baía de Todos-os-Santos, conhecida como Forte de São Marcelo.",

        acessibilidade:
            "Verifique as condições de acessibilidade antes da visita."

    });

}


// =========================================
// CARREGAR CATEGORIAS
// =========================================

function carregarCategorias() {

    if (!filtroCategoria) {

        return;

    }


    // Limpar opções

    filtroCategoria.innerHTML = `

        <option value="">
            Todas as categorias
        </option>

    `;


    const categorias =
        locais

            .map(
                local =>
                    (
                        local.categoria ||
                        ""
                    ).trim()
            )

            .filter(
                categoria =>
                    categoria !== ""
            );


    // Remover duplicadas

    const categoriasUnicas =
        [
            ...new Set(
                categorias
            )
        ];


    // Ordenar

    categoriasUnicas.sort(
        (a, b) =>
            a.localeCompare(
                b,
                "pt-BR"
            )
    );


    // Criar opções

    categoriasUnicas.forEach(
        categoria => {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                categoria;


            opcao.textContent =
                categoria;


            filtroCategoria.appendChild(
                opcao
            );

        }
    );

}


// =========================================
// CARREGAR LOCAIS
// =========================================

async function carregarLocais() {

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/locais"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar locais."
            );

        }


        locais =
            await resposta.json();


        if (!Array.isArray(locais)) {

            locais = [];

        }


        // =====================================
        // ADICIONAR FORTE DE SÃO MARCELO
        // =====================================

        adicionarForteSaoMarcelo();


        // =====================================
        // CARREGAR CATEGORIAS
        // =====================================

        carregarCategorias();


        // =====================================
        // LIMPAR LISTA
        // =====================================

        listaLocais.innerHTML =
            "";


        listaLocais.classList.remove(
            "aberta"
        );


        // =====================================
        // IMAGEM PADRÃO
        // =====================================

        mostrarImagemPadrao();


        // =====================================
        // NENHUM LOCAL
        // =====================================

        if (
            locais.length === 0
        ) {

            listaLocais.innerHTML = `

                <p class="nenhum-resultado">
                    Nenhum local cadastrado.
                </p>

            `;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar locais:",
            erro
        );


        listaLocais.innerHTML = `

            <div class="card">

                <h3>
                    Não foi possível carregar os locais.
                </h3>

                <p>
                    Verifique se o servidor está funcionando.
                </p>

            </div>

        `;

    }

}


// =========================================
// MOSTRAR LISTA DE LOCAIS
// =========================================

function mostrarListaLocais(
    locaisParaMostrar
) {

    listaLocais.innerHTML =
        "";


    if (
        !locaisParaMostrar ||
        locaisParaMostrar.length === 0
    ) {

        listaLocais.innerHTML = `

            <p class="nenhum-resultado">
                Nenhum local encontrado.
            </p>

        `;


        listaLocais.classList.add(
            "aberta"
        );


        return;

    }


    // =====================================
    // CRIAR CARDS
    // =====================================

    locaisParaMostrar.forEach(
        local => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card local-card";


            card.innerHTML = `

                <h3>
                    📍 ${
                        local.nome ||
                        "Local sem nome"
                    }
                </h3>

                <p>
                    🏙️ ${
                        local.cidade ||
                        "Salvador"
                    }
                </p>

                <span
                    class="categoria-filtro"
                >
                    🏷️ ${
                        local.categoria ||
                        "Ponto turístico"
                    }
                </span>

            `;


            // =================================
            // CLICAR NO LOCAL
            // =================================

            card.addEventListener(
                "click",
                function() {

                    selecionarLocal(
                        local
                    );


                    pesquisa.value =
                        local.nome ||
                        "";


                    listaLocais.classList.remove(
                        "aberta"
                    );

                }
            );


            listaLocais.appendChild(
                card
            );

        }
    );


    listaLocais.classList.add(
        "aberta"
    );

}


// =========================================
// SELECIONAR LOCAL
// =========================================

function selecionarLocal(
    local
) {

    if (!local) {

        return;

    }


    localAtual =
        local;


    // =====================================
    // NOME
    // =====================================

    nomeLocal.innerText =
        local.nome ||
        "Local sem nome";


    // =====================================
    // CATEGORIA
    // =====================================

    categoriaLocal.innerText =
        local.categoria
            ? "🏷️ " +
              local.categoria
            : "";


    // =====================================
    // ENDEREÇO
    // =====================================

    enderecoLocal.innerText =
        local.endereco ||
        "Endereço não informado";


    // =====================================
    // CIDADE
    // =====================================

    cidadeLocal.innerText =
        local.cidade ||
        "Cidade não informada";


    // =====================================
    // DESCRIÇÃO
    // =====================================

    descricaoLocal.innerText =
        local.descricao ||
        "Nenhuma descrição cadastrada.";


    // =====================================
    // ACESSIBILIDADE
    // =====================================

    mostrarAcessibilidade(
        local.acessibilidade
    );


    // =====================================
    // IMAGEM
    // =====================================

    mostrarImagemLocal(
        local
    );


    // =====================================
    // MAPA
    // =====================================

    const enderecoMapa =
        encodeURIComponent(

            (
                local.nome ||
                ""
            ) +

            " " +

            (
                local.endereco ||
                ""
            ) +

            " " +

            (
                local.cidade ||
                "Salvador"
            )

        );


    mapa.src =
        `https://www.google.com/maps?q=${enderecoMapa}&output=embed`;


    // =====================================
    // ATIVAR BOTÕES
    // =====================================

    botaoFavorito.disabled =
        false;


    botaoAvaliacoes.disabled =
        false;


    botaoAvaliar.disabled =
        false;


    // =====================================
    // VERIFICAR FAVORITO
    // =====================================

    verificarFavorito();

}


// =========================================
// MOSTRAR ACESSIBILIDADE
// =========================================

function mostrarAcessibilidade(
    texto
) {

    if (!texto) {

        acessibilidadeLocal.innerHTML = `

            <p>
                Nenhuma informação de
                acessibilidade cadastrada.
            </p>

        `;

        return;

    }


    const recursos =
        texto

            .split(
                /[,;\n]/
            )

            .map(
                item =>
                    item.trim()
            )

            .filter(
                item =>
                    item
            );


    if (
        recursos.length === 0
    ) {

        acessibilidadeLocal.innerText =
            texto;

        return;

    }


    const lista =
        document.createElement(
            "ul"
        );


    recursos.forEach(
        recurso => {

            const item =
                document.createElement(
                    "li"
                );


            item.innerText =
                "✔ " + recurso;


            lista.appendChild(
                item
            );

        }
    );


    acessibilidadeLocal.innerHTML =
        "";


    acessibilidadeLocal.appendChild(
        lista
    );

}


// =========================================
// ABRIR PESQUISA
// =========================================

pesquisa.addEventListener(
    "focus",
    function() {

        pesquisarLocais();

    }
);


// =========================================
// PESQUISAR ENQUANTO DIGITA
// =========================================

pesquisa.addEventListener(
    "input",
    function() {

        pesquisarLocais();

    }
);


// =========================================
// FILTRO DE CATEGORIA
// =========================================

filtroCategoria.addEventListener(
    "change",
    function() {

        pesquisarLocais();

    }
);


// =========================================
// FUNÇÃO DE PESQUISA + FILTRO
// =========================================

function pesquisarLocais() {

    const termo =
        pesquisa.value
            .toLowerCase()
            .trim();


    const categoriaSelecionada =
        filtroCategoria.value
            .toLowerCase()
            .trim();


    // =====================================
    // FILTRAR LOCAIS
    // =====================================

    const resultados =
        locais.filter(
            local => {

                const nome =
                    (
                        local.nome ||
                        ""
                    )
                    .toLowerCase();


                const cidade =
                    (
                        local.cidade ||
                        ""
                    )
                    .toLowerCase();


                const categoria =
                    (
                        local.categoria ||
                        ""
                    )
                    .toLowerCase();


                const endereco =
                    (
                        local.endereco ||
                        ""
                    )
                    .toLowerCase();


                const descricao =
                    (
                        local.descricao ||
                        ""
                    )
                    .toLowerCase();


                // =================================
                // PESQUISA
                // =================================

                const correspondePesquisa =

                    !termo ||

                    nome.includes(
                        termo
                    ) ||

                    cidade.includes(
                        termo
                    ) ||

                    categoria.includes(
                        termo
                    ) ||

                    endereco.includes(
                        termo
                    ) ||

                    descricao.includes(
                        termo
                    );


                // =================================
                // CATEGORIA
                // =================================

                const correspondeCategoria =

                    !categoriaSelecionada ||

                    categoria ===
                    categoriaSelecionada;


                return (

                    correspondePesquisa &&

                    correspondeCategoria

                );

            }
        );


    // =====================================
    // MOSTRAR RESULTADOS
    // =====================================

    mostrarListaLocais(
        resultados
    );

}


// =========================================
// FECHAR LISTA AO CLICAR FORA
// =========================================

document.addEventListener(
    "click",
    function(evento) {

        const clicouNaPesquisa =
            pesquisa.contains(
                evento.target
            );


        const clicouNaLista =
            listaLocais.contains(
                evento.target
            );


        const clicouNoFiltro =
            filtroCategoria.contains(
                evento.target
            );


        if (
            !clicouNaPesquisa &&
            !clicouNaLista &&
            !clicouNoFiltro
        ) {

            listaLocais.classList.remove(
                "aberta"
            );

        }

    }
);


// =========================================
// VERIFICAR FAVORITO
// =========================================

async function verificarFavorito() {

    if (!localAtual) {

        return;

    }


    // =====================================
    // FORTE DE SÃO MARCELO VIRTUAL
    // =====================================

    if (
        typeof localAtual.id ===
        "string"
    ) {

        botaoFavorito.innerText =
            "♡ Favoritar";

        botaoFavorito.classList.remove(
            "favoritado"
        );

        return;

    }


    const usuarioSalvo =
        localStorage.getItem(
            "usuario"
        );


    if (!usuarioSalvo) {

        botaoFavorito.innerText =
            "♡ Favoritar";


        botaoFavorito.classList.remove(
            "favoritado"
        );


        return;

    }


    try {

        const usuario =
            JSON.parse(
                usuarioSalvo
            );


        const resposta =
            await fetch(

                `http://localhost:3000/favoritos/${usuario.id}/${localAtual.id}`

            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao verificar favorito."
            );

        }


        const dados =
            await resposta.json();


        if (
            dados.favorito
        ) {

            botaoFavorito.innerText =
                "❤️ Favoritado";


            botaoFavorito.classList.add(
                "favoritado"
            );

        } else {

            botaoFavorito.innerText =
                "♡ Favoritar";


            botaoFavorito.classList.remove(
                "favoritado"
            );

        }


    } catch (erro) {

        console.error(
            "Erro ao verificar favorito:",
            erro
        );

    }

}


// =========================================
// FAVORITAR / DESFAVORITAR
// =========================================

async function alternarFavorito() {

    if (!localAtual) {

        alert(
            "Selecione um local primeiro."
        );

        return;

    }


    // =====================================
    // FORTE DE SÃO MARCELO AINDA NÃO ESTÁ
    // NO BANCO
    // =====================================

    if (
        typeof localAtual.id ===
        "string"
    ) {

        alert(
            "O Forte de São Marcelo ainda precisa ser cadastrado no banco de dados para utilizar favoritos."
        );

        return;

    }


    const usuarioSalvo =
        localStorage.getItem(
            "usuario"
        );


    if (!usuarioSalvo) {

        alert(
            "Você precisa estar logado para favoritar um local."
        );


        window.location.href =
            "login.html";


        return;

    }


    let usuario;


    try {

        usuario =
            JSON.parse(
                usuarioSalvo
            );

    } catch (erro) {

        alert(
            "Sessão inválida. Faça login novamente."
        );


        localStorage.removeItem(
            "usuario"
        );


        window.location.href =
            "login.html";


        return;

    }


    try {

        const estaFavoritado =
            botaoFavorito.classList.contains(
                "favoritado"
            );


        // =====================================
        // REMOVER FAVORITO
        // =====================================

        if (
            estaFavoritado
        ) {

            const resposta =
                await fetch(

                    "http://localhost:3000/favoritos",

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
                                    usuario.id,

                                local_id:
                                    localAtual.id

                            })

                    }

                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                alert(
                    dados.mensagem ||
                    "Erro ao remover favorito."
                );

                return;

            }


            botaoFavorito.innerText =
                "♡ Favoritar";


            botaoFavorito.classList.remove(
                "favoritado"
            );


            return;

        }


        // =====================================
        // ADICIONAR FAVORITO
        // =====================================

        const resposta =
            await fetch(

                "http://localhost:3000/favoritos",

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            usuario_id:
                                usuario.id,

                            local_id:
                                localAtual.id

                        })

                }

            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Erro ao adicionar favorito."
            );

            return;

        }


        botaoFavorito.innerText =
            "❤️ Favoritado";


        botaoFavorito.classList.add(
            "favoritado"
        );


    } catch (erro) {

        console.error(
            "Erro ao alterar favorito:",
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

}


// =========================================
// VER AVALIAÇÕES
// =========================================

botaoAvaliacoes.addEventListener(
    "click",
    function() {

        if (!localAtual) {

            alert(
                "Selecione um local primeiro."
            );

            return;

        }


        localStorage.setItem(
            "localSelecionado",
            JSON.stringify(
                localAtual
            )
        );


        window.location.href =
            "avaliacoes.html";

    }
);


// =========================================
// FAZER AVALIAÇÃO
// =========================================

botaoAvaliar.addEventListener(
    "click",
    function() {

        const usuarioSalvo =
            localStorage.getItem(
                "usuario"
            );


        if (!usuarioSalvo) {

            alert(
                "Você precisa fazer login para avaliar um local."
            );


            window.location.href =
                "login.html";


            return;

        }


        if (!localAtual) {

            alert(
                "Selecione um local primeiro."
            );

            return;

        }


        localStorage.setItem(
            "localSelecionado",
            JSON.stringify(
                localAtual
            )
        );


        window.location.href =
            "avaliar.html";

    }
);


// =========================================
// BOTÃO FAVORITO
// =========================================

botaoFavorito.addEventListener(
    "click",
    alternarFavorito
);


// =========================================
// INICIAR
// =========================================

mostrarImagemPadrao();

carregarLocais();