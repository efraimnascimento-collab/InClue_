
const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { enviarEmail } = require("../services/emailService");

// =========================================
// LISTAR USUÁRIOS
// =========================================
async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuarioModel.listarUsuarios();
        return res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        return res.status(500).json({
            mensagem: "Erro ao buscar usuários"
        });
    }
}

// =========================================
// CADASTRAR USUÁRIO
// =========================================
async function cadastrarUsuario(req, res) {
    try {
        const { nome, username, email, senha } = req.body;

        if (!nome || !username || !email || !senha) {
            return res.status(400).json({
                mensagem: "Nome, @usuário, e-mail e senha são obrigatórios"
            });
        }

        if (String(senha).length < 8 || String(senha).length > 72) {
            return res.status(400).json({
                mensagem: "A senha deve ter entre 8 e 72 caracteres."
            });
        }

        const emailLimpo = String(email).trim().toLowerCase();

        let usernameLimpo = String(username).trim().toLowerCase();

        if (usernameLimpo.startsWith("@")) {
            usernameLimpo = usernameLimpo.substring(1);
        }

        if (!usernameLimpo) {
            return res.status(400).json({
                mensagem: "Digite um nome de usuário válido."
            });
        }

        if (!/^[a-zA-Z0-9._]+$/.test(usernameLimpo)) {
            return res.status(400).json({
                mensagem: "O @usuário pode conter apenas letras, números, ponto e underline."
            });
        }

        const usuarioExistente =
            await usuarioModel.buscarUsuarioPorEmail(emailLimpo);

        if (usuarioExistente) {
            return res.status(409).json({
                mensagem: "E-mail já cadastrado"
            });
        }

        const usernameExistente =
            await usuarioModel.buscarUsuarioPorUsername(usernameLimpo);

        if (usernameExistente) {
            return res.status(409).json({
                mensagem: "Esse @usuário já está sendo utilizado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        await usuarioModel.cadastrarUsuario(
            String(nome).trim(),
            usernameLimpo,
            emailLimpo,
            senhaHash
        );

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });
    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "E-mail ou @usuário já cadastrado."
            });
        }

        return res.status(500).json({
            mensagem: "Erro ao cadastrar usuário"
        });
    }
}

// =========================================
// LOGIN
// =========================================
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "E-mail e senha são obrigatórios"
            });
        }

        const usuario =
            await usuarioModel.buscarUsuarioPorEmail(
                String(email).trim().toLowerCase()
            );

        if (!usuario) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos"
            });
        }

        const senhaArmazenada = String(usuario.senha);
        const pareceHashBcrypt = /^\$2[aby]\$/.test(senhaArmazenada);

        let senhaValida = false;

        if (pareceHashBcrypt) {
            senhaValida = await bcrypt.compare(
                senha,
                senhaArmazenada
            );
        } else {
            // Compatibilidade temporária com contas antigas.
            senhaValida = senhaArmazenada === senha;

            // Migra a senha antiga para hash após login válido.
            if (senhaValida) {
                const senhaHash = await bcrypt.hash(senha, 12);
                await usuarioModel.atualizarSenha(
                    usuario.id,
                    senhaHash
                );
            }
        }

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos"
            });
        }

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                username: usuario.username,
                email: usuario.email,
                tipo: usuario.tipo || "usuario",
                foto_perfil: usuario.foto_perfil || null
            }
        });
    } catch (erro) {
        console.error("Erro no login:", erro);

        return res.status(500).json({
            mensagem: "Erro ao realizar login"
        });
    }
}

// =========================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// =========================================
async function solicitarRecuperacaoSenha(req, res) {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                mensagem: "Informe um e-mail válido."
            });
        }

        const resposta = {
            mensagem: "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha."
        };

        const usuario =
            await usuarioModel.buscarUsuarioPorEmail(email);

        // Não revela se o e-mail existe no sistema.
        if (!usuario) {
            return res.status(200).json(resposta);
        }

        const token = crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const expiraEm = new Date(Date.now() + 15 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        await usuarioModel.criarTokenRecuperacao(
            usuario.id,
            tokenHash,
            expiraEm
        );

        const frontendUrl = (
            process.env.FRONTEND_URL || "http://127.0.0.1:5500"
        ).replace(/\/+$/, "");

        const link =
            `${frontendUrl}/frontend/nova-senha.html?token=${token}`;

        try {
            await enviarEmail(
                usuario.email,
                "Recuperação de senha - InClue",
                `Para redefinir sua senha, abra este link, válido por 15 minutos: ${link}`,
                `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #176b45;">InClue</h2>
                        <p>Recebemos uma solicitação para redefinir sua senha.</p>
                        <p>
                            <a href="${link}"
                               style="background: #176b45; color: white;
                                      padding: 12px 20px; text-decoration: none;
                                      border-radius: 6px; display: inline-block;">
                                Criar nova senha
                            </a>
                        </p>
                        <p>Este link expira em 15 minutos e só pode ser utilizado uma vez.</p>
                        <p>Se você não solicitou a recuperação, ignore este e-mail.</p>
                    </div>
                `
            );
        } catch (erroEmail) {
            await usuarioModel.invalidarTokensRecuperacao(usuario.id);
            throw erroEmail;
        }

        return res.status(200).json(resposta);
    } catch (erro) {
        console.error(
            "Erro ao solicitar recuperação:",
            erro.message
        );

        return res.status(500).json({
            mensagem: "Não foi possível processar a solicitação agora."
        });
    }
}

// =========================================
// REDEFINIR SENHA
// =========================================
async function redefinirSenha(req, res) {
    try {
        const token = String(req.body.token || "");
        const novaSenha = String(req.body.novaSenha || "");

        if (!/^[a-f0-9]{64}$/i.test(token)) {
            return res.status(400).json({
                mensagem: "Link de recuperação inválido ou expirado."
            });
        }

        if (novaSenha.length < 8 || novaSenha.length > 72) {
            return res.status(400).json({
                mensagem: "A nova senha deve ter entre 8 e 72 caracteres."
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const registro =
            await usuarioModel.buscarTokenRecuperacao(tokenHash);

        if (!registro) {
            return res.status(400).json({
                mensagem: "Link de recuperação inválido ou expirado."
            });
        }

        const senhaHash = await bcrypt.hash(novaSenha, 12);

        const atualizado =
            await usuarioModel.atualizarSenhaEConsumirToken(
                registro.id,
                registro.usuario_id,
                senhaHash
            );

        if (!atualizado) {
            return res.status(400).json({
                mensagem: "Link de recuperação inválido ou expirado."
            });
        }

        return res.status(200).json({
            mensagem: "Senha alterada com sucesso. Você já pode entrar."
        });
    } catch (erro) {
        console.error("Erro ao redefinir senha:", erro);

        return res.status(500).json({
            mensagem: "Não foi possível redefinir a senha agora."
        });
    }
}

// =========================================
// BUSCAR PERFIL
// =========================================
async function buscarPerfil(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                mensagem: "ID do usuário é obrigatório."
            });
        }

        const perfil = await usuarioModel.buscarPerfil(id);

        if (!perfil) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            id: perfil.id,
            nome: perfil.nome,
            username: perfil.username,
            email: perfil.email,
            tipo: perfil.tipo,
            foto_perfil: perfil.foto_perfil || null
        });
    } catch (erro) {
        console.error("Erro ao buscar perfil:", erro);

        return res.status(500).json({
            mensagem: "Erro ao carregar perfil."
        });
    }
}

// =========================================
// ATUALIZAR PERFIL
// =========================================
async function atualizarPerfil(req, res) {
    try {
        const { id } = req.params;
        const { nome, username } = req.body;

        if (!nome || !username) {
            return res.status(400).json({
                mensagem: "Nome e @usuário são obrigatórios."
            });
        }

        let usernameLimpo = String(username).trim().toLowerCase();

        if (usernameLimpo.startsWith("@")) {
            usernameLimpo = usernameLimpo.substring(1);
        }

        if (!/^[a-zA-Z0-9._]+$/.test(usernameLimpo)) {
            return res.status(400).json({
                mensagem: "O @usuário pode conter apenas letras, números, ponto e underline."
            });
        }

        const usuarioExistente =
            await usuarioModel.buscarUsuarioPorUsername(usernameLimpo);

        if (
            usuarioExistente &&
            Number(usuarioExistente.id) !== Number(id)
        ) {
            return res.status(409).json({
                mensagem: "Esse @usuário já está sendo utilizado."
            });
        }

        await usuarioModel.atualizarPerfil(
            id,
            String(nome).trim(),
            usernameLimpo
        );

        const perfilAtualizado =
            await usuarioModel.buscarPerfil(id);

        return res.status(200).json({
            mensagem: "Perfil atualizado com sucesso.",
            usuario: perfilAtualizado
        });
    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro);

        return res.status(500).json({
            mensagem: "Erro ao atualizar perfil."
        });
    }
}

// =========================================
// ATUALIZAR FOTO DE PERFIL
// =========================================
async function atualizarFotoPerfil(req, res) {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                mensagem: "Nenhuma imagem foi enviada."
            });
        }

        const fotoPerfil = `/uploads/perfis/${req.file.filename}`;

        await usuarioModel.atualizarFotoPerfil(id, fotoPerfil);

        const perfilAtualizado =
            await usuarioModel.buscarPerfil(id);

        return res.status(200).json({
            mensagem: "Foto de perfil atualizada com sucesso.",
            usuario: perfilAtualizado
        });
    } catch (erro) {
        console.error("Erro ao atualizar foto:", erro);

        return res.status(500).json({
            mensagem: "Erro ao atualizar foto de perfil."
        });
    }
}

// =========================================
// EXPORTAR
// =========================================
module.exports = {
    listarUsuarios,
    cadastrarUsuario,
    login,
    solicitarRecuperacaoSenha,
    redefinirSenha,
    buscarPerfil,
    atualizarPerfil,
    atualizarFotoPerfil
};
