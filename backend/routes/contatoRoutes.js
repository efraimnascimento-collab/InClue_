
const express = require('express');
const router = express.Router();

const {
    enviarContato
} = require('../controllers/contatoController');

router.post('/contato', enviarContato);

module.exports = router;

