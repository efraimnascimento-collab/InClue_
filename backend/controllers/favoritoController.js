const favoritoModel =
    require('../models/favoritoModel');


// =========================================
// LISTAR FAVORITOS
// =========================================

async function listarFavoritos(req, res) {

    try {

        const { usuarioId } =
            req.params;


        if (!usuarioId) {

            return res.status(400).json({

                mensagem:
                    'ID do usuário é obrigatório.'

            });

        }


        const favoritos =
            await favoritoModel.listarFavoritos(
                usuarioId
            );


        res.status(200).json(
            favoritos
        );


    } catch (erro) {

        console.error(
            'ERRO AO LISTAR FAVORITOS:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao buscar favoritos.'

        });

    }

}


// =========================================
// VERIFICAR FAVORITO
// =========================================

async function verificarFavorito(req, res) {

    try {

        const {
            usuarioId,
            localId
        } = req.params;


        if (!usuarioId || !localId) {

            return res.status(400).json({

                mensagem:
                    'Usuário e local são obrigatórios.'

            });

        }


        const favorito =
            await favoritoModel.verificarFavorito(
                usuarioId,
                localId
            );


        res.status(200).json({

            favorito: !!favorito

        });


    } catch (erro) {

        console.error(
            'ERRO AO VERIFICAR FAVORITO:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao verificar favorito.'

        });

    }

}


// =========================================
// ADICIONAR FAVORITO
// =========================================

async function adicionarFavorito(req, res) {

    try {

        const {
            usuario_id,
            local_id
        } = req.body;


        if (!usuario_id || !local_id) {

            return res.status(400).json({

                mensagem:
                    'Usuário e local são obrigatórios.'

            });

        }


        // =====================================
        // VERIFICAR SE JÁ EXISTE
        // =====================================

        const existente =
            await favoritoModel.verificarFavorito(
                usuario_id,
                local_id
            );


        if (existente) {

            return res.status(409).json({

                mensagem:
                    'Este local já está nos favoritos.'

            });

        }


        // =====================================
        // ADICIONAR
        // =====================================

        const resultado =
            await favoritoModel.adicionarFavorito(
                usuario_id,
                local_id
            );


        res.status(201).json({

            mensagem:
                'Local adicionado aos favoritos! ❤️',

            id:
                resultado.insertId

        });


    } catch (erro) {

        console.error(
            'ERRO AO ADICIONAR FAVORITO:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao adicionar favorito.'

        });

    }

}


// =========================================
// REMOVER FAVORITO
// =========================================

async function removerFavorito(req, res) {

    try {

        const {
            usuario_id,
            local_id
        } = req.body;


        if (!usuario_id || !local_id) {

            return res.status(400).json({

                mensagem:
                    'Usuário e local são obrigatórios.'

            });

        }


        const resultado =
            await favoritoModel.removerFavorito(
                usuario_id,
                local_id
            );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({

                mensagem:
                    'Favorito não encontrado.'

            });

        }


        res.status(200).json({

            mensagem:
                'Local removido dos favoritos.'

        });


    } catch (erro) {

        console.error(
            'ERRO AO REMOVER FAVORITO:',
            erro
        );


        res.status(500).json({

            mensagem:
                'Erro ao remover favorito.'

        });

    }

}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    listarFavoritos,
    verificarFavorito,
    adicionarFavorito,
    removerFavorito

};