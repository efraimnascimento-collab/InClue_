// =========================================
// AVALIAR - INCLUE
// =========================================


// =========================================
// ELEMENTOS
// =========================================

const formulario =
    document.getElementById(
        "avaliacao-form"
    );


const selectLocal =
    document.getElementById(
        "local_id"
    );


// =========================================
// USUÁRIO LOGADO
// =========================================

const usuarioSalvo =
    localStorage.getItem(
        "usuario"
    );


// =========================================
// DROPDOWNS
// =========================================

const btnDeficiencias =
    document.getElementById(
        "btn-deficiencias"
    );


const menuDeficiencias =
    document.getElementById(
        "menu-deficiencias"
    );


const btnImpactos =
    document.getElementById(
        "btn-impactos"
    );


const menuImpactos =
    document.getElementById(
        "menu-impactos"
    );


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


        const locais =
            await resposta.json();


        locais.forEach(
            local => {

                const opcao =
                    document.createElement(
                        "option"
                    );


                opcao.value =
                    local.id;


                opcao.textContent =
                    local.nome;


                selectLocal.appendChild(
                    opcao
                );

            }
        );


        // =================================
        // RECUPERAR LOCAL SALVO
        // =================================

        const localSalvo =
            localStorage.getItem(
                "localSelecionado"
            );


        if (localSalvo) {

            try {

                const localSelecionado =
                    JSON.parse(
                        localSalvo
                    );


                if (
                    localSelecionado &&
                    localSelecionado.id
                ) {

                    selectLocal.value =
                        localSelecionado.id;

                }

            } catch (erro) {

                console.error(
                    "Erro ao recuperar local:",
                    erro
                );

            }

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar locais:",
            erro
        );


        alert(
            "Não foi possível carregar os locais."
        );

    }

}


// =========================================
// DROPDOWN GENÉRICO
// =========================================

function configurarDropdown(
    botao,
    menu
) {

    if (!botao || !menu) {

        return;

    }


    botao.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            const estaAberto =
                !menu.hasAttribute(
                    "hidden"
                );


            fecharTodosDropdowns();


            if (!estaAberto) {

                menu.removeAttribute(
                    "hidden"
                );


                menu.style.display =
                    "block";


                botao.classList.add(
                    "aberto"
                );


                botao.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        }
    );

}


// =========================================
// FECHAR DROPDOWNS
// =========================================

function fecharTodosDropdowns() {

    const menus = [

        menuDeficiencias,

        menuImpactos

    ];


    const botoes = [

        btnDeficiencias,

        btnImpactos

    ];


    menus.forEach(
        menu => {

            if (menu) {

                menu.setAttribute(
                    "hidden",
                    ""
                );


                menu.style.display =
                    "none";

            }

        }
    );


    botoes.forEach(
        botao => {

            if (botao) {

                botao.classList.remove(
                    "aberto"
                );


                botao.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// =========================================
// CLIQUE FORA
// =========================================

document.addEventListener(
    "click",
    function() {

        fecharTodosDropdowns();

    }
);


// =========================================
// IMPEDIR FECHAMENTO AO CLICAR DENTRO
// =========================================

if (menuDeficiencias) {

    menuDeficiencias.addEventListener(
        "click",
        function(evento) {

            evento.stopPropagation();

        }
    );

}


if (menuImpactos) {

    menuImpactos.addEventListener(
        "click",
        function(evento) {

            evento.stopPropagation();

        }
    );

}


// =========================================
// OBTER CHECKBOXES
// =========================================

function obterSelecionados(
    nome
) {

    return Array.from(

        document.querySelectorAll(
            `input[name="${nome}"]:checked`
        )

    ).map(

        checkbox =>
            checkbox.value

    );

}


// =========================================
// ATUALIZAR TEXTO DO BOTÃO
// =========================================

function atualizarBotaoSelecao(
    botao,
    nome,
    textoPadrao,
    icone
) {

    if (!botao) {

        return;

    }


    const texto =
        botao.querySelector(
            "span:first-child"
        );


    if (!texto) {

        return;

    }


    const selecionados =
        obterSelecionados(
            nome
        );


    if (
        selecionados.length === 0
    ) {

        texto.textContent =
            `${icone} ${textoPadrao}`;

        return;

    }


    if (
        selecionados.length === 1
    ) {

        texto.textContent =
            `${icone} ${selecionados[0]}`;

        return;

    }


    texto.textContent =
        `${icone} ${selecionados[0]} +${selecionados.length - 1}`;

}


// =========================================
// CHECKBOXES DE DEFICIÊNCIA
// =========================================

const checkboxesDeficiencia =
    document.querySelectorAll(
        'input[name="deficiencia"]'
    );


checkboxesDeficiencia.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            function() {

                atualizarBotaoSelecao(

                    btnDeficiencias,

                    "deficiencia",

                    "Selecione uma ou mais opções",

                    "♿"

                );

            }
        );

    }
);


// =========================================
// CHECKBOXES DE IMPACTO
// =========================================

const checkboxesImpacto =
    document.querySelectorAll(
        'input[name="impacto"]'
    );


checkboxesImpacto.forEach(
    checkbox => {

        checkbox.addEventListener(
            "change",
            function() {

                atualizarBotaoSelecao(

                    btnImpactos,

                    "impacto",

                    "Selecione os impactos encontrados",

                    "⚠️"

                );

            }
        );

    }
);


// =========================================
// LIMPAR DEFICIÊNCIAS
// =========================================

const limparDeficiencias =
    document.getElementById(
        "limpar-deficiencias"
    );


if (limparDeficiencias) {

    limparDeficiencias.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            checkboxesDeficiencia.forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );


            atualizarBotaoSelecao(

                btnDeficiencias,

                "deficiencia",

                "Selecione uma ou mais opções",

                "♿"

            );

        }
    );

}


// =========================================
// CONCLUIR DEFICIÊNCIAS
// =========================================

const confirmarDeficiencias =
    document.getElementById(
        "confirmar-deficiencias"
    );


if (confirmarDeficiencias) {

    confirmarDeficiencias.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            atualizarBotaoSelecao(

                btnDeficiencias,

                "deficiencia",

                "Selecione uma ou mais opções",

                "♿"

            );


            fecharTodosDropdowns();

        }
    );

}


// =========================================
// LIMPAR IMPACTOS
// =========================================

const limparImpactos =
    document.getElementById(
        "limpar-impactos"
    );


if (limparImpactos) {

    limparImpactos.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            checkboxesImpacto.forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );


            atualizarBotaoSelecao(

                btnImpactos,

                "impacto",

                "Selecione os impactos encontrados",

                "⚠️"

            );

        }
    );

}


// =========================================
// CONCLUIR IMPACTOS
// =========================================

const confirmarImpactos =
    document.getElementById(
        "confirmar-impactos"
    );


if (confirmarImpactos) {

    confirmarImpactos.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            atualizarBotaoSelecao(

                btnImpactos,

                "impacto",

                "Selecione os impactos encontrados",

                "⚠️"

            );


            fecharTodosDropdowns();

        }
    );

}


// =========================================
// ESCOLHER FOTO
// =========================================

const btnEscolherFoto =
    document.getElementById(
        "btn-escolher-foto"
    );


const inputFoto =
    document.getElementById(
        "foto"
    );


const nomeFoto =
    document.getElementById(
        "nome-foto"
    );


if (
    btnEscolherFoto &&
    inputFoto
) {

    btnEscolherFoto.addEventListener(
        "click",
        function(evento) {

            evento.preventDefault();

            evento.stopPropagation();


            inputFoto.click();

        }
    );

}


if (
    inputFoto &&
    nomeFoto
) {

    inputFoto.addEventListener(
        "change",
        function() {

            if (
                !inputFoto.files.length
            ) {

                nomeFoto.textContent =
                    "Nenhuma foto selecionada";

                return;

            }


            nomeFoto.textContent =
                inputFoto.files[0].name;

        }
    );

}


// =========================================
// ENVIAR AVALIAÇÃO
// =========================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();


            // =====================================
            // CAMPOS
            // =====================================

            const local_id =
                document.getElementById(
                    "local_id"
                ).value;


            const nota =
                document.getElementById(
                    "nota"
                ).value;


            const comentario =
                document.getElementById(
                    "comentario"
                ).value.trim();


            const fotoInput =
                document.getElementById(
                    "foto"
                );


            const deficiencias =
                obterSelecionados(
                    "deficiencia"
                );


            const impactos =
                obterSelecionados(
                    "impacto"
                );


            // =====================================
            // VALIDAÇÃO
            // =====================================

            if (
                !local_id ||
                !nota ||
                !comentario
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;

            }


            // =====================================
            // VERIFICAR FOTO
            // =====================================

            if (
                fotoInput &&
                fotoInput.files.length > 0
            ) {

                const foto =
                    fotoInput.files[0];


                if (
                    foto.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "A foto deve ter no máximo 5 MB."
                    );

                    return;

                }


                const tiposPermitidos = [

                    "image/jpeg",

                    "image/png",

                    "image/webp"

                ];


                if (
                    !tiposPermitidos.includes(
                        foto.type
                    )
                ) {

                    alert(
                        "Escolha uma imagem JPG, PNG ou WEBP."
                    );

                    return;

                }

            }


            // =====================================
            // VERIFICAR USUÁRIO
            // =====================================

            let usuario;


            if (!usuarioSalvo) {

                alert(
                    "Você precisa fazer login para publicar uma avaliação."
                );


                window.location.href =
                    "login.html";


                return;

            }


            try {

                usuario =
                    JSON.parse(
                        usuarioSalvo
                    );

            } catch (erro) {

                console.error(
                    "Erro ao ler usuário:",
                    erro
                );


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


            if (!usuario.id) {

                alert(
                    "Não foi possível identificar o usuário. Faça login novamente."
                );


                localStorage.removeItem(
                    "usuario"
                );


                window.location.href =
                    "login.html";


                return;

            }


            // =====================================
            // FORM DATA
            // =====================================

            const dados =
                new FormData();


            dados.append(
                "usuario_id",
                usuario.id
            );


            dados.append(
                "local_id",
                local_id
            );


            dados.append(
                "nota",
                nota
            );


            dados.append(
                "comentario",
                comentario
            );


            // =====================================
            // DADOS DE ACESSIBILIDADE
            // =====================================

            dados.append(
                "deficiencias",
                JSON.stringify(
                    deficiencias
                )
            );


            dados.append(
                "impactos",
                JSON.stringify(
                    impactos
                )
            );


            // =====================================
            // FOTO
            // =====================================

            if (
                fotoInput &&
                fotoInput.files.length > 0
            ) {

                dados.append(
                    "foto",
                    fotoInput.files[0]
                );

            }


            // =====================================
            // ENVIAR PARA API
            // =====================================

            try {

                const resposta =
                    await fetch(

                        "http://localhost:3000/avaliacoes",

                        {

                            method: "POST",

                            body: dados

                        }

                    );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(

                        resultado.mensagem ||

                        resultado.erro ||

                        "Não foi possível publicar a avaliação."

                    );


                    return;

                }


                // =================================
                // SALVAR LOCAL SELECIONADO
                // =================================

                try {

                    const opcaoSelecionada =
                        selectLocal.options[
                            selectLocal.selectedIndex
                        ];


                    if (
                        opcaoSelecionada
                    ) {

                        localStorage.setItem(

                            "localSelecionado",

                            JSON.stringify({

                                id:
                                    local_id,

                                nome:
                                    opcaoSelecionada.textContent

                            })

                        );

                    }

                } catch (erro) {

                    console.error(

                        "Erro ao salvar local selecionado:",

                        erro

                    );

                }


                // =================================
                // SUCESSO
                // =================================

                alert(
                    "Avaliação publicada com sucesso! ⭐"
                );


                window.location.href =
                    "avaliacoes.html?local_id=" +
                    encodeURIComponent(
                        local_id
                    );


            } catch (erro) {

                console.error(
                    "Erro ao publicar avaliação:",
                    erro
                );


                alert(
                    "Erro ao conectar com o servidor."
                );

            }

        }
    );

}


// =========================================
// INICIAR
// =========================================

configurarDropdown(
    btnDeficiencias,
    menuDeficiencias
);


configurarDropdown(
    btnImpactos,
    menuImpactos
);


carregarLocais();


// =========================================
// TEXTO INICIAL DOS BOTÕES
// =========================================

atualizarBotaoSelecao(

    btnDeficiencias,

    "deficiencia",

    "Selecione uma ou mais opções",

    "♿"

);


atualizarBotaoSelecao(

    btnImpactos,

    "impacto",

    "Selecione os impactos encontrados",

    "⚠️"

);