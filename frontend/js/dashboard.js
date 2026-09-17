// =========================================
// DASHBOARD - INCLUE
// LOCAIS TURÍSTICOS ACESSÍVEIS DE SALVADOR
// =========================================


// =========================================
// VERIFICAR LOGIN
// =========================================

const usuarioSalvo = localStorage.getItem("usuario");

if (!usuarioSalvo) {

    alert("Faça login para acessar o InClue.");

    window.location.href = "login.html";

}


// =========================================
// RECUPERAR USUÁRIO
// =========================================

let usuario = null;

try {

    usuario = JSON.parse(usuarioSalvo);

} catch (erro) {

    console.error(
        "Erro ao recuperar usuário:",
        erro
    );

    localStorage.removeItem("usuario");

    window.location.href = "login.html";

}


// =========================================
// SAUDAÇÃO
// =========================================

if (usuario) {

    document.getElementById(
        "saudacao"
    ).textContent =
        `Olá, ${usuario.nome}! Bem-vindo ao InClue.`;

}


// =========================================
// BUSCAR LOCAIS
// =========================================

async function carregarLocais() {

    const lista =
        document.getElementById("lista-locais");

    try {

        const resposta = await fetch(
            "http://localhost:3000/locais"
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar locais."
            );

        }


        const locais = await resposta.json();


        lista.innerHTML = "";


        // =====================================
        // NENHUM LOCAL
        // =====================================

        if (locais.length === 0) {

            lista.innerHTML = `
                <div class="card">

                    <h3>
                        Nenhum local cadastrado
                    </h3>

                    <p>
                        Ainda não existem locais
                        turísticos cadastrados no InClue.
                    </p>

                </div>
            `;

            return;

        }


        // =====================================
        // MOSTRAR LOCAIS
        // =====================================

        locais.forEach(local => {

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                ${
                    local.imagem
                    ?
                    `<img
                        src="${local.imagem}"
                        alt="${local.nome}"
                    >`
                    :
                    ""
                }

                <h2>
                    ${local.nome}
                </h2>

                <p>
                    <strong>📍 Localização:</strong>
                    ${local.endereco || "Não informado"}
                </p>

                <p>
                    <strong>🏙️ Cidade:</strong>
                    ${local.cidade || "Salvador"}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${local.categoria || "Turismo"}
                </p>

                <p>
                    ${local.descricao || ""}
                </p>

                <p>
                    <strong>
                        ♿ Acessibilidade:
                    </strong>
                </p>

                <p>
                    ${local.acessibilidade || "Não informado"}
                </p>

            `;


            lista.appendChild(card);

        });

    } catch (erro) {

        console.error(erro);

        lista.innerHTML = `

            <div class="card">

                <h3>
                    Não foi possível carregar os locais.
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
// BUSCAR AVALIAÇÕES
// =========================================

async function carregarAvaliacoes() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/avaliacoes"
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar avaliações."
            );

        }


        const avaliacoes =
            await resposta.json();


        document.getElementById(
            "total-avaliacoes"
        ).textContent =
            `${avaliacoes.length} avaliação(ões) cadastrada(s).`;

    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "total-avaliacoes"
        ).textContent =
            "Não foi possível carregar as avaliações.";

    }

}


// =========================================
// BOTÃO SAIR
// =========================================

document.getElementById(
    "btn-sair"
).addEventListener(
    "click",
    function () {

        localStorage.removeItem("usuario");

        alert(
            "Você saiu da sua conta."
        );

        window.location.href =
            "login.html";

    }
);


// =========================================
// INICIAR DASHBOARD
// =========================================

carregarLocais();

carregarAvaliacoes();