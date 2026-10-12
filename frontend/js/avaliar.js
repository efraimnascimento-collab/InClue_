/* =========================================
   AVALIAR - INCLUE
========================================= */

// =========================================
// ELEMENTOS
// =========================================

const formulario = document.getElementById("avaliacao-form");
const selectLocal = document.getElementById("local_id");

const usuarioSalvo = localStorage.getItem("usuario");

// DROPDOWN DA NOTA
const btnNota = document.getElementById("btn-nota");
const menuNota = document.getElementById("menu-nota");
const textoNota = document.getElementById("texto-nota");
const campoNota = document.getElementById("nota");

// DROPDOWN DE DEFICIÊNCIAS
const btnDeficiencias = document.getElementById("btn-deficiencias");
const menuDeficiencias = document.getElementById("menu-deficiencias");

// DROPDOWN DE IMPACTOS
const btnImpactos = document.getElementById("btn-impactos");
const menuImpactos = document.getElementById("menu-impactos");

// FOTO
const btnEscolherFoto = document.getElementById("btn-escolher-foto");
const inputFoto = document.getElementById("foto");
const nomeFoto = document.getElementById("nome-foto");

// =========================================
// CARREGAR LOCAIS
// =========================================

async function carregarLocais() {
    if (!selectLocal) return;

    try {
        const resposta = await fetch("http://localhost:3000/locais");

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const locais = await resposta.json();

        selectLocal.innerHTML =
            '<option value="">Selecione um local</option>';

        locais.forEach(local => {
            const opcao = document.createElement("option");

            opcao.value = local.id;
            opcao.textContent = local.nome;

            selectLocal.appendChild(opcao);
        });

        const localSalvo = localStorage.getItem("localSelecionado");

        if (localSalvo) {
            try {
                const localSelecionado = JSON.parse(localSalvo);

                if (localSelecionado && localSelecionado.id) {
                    selectLocal.value = String(localSelecionado.id);
                }
            } catch (erro) {
                console.error("Erro ao recuperar local:", erro);
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar locais:", erro);
        alert("Não foi possível carregar os locais. Verifique o servidor.");
    }
}

// =========================================
// DROPDOWNS
// =========================================

function fecharTodosDropdowns() {
    const pares = [
        [btnNota, menuNota],
        [btnDeficiencias, menuDeficiencias],
        [btnImpactos, menuImpactos]
    ];

    pares.forEach(([botao, menu]) => {
        if (menu) {
            menu.hidden = true;
        }

        if (botao) {
            botao.classList.remove("aberto");
            botao.setAttribute("aria-expanded", "false");
        }
    });
}

function configurarDropdown(botao, menu) {
    if (!botao || !menu) return;

    botao.addEventListener("click", function(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        const estavaAberto = !menu.hidden;

        fecharTodosDropdowns();

        if (!estavaAberto) {
            menu.hidden = false;
            botao.classList.add("aberto");
            botao.setAttribute("aria-expanded", "true");
        }
    });

    menu.addEventListener("click", evento => {
        evento.stopPropagation();
    });
}

configurarDropdown(btnNota, menuNota);
configurarDropdown(btnDeficiencias, menuDeficiencias);
configurarDropdown(btnImpactos, menuImpactos);

// Fechar os menus ao clicar fora
document.addEventListener("click", evento => {
    const pares = [
        [btnNota, menuNota],
        [btnDeficiencias, menuDeficiencias],
        [btnImpactos, menuImpactos]
    ];

    const clicouDentro = pares.some(([botao, menu]) => {
        return (
            (botao && botao.contains(evento.target)) ||
            (menu && menu.contains(evento.target))
        );
    });

    if (!clicouDentro) {
        fecharTodosDropdowns();
    }
});

// =========================================
// SELECIONAR NOTA
// =========================================

if (menuNota && campoNota && textoNota) {
    const opcoesNota = menuNota.querySelectorAll(
        'input[name="nota_opcao"]'
    );

    opcoesNota.forEach(opcao => {
        opcao.addEventListener("change", () => {
            campoNota.value = opcao.value;

            const textoOpcao = opcao
                .closest("label")
                ?.querySelector("span");

            if (textoOpcao) {
                textoNota.textContent = textoOpcao.textContent.trim();
            }

            fecharTodosDropdowns();
        });
    });
}

// =========================================
// OBTER SELECIONADOS
// =========================================

function obterSelecionados(nome) {
    return Array.from(
        document.querySelectorAll(
            `input[name="${nome}"]:checked`
        )
    ).map(elemento => elemento.value);
}

// =========================================
// ATUALIZAR BOTÕES DE SELEÇÃO
// =========================================

function atualizarBotaoSelecao(
    botao,
    nome,
    textoPadrao,
    icone
) {
    if (!botao) return;

    const texto = botao.querySelector("span:first-child");

    if (!texto) return;

    const selecionados = obterSelecionados(nome);

    if (selecionados.length === 0) {
        texto.textContent = textoPadrao;
    } else if (selecionados.length === 1) {
        texto.textContent = `${icone} ${selecionados[0]}`;
    } else {
        texto.textContent =
            `${icone} ${selecionados[0]} +${selecionados.length - 1}`;
    }
}

// =========================================
// DEFICIÊNCIAS
// =========================================

const checkboxesDeficiencia = document.querySelectorAll(
    'input[name="deficiencia"]'
);

checkboxesDeficiencia.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        atualizarBotaoSelecao(
            btnDeficiencias,
            "deficiencia",
            "Selecione uma ou mais opções",
            "♿"
        );
    });
});

const limparDeficiencias = document.getElementById(
    "limpar-deficiencias"
);

if (limparDeficiencias) {
    limparDeficiencias.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        checkboxesDeficiencia.forEach(checkbox => {
            checkbox.checked = false;
        });

        atualizarBotaoSelecao(
            btnDeficiencias,
            "deficiencia",
            "Selecione uma ou mais opções",
            "♿"
        );
    });
}

const confirmarDeficiencias = document.getElementById(
    "confirmar-deficiencias"
);

if (confirmarDeficiencias) {
    confirmarDeficiencias.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        atualizarBotaoSelecao(
            btnDeficiencias,
            "deficiencia",
            "Selecione uma ou mais opções",
            "♿"
        );

        fecharTodosDropdowns();
    });
}

// =========================================
// IMPACTOS
// =========================================

const checkboxesImpacto = document.querySelectorAll(
    'input[name="impacto"]'
);

checkboxesImpacto.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        atualizarBotaoSelecao(
            btnImpactos,
            "impacto",
            "Selecione os impactos encontrados",
            "⚠️"
        );
    });
});

const limparImpactos = document.getElementById("limpar-impactos");

if (limparImpactos) {
    limparImpactos.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        checkboxesImpacto.forEach(checkbox => {
            checkbox.checked = false;
        });

        atualizarBotaoSelecao(
            btnImpactos,
            "impacto",
            "Selecione os impactos encontrados",
            "⚠️"
        );
    });
}

const confirmarImpactos = document.getElementById("confirmar-impactos");

if (confirmarImpactos) {
    confirmarImpactos.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        atualizarBotaoSelecao(
            btnImpactos,
            "impacto",
            "Selecione os impactos encontrados",
            "⚠️"
        );

        fecharTodosDropdowns();
    });
}

// =========================================
// ESCOLHER FOTO
// =========================================

if (btnEscolherFoto && inputFoto) {
    btnEscolherFoto.addEventListener("click", evento => {
        evento.preventDefault();
        evento.stopPropagation();

        inputFoto.click();
    });
}

if (inputFoto && nomeFoto) {
    inputFoto.addEventListener("change", () => {
        if (!inputFoto.files || inputFoto.files.length === 0) {
            nomeFoto.textContent = "Nenhuma foto selecionada";
            return;
        }

        nomeFoto.textContent = inputFoto.files[0].name;
    });
}

// =========================================
// ENVIAR AVALIAÇÃO
// =========================================

if (formulario) {
    formulario.addEventListener("submit", async function(evento) {
        evento.preventDefault();

        // EVITAR DUPLO ENVIO
        const botaoEnviar = formulario.querySelector(
            'button[type="submit"]'
        );

        if (botaoEnviar && botaoEnviar.disabled) {
            return;
        }

        const local_id = selectLocal ? selectLocal.value : "";
        const nota = campoNota ? campoNota.value : "";

        const campoComentario = document.getElementById("comentario");
        const comentario = campoComentario
            ? campoComentario.value.trim()
            : "";

        const deficiencias = obterSelecionados("deficiencia");
        const impactos = obterSelecionados("impacto");

        // VALIDAR LOCAL
        if (!local_id) {
            alert("Por favor, escolha um local.");
            return;
        }

        // VALIDAR NOTA
        if (!nota) {
            alert("Por favor, escolha uma nota de 1 a 5.");
            return;
        }

        // VALIDAR COMENTÁRIO
        if (!comentario) {
            alert("Por favor, conte sua experiência.");
            return;
        }

        // VALIDAR FOTO
        let foto = null;

        if (inputFoto && inputFoto.files.length > 0) {
            foto = inputFoto.files[0];

            if (foto.size > 5 * 1024 * 1024) {
                alert("A foto deve ter no máximo 5 MB.");
                return;
            }

            const tiposPermitidos = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!tiposPermitidos.includes(foto.type)) {
                alert("Escolha uma imagem JPG, PNG ou WEBP.");
                return;
            }
        }

        // VALIDAR LOGIN
        if (!usuarioSalvo) {
            alert("Você precisa fazer login para publicar uma avaliação.");
            window.location.href = "login.html";
            return;
        }

        let usuario;

        try {
            usuario = JSON.parse(usuarioSalvo);
        } catch (erro) {
            console.error("Erro ao ler usuário:", erro);

            alert("Sessão inválida. Faça login novamente.");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
            return;
        }

        if (!usuario || !usuario.id) {
            alert("Não foi possível identificar o usuário. Faça login novamente.");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
            return;
        }

        // MONTAR DADOS
        const dados = new FormData();

        dados.append("usuario_id", usuario.id);
        dados.append("local_id", local_id);
        dados.append("nota", nota);
        dados.append("comentario", comentario);
        dados.append("deficiencias", JSON.stringify(deficiencias));
        dados.append("impactos", JSON.stringify(impactos));

        if (foto) {
            dados.append("foto", foto, foto.name);
        }

        // ENVIAR AO SERVIDOR
        if (botaoEnviar) {
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Publicando...";
        }

        try {
            console.log("Enviando avaliação...");
            console.log("Foto anexada:", foto ? foto.name : "Nenhuma");

            const resposta = await fetch(
                "http://localhost:3000/avaliacoes",
                {
                    method: "POST",
                    body: dados
                }
            );

            const textoResposta = await resposta.text();

            let resultado = {};

            try {
                resultado = textoResposta ? JSON.parse(textoResposta) : {};
            } catch (erroJson) {
                console.warn("Resposta não é JSON válido:", textoResposta);
            }

            console.log("Status da API:", resposta.status);
            console.log("Resposta da API:", resultado);

            if (!resposta.ok) {
                alert(
                    resultado.mensagem ||
                    resultado.erro ||
                    `Não foi possível publicar a avaliação (erro ${resposta.status}).`
                );
                return;
            }

            // GUARDAR LOCAL SELECIONADO
            try {
                const opcaoLocal =
                    selectLocal.options[selectLocal.selectedIndex];

                localStorage.setItem(
                    "localSelecionado",
                    JSON.stringify({
                        id: Number(local_id),
                        nome: opcaoLocal ? opcaoLocal.textContent : ""
                    })
                );
            } catch (erroLocal) {
                console.warn("Não foi possível guardar o local:", erroLocal);
            }

            // REDIRECIONAR APENAS UMA VEZ
            console.log('Avaliação cadastrada. Preparando redirecionamento...');
            window.location.assign(
                new URL('avaliacoes.html', window.location.href).href
);
    



        } catch (erro) {
            console.error("Erro ao publicar avaliação:", erro);

            alert(
                "Não foi possível enviar a avaliação. " +
                "Verifique se o servidor está funcionando."
            );
        } finally {
            if (botaoEnviar) {
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = "Publicar avaliação";
            }
        }
    });
}

// =========================================
// INICIAR
// =========================================

carregarLocais();

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
