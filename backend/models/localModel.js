const connection = require('../database/connection');


// =========================================
// LISTAR TODOS OS LOCAIS
// =========================================

async function listarLocais() {

    const [locais] = await connection.query(
        'SELECT * FROM locais ORDER BY id DESC'
    );

    return locais;
}


// =========================================
// BUSCAR LOCAL POR ID
// =========================================

async function buscarLocalPorId(id) {

    const [locais] = await connection.query(
        'SELECT * FROM locais WHERE id = ?',
        [id]
    );

    return locais[0];
}


// =========================================
// CADASTRAR LOCAL
// =========================================

async function cadastrarLocal(
    nome,
    endereco,
    cidade,
    categoria,
    descricao,
    acessibilidade,
    imagem
) {

    const [resultado] = await connection.query(
        `INSERT INTO locais
        (
            nome,
            endereco,
            cidade,
            categoria,
            descricao,
            acessibilidade,
            imagem
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            nome,
            endereco,
            cidade,
            categoria,
            descricao,
            acessibilidade,
            imagem
        ]
    );

    return resultado;
}


// =========================================
// ATUALIZAR LOCAL
// =========================================

async function atualizarLocal(
    id,
    nome,
    endereco,
    cidade,
    categoria,
    descricao,
    acessibilidade,
    imagem
) {

    const [resultado] = await connection.query(
        `UPDATE locais
        SET
            nome = ?,
            endereco = ?,
            cidade = ?,
            categoria = ?,
            descricao = ?,
            acessibilidade = ?,
            imagem = ?
        WHERE id = ?`,
        [
            nome,
            endereco,
            cidade,
            categoria,
            descricao,
            acessibilidade,
            imagem,
            id
        ]
    );

    return resultado;
}


// =========================================
// EXCLUIR LOCAL
// =========================================

async function excluirLocal(id) {

    const [resultado] = await connection.query(
        'DELETE FROM locais WHERE id = ?',
        [id]
    );

    return resultado;
}


// =========================================
// EXPORTAR
// =========================================

module.exports = {
    listarLocais,
    buscarLocalPorId,
    cadastrarLocal,
    atualizarLocal,
    excluirLocal
};