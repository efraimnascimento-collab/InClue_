const express =
    require('express');

const {

    listarFavoritos,

    verificarFavorito,

    adicionarFavorito,

    removerFavorito

} = require('../controllers/favoritoController');


const router =
    express.Router();


// =========================================
// LISTAR FAVORITOS DO USUÁRIO
// =========================================

router.get(
    '/usuarios/:usuarioId/favoritos',
    listarFavoritos
);


// =========================================
// VERIFICAR SE É FAVORITO
// =========================================

router.get(
    '/usuarios/:usuarioId/favoritos/:localId',
    verificarFavorito
);


// =========================================
// ADICIONAR FAVORITO
// =========================================

router.post(
    '/favoritos',
    adicionarFavorito
);


// =========================================
// REMOVER FAVORITO
// =========================================

router.delete(
    '/favoritos',
    removerFavorito
);


module.exports = router;