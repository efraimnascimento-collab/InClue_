
const express = require("express");
const {
    listarUsuarios,
    cadastrarUsuario,
    login,
    buscarPerfil,
    atualizarPerfil,
    atualizarFotoPerfil,
    solicitarRecuperacaoSenha,
    redefinirSenha
} = require("../controllers/usuarioController");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// =========================================
// PASTA DE UPLOADS
// =========================================

const pastaUploads = path.join(
    __dirname,
    "..",
    "uploads",
    "perfis"
);

if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, {
        recursive: true
    });
}

// =========================================
// CONFIGURAÇÃO MULTER
// =========================================

const armazenamento = multer.diskStorage({
    destination: function (req, arquivo, callback) {
        callback(null, pastaUploads);
    },

    filename: function (req, arquivo, callback) {
        const extensao = path.extname(
            arquivo.originalname
        ).toLowerCase();

        const nomeArquivo =
            `perfil-${req.params.id}-${Date.now()}${extensao}`;

        callback(null, nomeArquivo);
    }
});

const upload = multer({
    storage: armazenamento,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, arquivo, callback) {
        const tiposPermitidos = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (tiposPermitidos.includes(arquivo.mimetype)) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    "Apenas imagens JPG, JPEG, PNG ou WEBP são permitidas."
                )
            );
        }
    }
});

// =========================================
// LISTAR USUÁRIOS
// =========================================

router.get(
    "/usuarios",
    listarUsuarios
);

// =========================================
// CADASTRAR USUÁRIO
// =========================================

router.post(
    "/usuarios",
    cadastrarUsuario
);

// =========================================
// LOGIN
// =========================================

router.post(
    "/login",
    login
);

// =========================================
// BUSCAR PERFIL
// =========================================

router.get(
    "/usuarios/:id/perfil",
    buscarPerfil
);

// =========================================
// ATUALIZAR NOME E USERNAME
// =========================================

router.put(
    "/usuarios/:id",
    atualizarPerfil
);

// =========================================
// ATUALIZAR FOTO DE PERFIL
// =========================================

router.post(
    "/usuarios/:id/foto",
    upload.single("foto"),
    atualizarFotoPerfil
);

// =========================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// =========================================

router.post(
    "/recuperar-senha",
    solicitarRecuperacaoSenha
);

// =========================================
// REDEFINIR SENHA
// =========================================

router.post(
    "/redefinir-senha",
    redefinirSenha
);

// =========================================
// EXPORTAR ROTAS
// =========================================

module.exports = router;
