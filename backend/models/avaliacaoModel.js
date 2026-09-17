const connection =
    require('../database/connection');


// =========================================
// LISTAR TODAS AS AVALIAÇÕES
// =========================================

async function listarAvaliacoes() {

    const [avaliacoes] =
        await connection.query(`

            SELECT

                avaliacoes.*,

                usuarios.nome AS usuario_nome,

                locais.nome AS local_nome

            FROM avaliacoes

            INNER JOIN usuarios
                ON avaliacoes.usuario_id =
                   usuarios.id

            INNER JOIN locais
                ON avaliacoes.local_id =
                   locais.id

            ORDER BY
                avaliacoes.id DESC

        `);


    return avaliacoes;

}


// =========================================
// BUSCAR AVALIAÇÃO POR ID
// =========================================

async function buscarAvaliacaoPorId(
    id
) {

    const [avaliacoes] =
        await connection.query(`

            SELECT

                avaliacoes.*,

                usuarios.nome AS usuario_nome,

                locais.nome AS local_nome

            FROM avaliacoes

            INNER JOIN usuarios
                ON avaliacoes.usuario_id =
                   usuarios.id

            INNER JOIN locais
                ON avaliacoes.local_id =
                   locais.id

            WHERE avaliacoes.id = ?

        `, [
            id
        ]);


    return avaliacoes[0];

}


// =========================================
// LISTAR AVALIAÇÕES POR LOCAL
// =========================================

async function listarAvaliacoesPorLocal(
    localId
) {

    const [avaliacoes] =
        await connection.query(`

            SELECT

                avaliacoes.*,

                usuarios.nome AS usuario_nome,

                locais.nome AS local_nome

            FROM avaliacoes

            INNER JOIN usuarios
                ON avaliacoes.usuario_id =
                   usuarios.id

            INNER JOIN locais
                ON avaliacoes.local_id =
                   locais.id

            WHERE avaliacoes.local_id = ?

            ORDER BY
                avaliacoes.id DESC

        `, [
            localId
        ]);


    return avaliacoes;

}


// =========================================
// CADASTRAR AVALIAÇÃO
// =========================================

async function cadastrarAvaliacao(

    usuarioId,

    localId,

    nota,

    comentario,

    foto,

    necessidadeAcessibilidade,

    impactoAcessibilidade

) {

    const [resultado] =
        await connection.query(`

            INSERT INTO avaliacoes

            (

                usuario_id,

                local_id,

                nota,

                comentario,

                foto,

                necessidade_acessibilidade,

                impacto_acessibilidade

            )

            VALUES

            (

                ?,

                ?,

                ?,

                ?,

                ?,

                ?,

                ?

            )

        `, [

            usuarioId,

            localId,

            nota,

            comentario,

            foto,

            necessidadeAcessibilidade,

            impactoAcessibilidade

        ]);


    return resultado;

}


// =========================================
// ATUALIZAR AVALIAÇÃO
// =========================================

async function atualizarAvaliacao(

    id,

    nota,

    comentario

) {

    const [resultado] =
        await connection.query(`

            UPDATE avaliacoes

            SET

                nota = ?,

                comentario = ?

            WHERE id = ?

        `, [

            nota,

            comentario,

            id

        ]);


    return resultado;

}


// =========================================
// EXCLUIR AVALIAÇÃO
// =========================================

async function excluirAvaliacao(
    id
) {

    const [resultado] =
        await connection.query(

            `

                DELETE FROM avaliacoes

                WHERE id = ?

            `,

            [
                id
            ]

        );


    return resultado;

}


// =========================================
// EXPORTAR
// =========================================

module.exports = {

    listarAvaliacoes,

    buscarAvaliacaoPorId,

    listarAvaliacoesPorLocal,

    cadastrarAvaliacao,

    atualizarAvaliacao,

    excluirAvaliacao

};