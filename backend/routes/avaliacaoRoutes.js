const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    listarAvaliacoes,
    buscarAvaliacaoPorId,
    listarAvaliacoesPorLocal,
    cadastrarAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao
} = require('../controllers/avaliacaoController');

const router = express.Router();

// Cria a pasta de uploads automaticamente
const pastaUploads = path.join(
    __dirname,
    '..',
    'uploads',
    'avaliacoes'
);

fs.mkdirSync(pastaUploads, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaUploads);
    },

    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname).toLowerCase();

        const nomeArquivo =
            Date.now() + '-' +
            Math.round(Math.random() * 1e9) +
            extensao;

        cb(null, nomeArquivo);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {
        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (tiposPermitidos.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(
            new Error('Envie uma imagem JPG, PNG ou WEBP.')
        );
    }
});

// Rotas de consulta
router.get('/avaliacoes', listarAvaliacoes);

router.get('/avaliacoes/:id', buscarAvaliacaoPorId);

router.get(
    '/locais/:localId/avaliacoes',
    listarAvaliacoesPorLocal
);

// Cadastro com tratamento de erro do upload
router.post('/avaliacoes', (req, res, next) => {
    upload.single('foto')(req, res, function (erro) {
        if (erro) {
            console.error('Erro ao receber a foto:', erro);

            if (erro instanceof multer.MulterError) {
                if (erro.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({
                        mensagem: 'A foto deve ter no máximo 5 MB.'
                    });
                }

                return res.status(400).json({
                    mensagem: 'Erro no envio da foto: ' + erro.message
                });
            }

            return res.status(400).json({
                mensagem: erro.message || 'Não foi possível receber a foto.'
            });
        }

        next();
    });
}, cadastrarAvaliacao);

// Atualização e exclusão
router.put('/avaliacoes/:id', atualizarAvaliacao);

router.delete('/avaliacoes/:id', excluirAvaliacao);

module.exports = router;