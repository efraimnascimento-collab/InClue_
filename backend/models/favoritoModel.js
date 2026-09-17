const connection = require('../database/connection');


// =========================================
// LISTAR FAVORITOS DO USUÁRIO
// =========================================

async function listarFavoritos(usuarioId) {

    const [favoritos] = await connection.query(`
        SELECT
            f.id,
            f.usuario_id,
            f.local_id,

            l.nome AS local_nome,
            l.cidade,
            l.descricao,
            l.imagem

        FROM favoritos AS f

        INNER JOIN locais AS l
            ON f.local_id = l.id

        WHERE f.usuario_id = ?

        ORDER BY f.id DESC
    `, [usuarioId]);

    return favoritos;
}


// =========================================
// VERIFICAR FAVORITO
// =========================================

async function verificarFavorito(usuarioId, localId) {

    const [favoritos] = await connection.query(`
        SELECT
            id,
            usuario_id,
            local_id

        FROM favoritos

        WHERE usuario_id = ?
        AND local_id = ?
    `, [
        usuarioId,
        localId
    ]);

    return favoritos[0] || null;
}


// =========================================
// ADICIONAR FAVORITO
// =========================================

async function adicionarFavorito(
    usuarioId,
    localId
) {

    const [resultado] = await connection.query(`
        INSERT INTO favoritos
        (
            usuario_id,
            local_id
        )

        VALUES (?, ?)
    `, [
        usuarioId,
        localId
    ]);

    return resultado;
}


// =========================================
// REMOVER FAVORITO
// =========================================

async function removerFavorito(
    usuarioId,
    localId
) {

    const [resultado] = await connection.query(`
        DELETE FROM favoritos

        WHERE usuario_id = ?
        AND local_id = ?
    `, [
        usuarioId,
        localId
    ]);

    return resultado;
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