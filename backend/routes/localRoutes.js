const express = require('express');

const {
    listarLocais,
    buscarLocalPorId,
    cadastrarLocal,
    atualizarLocal,
    excluirLocal
} = require('../controllers/localController');

const router = express.Router();


// =========================================
// LOCAIS
// =========================================

// GET /locais
router.get('/locais', listarLocais);

// GET /locais/:id
router.get('/locais/:id', buscarLocalPorId);

// POST /locais
router.post('/locais', cadastrarLocal);

// PUT /locais/:id
router.put('/locais/:id', atualizarLocal);

// DELETE /locais/:id
router.delete('/locais/:id', excluirLocal);


module.exports = router;