// =========================================
// MODELO DE CURTIDAS - INCLUE
// =========================================

const db = require("../database/connection");


// =========================================
// ADICIONAR CURTIDA
// =========================================

async function adicionarCurtida(usuario_id, avaliacao_id) {

    const [resultado] = await db.query(
        `
        INSERT INTO curtidas
        (
            usuario_id,
            avaliacao_id
        )
        VALUES (?, ?)
        `,
        [
            usuario_id,
            avaliacao_id
        ]
    );

    return resultado;
}


// =========================================
// REMOVER CURTIDA
// =========================================

async function removerCurtida(usuario_id, avaliacao_id) {

    const [resultado] = await db.query(
        `
        DELETE FROM curtidas
        WHERE usuario_id = ?
        AND avaliacao_id = ?
        `,
        [
            usuario_id,
            avaliacao_id
        ]
    );

    return resultado;
}


// =========================================
// VERIFICAR SE USUÁRIO CURTIU
// =========================================

async function verificarCurtida(
    usuario_id,
    avaliacao_id
) {

    const [resultado] = await db.query(
        `
        SELECT id
        FROM curtidas
        WHERE usuario_id = ?
        AND avaliacao_id = ?
        `,
        [
            usuario_id,
            avaliacao_id
        ]
    );

    return resultado.length > 0;
}


// =========================================
// CONTAR CURTIDAS
// =========================================

async function contarCurtidas(avaliacao_id) {

    const [resultado] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM curtidas
        WHERE avaliacao_id = ?
        `,
        [
            avaliacao_id
        ]
    );

    return Number(resultado[0].total);
}


// =========================================
// LISTAR CURTIDAS DO USUÁRIO
// =========================================

async function listarCurtidasPorUsuario(usuario_id) {

    const [resultado] = await db.query(
        `
        SELECT

            c.id AS curtida_id,

            a.id AS avaliacao_id,

            a.nota,

            a.comentario,

            a.usuario_id,

            a.local_id,

            l.nome AS local_nome,

            u.nome AS nome_usuario,

            u.username AS username_usuario,

            u.foto_perfil AS foto_usuario

        FROM curtidas AS c

        INNER JOIN avaliacoes AS a
            ON c.avaliacao_id = a.id

        LEFT JOIN locais AS l
            ON a.local_id = l.id

        LEFT JOIN usuarios AS u
            ON a.usuario_id = u.id

        WHERE c.usuario_id = ?

        ORDER BY c.id DESC
        `,
        [
            usuario_id
        ]
    );

    return resultado;
}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    adicionarCurtida,

    removerCurtida,

    verificarCurtida,

    contarCurtidas,

    listarCurtidasPorUsuario

};