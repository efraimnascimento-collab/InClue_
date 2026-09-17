// =========================================
// CONTROLLER DE CURTIDAS - INCLUE
// =========================================

const curtidaModel =
    require("../models/curtidaModel");


// =========================================
// ADICIONAR CURTIDA
// =========================================

async function adicionarCurtida(req, res) {

    try {

        const {
            usuario_id,
            avaliacao_id
        } = req.body;


        if (!usuario_id || !avaliacao_id) {

            return res.status(400).json({

                mensagem:
                    "Usuário e avaliação são obrigatórios."

            });

        }


        const jaCurtiu =
            await curtidaModel.verificarCurtida(
                usuario_id,
                avaliacao_id
            );


        if (jaCurtiu) {

            return res.status(400).json({

                mensagem:
                    "Você já curtiu esta avaliação."

            });

        }


        await curtidaModel.adicionarCurtida(
            usuario_id,
            avaliacao_id
        );


        const total =
            await curtidaModel.contarCurtidas(
                avaliacao_id
            );


        return res.status(201).json({

            mensagem:
                "Avaliação curtida!",

            curtido: true,

            total: total

        });

    } catch (erro) {

        console.error(
            "ERRO AO ADICIONAR CURTIDA:",
            erro
        );

        return res.status(500).json({

            mensagem:
                "Erro ao adicionar curtida.",

            erro:
                erro.message

        });

    }

}


// =========================================
// REMOVER CURTIDA
// =========================================

async function removerCurtida(req, res) {

    try {

        const {
            usuario_id,
            avaliacao_id
        } = req.body;


        if (!usuario_id || !avaliacao_id) {

            return res.status(400).json({

                mensagem:
                    "Usuário e avaliação são obrigatórios."

            });

        }


        await curtidaModel.removerCurtida(
            usuario_id,
            avaliacao_id
        );


        const total =
            await curtidaModel.contarCurtidas(
                avaliacao_id
            );


        return res.status(200).json({

            mensagem:
                "Curtida removida.",

            curtido: false,

            total: total

        });

    } catch (erro) {

        console.error(
            "ERRO AO REMOVER CURTIDA:",
            erro
        );

        return res.status(500).json({

            mensagem:
                "Erro ao remover curtida.",

            erro:
                erro.message

        });

    }

}


// =========================================
// VERIFICAR CURTIDA
// =========================================

async function verificarCurtida(req, res) {

    try {

        const {
            usuario_id,
            avaliacao_id
        } = req.params;


        const curtido =
            await curtidaModel.verificarCurtida(
                usuario_id,
                avaliacao_id
            );


        const total =
            await curtidaModel.contarCurtidas(
                avaliacao_id
            );


        return res.status(200).json({

            curtido: curtido,

            total: total

        });

    } catch (erro) {

        console.error(
            "ERRO AO VERIFICAR CURTIDA:",
            erro
        );

        return res.status(500).json({

            mensagem:
                "Erro ao verificar curtida.",

            erro:
                erro.message

        });

    }

}


// =========================================
// LISTAR CURTIDAS DO USUÁRIO
// =========================================

async function listarCurtidasPorUsuario(req, res) {

    try {

        const {
            usuario_id
        } = req.params;


        if (!usuario_id) {

            return res.status(400).json({

                mensagem:
                    "ID do usuário é obrigatório."

            });

        }


        const curtidas =
            await curtidaModel.listarCurtidasPorUsuario(
                usuario_id
            );


        console.log(
            "CURTIDAS DO USUÁRIO",
            usuario_id,
            ":",
            curtidas
        );


        return res.status(200).json({

            curtidas: curtidas,

            total: curtidas.length

        });

    } catch (erro) {

        console.error(
            "ERRO AO BUSCAR CURTIDAS DO USUÁRIO:",
            erro
        );

        return res.status(500).json({

            mensagem:
                "Erro ao carregar curtidas.",

            erro:
                erro.message

        });

    }

}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    adicionarCurtida,

    removerCurtida,

    verificarCurtida,

    listarCurtidasPorUsuario

};