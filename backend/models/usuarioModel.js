// =========================================
// MODELO DE USUÁRIO - INCLUE
// =========================================

const connection =
    require("../database/connection");


// =========================================
// LISTAR USUÁRIOS
// =========================================

async function listarUsuarios() {

    const [usuarios] =
        await connection.query(

            `
            SELECT
                id,
                nome,
                username,
                email,
                tipo,
                foto_perfil

            FROM usuarios
            `

        );

    return usuarios;
}


// =========================================
// BUSCAR USUÁRIO POR ID
// =========================================

async function buscarUsuarioPorId(id) {

    const [usuarios] =
        await connection.query(

            `
            SELECT
                id,
                nome,
                username,
                email,
                tipo,
                foto_perfil

            FROM usuarios

            WHERE id = ?
            `,

            [id]

        );

    return usuarios[0];
}


// =========================================
// BUSCAR USUÁRIO POR E-MAIL
// =========================================

async function buscarUsuarioPorEmail(email) {

    const [usuarios] =
        await connection.query(

            `
            SELECT *

            FROM usuarios

            WHERE email = ?
            `,

            [email]

        );

    return usuarios[0];
}


// =========================================
// BUSCAR USUÁRIO POR USERNAME
// =========================================

async function buscarUsuarioPorUsername(username) {

    const [usuarios] =
        await connection.query(

            `
            SELECT
                id,
                nome,
                username,
                email,
                tipo,
                foto_perfil

            FROM usuarios

            WHERE username = ?
            `,

            [username]

        );

    return usuarios[0];
}


// =========================================
// CADASTRAR USUÁRIO
// =========================================

async function cadastrarUsuario(
    nome,
    username,
    email,
    senha
) {

    const [resultado] =
        await connection.query(

            `
            INSERT INTO usuarios
            (
                nome,
                username,
                email,
                senha,
                tipo
            )

            VALUES (?, ?, ?, ?, 'usuario')
            `,

            [
                nome,
                username,
                email,
                senha
            ]

        );

    return resultado;
}


// =========================================
// BUSCAR PERFIL
// =========================================

async function buscarPerfil(id) {

    const [usuarios] =
        await connection.query(

            `
            SELECT
                id,
                nome,
                username,
                email,
                tipo,
                foto_perfil

            FROM usuarios

            WHERE id = ?
            `,

            [id]

        );

    return usuarios[0];
}


// =========================================
// ATUALIZAR NOME E USERNAME
// =========================================

async function atualizarPerfil(
    id,
    nome,
    username
) {

    const [resultado] =
        await connection.query(

            `
            UPDATE usuarios

            SET
                nome = ?,
                username = ?

            WHERE id = ?
            `,

            [
                nome,
                username,
                id
            ]

        );

    return resultado;
}


// =========================================
// ATUALIZAR FOTO DE PERFIL
// =========================================

async function atualizarFotoPerfil(
    id,
    fotoPerfil
) {

    const [resultado] =
        await connection.query(

            `
            UPDATE usuarios

            SET foto_perfil = ?

            WHERE id = ?
            `,

            [
                fotoPerfil,
                id
            ]

        );

    return resultado;
}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    listarUsuarios,

    buscarUsuarioPorId,

    buscarUsuarioPorEmail,

    buscarUsuarioPorUsername,

    cadastrarUsuario,

    buscarPerfil,

    atualizarPerfil,

    atualizarFotoPerfil

};