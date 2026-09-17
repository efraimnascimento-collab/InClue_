const express =
    require('express');

const multer =
    require('multer');

const path =
    require('path');


const {

    listarAvaliacoes,

    buscarAvaliacaoPorId,

    listarAvaliacoesPorLocal,

    cadastrarAvaliacao,

    atualizarAvaliacao,

    excluirAvaliacao

} = require('../controllers/avaliacaoController');


const router =
    express.Router();


// =========================================
// CONFIGURAÇÃO DAS FOTOS
// =========================================

const storage =
    multer.diskStorage({

        destination:
            function (req, file, cb) {

                cb(
                    null,
                    'uploads/avaliacoes'
                );

            },


        filename:
            function (req, file, cb) {

                const extensao =
                    path.extname(
                        file.originalname
                    );


                const nomeArquivo =
                    Date.now() +
                    '-' +
                    Math.round(
                        Math.random() * 1E9
                    ) +
                    extensao;


                cb(
                    null,
                    nomeArquivo
                );

            }

    });


const upload =
    multer({

        storage: storage,

        limits: {

            fileSize:
                5 * 1024 * 1024

        },


        fileFilter:
            function (req, file, cb) {

                const tiposPermitidos = [

                    'image/jpeg',

                    'image/png',

                    'image/webp'

                ];


                if (
                    tiposPermitidos.includes(
                        file.mimetype
                    )
                ) {

                    cb(
                        null,
                        true
                    );

                } else {

                    cb(
                        new Error(
                            'Apenas imagens JPG, PNG ou WEBP são permitidas.'
                        )
                    );

                }

            }

    });


// =========================================
// GET - TODAS AS AVALIAÇÕES
// =========================================

router.get(
    '/avaliacoes',
    listarAvaliacoes
);


// =========================================
// GET - AVALIAÇÃO POR ID
// =========================================

router.get(
    '/avaliacoes/:id',
    buscarAvaliacaoPorId
);


// =========================================
// GET - AVALIAÇÕES DE UM LOCAL
// =========================================

router.get(
    '/locais/:localId/avaliacoes',
    listarAvaliacoesPorLocal
);


// =========================================
// POST - NOVA AVALIAÇÃO
// =========================================

router.post(
    '/avaliacoes',
    upload.single('foto'),
    cadastrarAvaliacao
);


// =========================================
// PUT - ATUALIZAR
// =========================================

router.put(
    '/avaliacoes/:id',
    atualizarAvaliacao
);


// =========================================
// DELETE - EXCLUIR
// =========================================

router.delete(
    '/avaliacoes/:id',
    excluirAvaliacao
);


module.exports =
    router;