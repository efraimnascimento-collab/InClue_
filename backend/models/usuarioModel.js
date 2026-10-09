
const connection = require("../database/connection");

// =========================================
// LISTAR USUÁRIOS
// =========================================

async function listarUsuarios() {
    const [usuarios] = await connection.query(`
        SELECT id, nome, username, email, tipo, foto_perfil
        FROM usuarios
    `);

    return usuarios;
}

// =========================================
// BUSCAR USUÁRIO POR ID
// =========================================

async function buscarUsuarioPorId(id) {
    const [usuarios] = await connection.query(
        `SELECT id, nome, username, email, tipo, foto_perfil
         FROM usuarios
         WHERE id = ?`,
        [id]
    );

    return usuarios[0];
}

// =========================================
// BUSCAR USUÁRIO POR E-MAIL
// =========================================

async function buscarUsuarioPorEmail(email) {
    const [usuarios] = await connection.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );

    return usuarios[0];
}

// =========================================
// BUSCAR USUÁRIO POR USERNAME
// =========================================

async function buscarUsuarioPorUsername(username) {
    const [usuarios] = await connection.query(
        `SELECT id, nome, username, email, tipo, foto_perfil
         FROM usuarios
         WHERE username = ?`,
        [username]
    );

    return usuarios[0];
}

// =========================================
// CADASTRAR USUÁRIO
// =========================================

async function cadastrarUsuario(nome, username, email, senha) {
    const [resultado] = await connection.query(
        `INSERT INTO usuarios
         (nome, username, email, senha, tipo)
         VALUES (?, ?, ?, ?, 'usuario')`,
        [nome, username, email, senha]
    );

    return resultado;
}

// =========================================
// BUSCAR PERFIL
// =========================================

async function buscarPerfil(id) {
    const [usuarios] = await connection.query(
        `SELECT id, nome, username, email, tipo, foto_perfil
         FROM usuarios
         WHERE id = ?`,
        [id]
    );

    return usuarios[0];
}

// =========================================
// ATUALIZAR PERFIL
// =========================================

async function atualizarPerfil(id, nome, username) {
    const [resultado] = await connection.query(
        `UPDATE usuarios
         SET nome = ?, username = ?
         WHERE id = ?`,
        [nome, username, id]
    );

    return resultado;
}

// =========================================
// ATUALIZAR FOTO DE PERFIL
// =========================================

async function atualizarFotoPerfil(id, fotoPerfil) {
    const [resultado] = await connection.query(
        `UPDATE usuarios
         SET foto_perfil = ?
         WHERE id = ?`,
        [fotoPerfil, id]
    );

    return resultado;
}

// =========================================
// ATUALIZAR SENHA
// =========================================

async function atualizarSenha(id, senhaHash) {
    await connection.query(
        "UPDATE usuarios SET senha = ? WHERE id = ?",
        [senhaHash, id]
    );
}

// =========================================
// CRIAR TOKEN DE RECUPERAÇÃO
// =========================================

async function criarTokenRecuperacao(usuarioId, tokenHash, expiraEm) {
    await connection.query(
        "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
        [usuarioId]
    );

    await connection.query(
        `INSERT INTO recuperacao_senha
         (usuario_id, token_hash, expira_em)
         VALUES (?, ?, ?)`,
        [usuarioId, tokenHash, expiraEm]
    );
}

// =========================================
// BUSCAR TOKEN VÁLIDO
// =========================================

async function buscarTokenRecuperacao(tokenHash) {
    const [registros] = await connection.query(
        `SELECT id, usuario_id
         FROM recuperacao_senha
         WHERE token_hash = ?
           AND expira_em > NOW()
           AND usado_em IS NULL`,
        [tokenHash]
    );

    return registros[0];
}

// =========================================
// REDEFINIR SENHA E CONSUMIR TOKEN
// =========================================

async function atualizarSenhaEConsumirToken(
    tokenId,
    usuarioId,
    senhaHash
) {
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [tokens] = await conn.query(
            `SELECT id
             FROM recuperacao_senha
             WHERE id = ?
               AND usuario_id = ?
               AND expira_em > NOW()
               AND usado_em IS NULL
             FOR UPDATE`,
            [tokenId, usuarioId]
        );

        if (tokens.length === 0) {
            await conn.rollback();
            return false;
        }

        await conn.query(
            "UPDATE usuarios SET senha = ? WHERE id = ?",
            [senhaHash, usuarioId]
        );

        await conn.query(
            `UPDATE recuperacao_senha
             SET usado_em = NOW()
             WHERE id = ?`,
            [tokenId]
        );

        await conn.query(
            `DELETE FROM recuperacao_senha
             WHERE usuario_id = ? AND id <> ?`,
            [usuarioId, tokenId]
        );

        await conn.commit();
        return true;

    } catch (erro) {
        await conn.rollback();
        throw erro;

    } finally {
        conn.release();
    }
}

// =========================================
// INVALIDAR TOKENS DE RECUPERAÇÃO
// =========================================

async function invalidarTokensRecuperacao(usuarioId) {
    await connection.query(
        "DELETE FROM recuperacao_senha WHERE usuario_id = ?",
        [usuarioId]
    );
}

// =========================================
// EXPORTAR FUNÇÕES
// =========================================

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    buscarUsuarioPorUsername,
    cadastrarUsuario,
    buscarPerfil,
    atualizarPerfil,
    atualizarFotoPerfil,
    atualizarSenha,
    criarTokenRecuperacao,
    buscarTokenRecuperacao,
    atualizarSenhaEConsumirToken,
    invalidarTokensRecuperacao
};
