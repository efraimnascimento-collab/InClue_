const avaliacaoModel = require('../models/avaliacaoModel');


// =========================================
// LISTAR TODAS AS AVALIAÇÕES
// =========================================

async function listarAvaliacoes(req, res) {

    try {

        const avaliacoes =
            await avaliacaoModel.listarAvaliacoes();


        res.status(200).json(
            avaliacoes
        );

    } catch (erro) {

        console.error(
            'Erro ao listar avaliações:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao buscar avaliações'

        });

    }

}


// =========================================
// BUSCAR AVALIAÇÃO POR ID
// =========================================

async function buscarAvaliacaoPorId(
    req,
    res
) {

    try {

        const { id } =
            req.params;


        const avaliacao =
            await avaliacaoModel.buscarAvaliacaoPorId(
                id
            );


        if (!avaliacao) {

            return res.status(404).json({

                mensagem:
                    'Avaliação não encontrada'

            });

        }


        res.status(200).json(
            avaliacao
        );

    } catch (erro) {

        console.error(
            'Erro ao buscar avaliação:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao buscar avaliação'

        });

    }

}


// =========================================
// LISTAR AVALIAÇÕES POR LOCAL
// =========================================

async function listarAvaliacoesPorLocal(
    req,
    res
) {

    try {

        const { localId } =
            req.params;


        const avaliacoes =
            await avaliacaoModel.listarAvaliacoesPorLocal(
                localId
            );


        res.status(200).json(
            avaliacoes
        );

    } catch (erro) {

        console.error(
            'Erro ao buscar avaliações do local:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao buscar avaliações do local'

        });

    }

}


// =========================================
// CADASTRAR AVALIAÇÃO
// =========================================

async function cadastrarAvaliacao(
    req,
    res
) {

    try {

        const {

            usuario_id,

            local_id,

            nota,

            comentario,

            deficiencias,

            impactos

        } = req.body;


        // =====================================
        // VALIDAÇÕES
        // =====================================

        if (
            !usuario_id ||
            !local_id ||
            !nota
        ) {

            return res.status(400).json({

                mensagem:
                    'Usuário, local e nota são obrigatórios'

            });

        }


        if (
            Number(nota) < 1 ||
            Number(nota) > 5
        ) {

            return res.status(400).json({

                mensagem:
                    'A nota deve estar entre 1 e 5'

            });

        }


        // =====================================
        // FOTO
        // =====================================

        let foto = null;


        if (req.file) {

            foto =
                `/uploads/avaliacoes/${req.file.filename}`;

        }


        // =====================================
        // NECESSIDADE DE ACESSIBILIDADE
        // =====================================

        let necessidadeAcessibilidade =
            null;


        if (deficiencias) {

            try {

                /*
                 * O frontend envia um array em JSON.
                 *
                 * Exemplo:
                 *
                 * [
                 *   "Surdez",
                 *   "Baixa audição"
                 * ]
                 */

                const lista =
                    typeof deficiencias === 'string'
                        ? JSON.parse(deficiencias)
                        : deficiencias;


                if (
                    Array.isArray(lista) &&
                    lista.length > 0
                ) {

                    necessidadeAcessibilidade =
                        JSON.stringify(
                            lista
                        );

                }

            } catch (erro) {

                console.error(
                    'Erro ao interpretar deficiências:',
                    erro
                );


                necessidadeAcessibilidade =
                    deficiencias;

            }

        }


        // =====================================
        // IMPACTO NA ACESSIBILIDADE
        // =====================================

        let impactoAcessibilidade =
            null;


        if (impactos) {

            try {

                /*
                 * O frontend envia um array em JSON.
                 *
                 * Exemplo:
                 *
                 * [
                 *   "Não havia rampa de acesso",
                 *   "Rampas inadequadas"
                 * ]
                 */

                const lista =
                    typeof impactos === 'string'
                        ? JSON.parse(impactos)
                        : impactos;


                if (
                    Array.isArray(lista) &&
                    lista.length > 0
                ) {

                    impactoAcessibilidade =
                        JSON.stringify(
                            lista
                        );

                }

            } catch (erro) {

                console.error(
                    'Erro ao interpretar impactos:',
                    erro
                );


                impactoAcessibilidade =
                    impactos;

            }

        }


        // =====================================
        // CADASTRAR NO BANCO
        // =====================================

        const resultado =
            await avaliacaoModel.cadastrarAvaliacao(

                usuario_id,

                local_id,

                nota,

                comentario || '',

                foto,

                necessidadeAcessibilidade,

                impactoAcessibilidade

            );


        // =====================================
        // RESPOSTA
        // =====================================

        res.status(201).json({

            mensagem:
                'Avaliação cadastrada com sucesso',

            id:
                resultado.insertId,

            foto:
                foto

        });

    } catch (erro) {

        console.error(
            'Erro ao cadastrar avaliação:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao cadastrar avaliação',

            erro:
                erro.message

        });

    }

}


// =========================================
// ATUALIZAR AVALIAÇÃO
// =========================================

async function atualizarAvaliacao(
    req,
    res
) {

    try {

        const { id } =
            req.params;


        const {

            nota,

            comentario

        } = req.body;


        if (!nota) {

            return res.status(400).json({

                mensagem:
                    'A nota é obrigatória'

            });

        }


        if (
            Number(nota) < 1 ||
            Number(nota) > 5
        ) {

            return res.status(400).json({

                mensagem:
                    'A nota deve estar entre 1 e 5'

            });

        }


        const resultado =
            await avaliacaoModel.atualizarAvaliacao(

                id,

                nota,

                comentario || ''

            );


        if (
            resultado.affectedRows === 0
        ) {

            return res.status(404).json({

                mensagem:
                    'Avaliação não encontrada'

            });

        }


        res.status(200).json({

            mensagem:
                'Avaliação atualizada com sucesso'

        });

    } catch (erro) {

        console.error(
            'Erro ao atualizar avaliação:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao atualizar avaliação'

        });

    }

}


// =========================================
// EXCLUIR AVALIAÇÃO
// =========================================

async function excluirAvaliacao(
    req,
    res
) {

    try {

        const { id } =
            req.params;


        const resultado =
            await avaliacaoModel.excluirAvaliacao(
                id
            );


        if (
            resultado.affectedRows === 0
        ) {

            return res.status(404).json({

                mensagem:
                    'Avaliação não encontrada'

            });

        }


        res.status(200).json({

            mensagem:
                'Avaliação excluída com sucesso'

        });

    } catch (erro) {

        console.error(
            'Erro ao excluir avaliação:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao excluir avaliação'

        });

    }

}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    listarAvaliacoes,

    buscarAvaliacaoPorId,

    listarAvaliacoesPorLocal,

    cadastrarAvaliacao,

    atualizarAvaliacao,

    excluirAvaliacao

};