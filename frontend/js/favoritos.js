// =========================================
// FAVORITOS - INCLUE
// =========================================


// =========================================
// VERIFICAR USUÁRIO
// =========================================

const usuarioSalvo =
    localStorage.getItem("usuario");


if (!usuarioSalvo) {

    alert(
        "Você precisa fazer login para ver seus favoritos."
    );

    window.location.href =
        "login.html";

}


// =========================================
// RECUPERAR USUÁRIO
// =========================================

let usuario;

try {

    usuario =
        JSON.parse(usuarioSalvo);

} catch (erro) {

    localStorage.removeItem("usuario");

    alert(
        "Sessão inválida. Faça login novamente."
    );

    window.location.href =
        "login.html";

}


// =========================================
// ELEMENTO DA LISTA
// =========================================

const listaFavoritos =
    document.getElementById(
        "lista-favoritos"
    );


// =========================================
// CARREGAR FAVORITOS
// =========================================

async function carregarFavoritos() {

    try {

        const resposta = await fetch(

            `http://localhost:3000/usuarios/${usuario.id}/favoritos`

        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar favoritos."
            );

        }


        const favoritos =
            await resposta.json();


        listaFavoritos.innerHTML = "";


        // =====================================
        // NENHUM FAVORITO
        // =====================================

        if (
            !Array.isArray(favoritos) ||
            favoritos.length === 0
        ) {

            listaFavoritos.innerHTML = `

                <div class="card">

                    <h3>
                        Você ainda não tem favoritos. ❤️
                    </h3>

                    <p>
                        Explore os locais turísticos
                        acessíveis de Salvador e
                        salve seus preferidos!
                    </p>

                </div>

            `;

            return;

        }


        // =====================================
        // MOSTRAR FAVORITOS
        // =====================================

        favoritos.forEach(favorito => {

            const card =
                document.createElement("div");


            card.className =
                "card";


            card.innerHTML = `

                <h2>
                    ❤️ ${favorito.local_nome}
                </h2>

                <p>

                    <strong>
                        📍 Cidade:
                    </strong>

                    ${favorito.cidade || "Salvador"}

                </p>

                <p>

                    ${favorito.descricao ||
                    "Informações sobre este local."}

                </p>


                <button
                    class="btn"
                    onclick="removerFavorito(${favorito.local_id})"
                >

                    Remover dos favoritos

                </button>

            `;


            listaFavoritos.appendChild(card);

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar favoritos:",
            erro
        );


        listaFavoritos.innerHTML = `

            <div class="card">

                <h3>
                    Não foi possível carregar
                    seus favoritos.
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
// REMOVER FAVORITO
// =========================================

async function removerFavorito(localId) {

    const confirmar =
        confirm(
            "Deseja remover este local dos favoritos?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta = await fetch(
            "http://localhost:3000/favoritos",
            {

                method: "DELETE",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    usuario_id:
                        usuario.id,

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


        alert(
            "Local removido dos favoritos."
        );


        carregarFavoritos();


    } catch (erro) {

        console.error(
            "Erro:",
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

carregarFavoritos();