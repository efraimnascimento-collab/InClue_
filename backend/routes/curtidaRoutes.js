// =========================================
// ROTAS DE CURTIDAS - INCLUE
// =========================================

const express = require("express");

const router = express.Router();

const curtidaController =
    require("../controllers/curtidaController");


// =========================================
// ADICIONAR CURTIDA
// =========================================

router.post(
    "/",
    curtidaController.adicionarCurtida
);


// =========================================
// REMOVER CURTIDA
// =========================================

router.delete(
    "/",
    curtidaController.removerCurtida
);


// =========================================
// LISTAR CURTIDAS DO USUÁRIO
// =========================================

router.get(
    "/usuario/:usuario_id",
    curtidaController.listarCurtidasPorUsuario
);


// =========================================
// VERIFICAR CURTIDA
// =========================================

router.get(
    "/:usuario_id/:avaliacao_id",
    curtidaController.verificarCurtida
);


module.exports = router;