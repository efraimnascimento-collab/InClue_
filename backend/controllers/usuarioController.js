// =========================================
// CONTROLLER DE USUÁRIO - INCLUE
// =========================================

const usuarioModel =
    require("../models/usuarioModel");


// =========================================
// LISTAR USUÁRIOS
// =========================================

async function listarUsuarios(req, res) {

    try {

        const usuarios =
            await usuarioModel.listarUsuarios();


        return res.status(200).json(
            usuarios
        );


    } catch (erro) {

        console.error(
            "Erro ao listar usuários:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao buscar usuários"

        });

    }

}


// =========================================
// CADASTRAR USUÁRIO
// =========================================

async function cadastrarUsuario(req, res) {

    try {

        const {
            nome,
            username,
            email,
            senha
        } = req.body;


        if (
            !nome ||
            !username ||
            !email ||
            !senha
        ) {

            return res.status(400).json({

                mensagem:
                    "Nome, @usuário, e-mail e senha são obrigatórios"

            });

        }


        let usernameLimpo =
            username
                .trim()
                .toLowerCase();


        if (
            usernameLimpo.startsWith("@")
        ) {

            usernameLimpo =
                usernameLimpo.substring(1);

        }


        if (!usernameLimpo) {

            return res.status(400).json({

                mensagem:
                    "Digite um nome de usuário válido."

            });

        }


        const usernameValido =
            /^[a-zA-Z0-9._]+$/.test(
                usernameLimpo
            );


        if (!usernameValido) {

            return res.status(400).json({

                mensagem:
                    "O @usuário pode conter apenas letras, números, ponto e underline."

            });

        }


        const usuarioExistente =
            await usuarioModel.buscarUsuarioPorEmail(
                email.trim()
            );


        if (usuarioExistente) {

            return res.status(409).json({

                mensagem:
                    "E-mail já cadastrado"

            });

        }


        const usernameExistente =
            await usuarioModel.buscarUsuarioPorUsername(
                usernameLimpo
            );


        if (usernameExistente) {

            return res.status(409).json({

                mensagem:
                    "Esse @usuário já está sendo utilizado."

            });

        }


        await usuarioModel.cadastrarUsuario(

            nome.trim(),

            usernameLimpo,

            email.trim(),

            senha

        );


        return res.status(201).json({

            mensagem:
                "Usuário cadastrado com sucesso"

        });


    } catch (erro) {

        console.error(
            "Erro ao cadastrar usuário:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao cadastrar usuário"

        });

    }

}


// =========================================
// LOGIN
// =========================================

async function login(req, res) {

    try {

        const {
            email,
            senha
        } = req.body;


        if (!email || !senha) {

            return res.status(400).json({

                mensagem:
                    "E-mail e senha são obrigatórios"

            });

        }


        const usuario =
            await usuarioModel.buscarUsuarioPorEmail(
                email
            );


        if (!usuario) {

            return res.status(401).json({

                mensagem:
                    "E-mail ou senha inválidos"

            });

        }


        if (usuario.senha !== senha) {

            return res.status(401).json({

                mensagem:
                    "E-mail ou senha inválidos"

            });

        }


        return res.status(200).json({

            mensagem:
                "Login realizado com sucesso",

            usuario: {

                id:
                    usuario.id,

                nome:
                    usuario.nome,

                username:
                    usuario.username,

                email:
                    usuario.email,

                tipo:
                    usuario.tipo || "usuario",

                foto_perfil:
                    usuario.foto_perfil || null

            }

        });


    } catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao realizar login"

        });

    }

}


// =========================================
// BUSCAR PERFIL
// =========================================

async function buscarPerfil(req, res) {

    try {

        const {
            id
        } = req.params;


        if (!id) {

            return res.status(400).json({

                mensagem:
                    "ID do usuário é obrigatório."

            });

        }


        const perfil =
            await usuarioModel.buscarPerfil(id);


        if (!perfil) {

            return res.status(404).json({

                mensagem:
                    "Usuário não encontrado."

            });

        }


        return res.status(200).json({

            id:
                perfil.id,

            nome:
                perfil.nome,

            username:
                perfil.username,

            email:
                perfil.email,

            tipo:
                perfil.tipo,

            foto_perfil:
                perfil.foto_perfil || null

        });


    } catch (erro) {

        console.error(
            "Erro ao buscar perfil:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao carregar perfil."

        });

    }

}


// =========================================
// ATUALIZAR PERFIL
// =========================================

async function atualizarPerfil(req, res) {

    try {

        const {
            id
        } = req.params;


        const {
            nome,
            username
        } = req.body;


        if (!nome || !username) {

            return res.status(400).json({

                mensagem:
                    "Nome e @usuário são obrigatórios."

            });

        }


        let usernameLimpo =
            username
                .trim()
                .toLowerCase();


        if (
            usernameLimpo.startsWith("@")
        ) {

            usernameLimpo =
                usernameLimpo.substring(1);

        }


        const usernameValido =
            /^[a-zA-Z0-9._]+$/.test(
                usernameLimpo
            );


        if (!usernameValido) {

            return res.status(400).json({

                mensagem:
                    "O @usuário pode conter apenas letras, números, ponto e underline."

            });

        }


        const usuarioExistente =
            await usuarioModel.buscarUsuarioPorUsername(
                usernameLimpo
            );


        if (
            usuarioExistente &&
            Number(usuarioExistente.id) !==
            Number(id)
        ) {

            return res.status(409).json({

                mensagem:
                    "Esse @usuário já está sendo utilizado."

            });

        }


        await usuarioModel.atualizarPerfil(

            id,

            nome.trim(),

            usernameLimpo

        );


        const perfilAtualizado =
            await usuarioModel.buscarPerfil(id);


        return res.status(200).json({

            mensagem:
                "Perfil atualizado com sucesso.",

            usuario:
                perfilAtualizado

        });


    } catch (erro) {

        console.error(
            "Erro ao atualizar perfil:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao atualizar perfil."

        });

    }

}


// =========================================
// ATUALIZAR FOTO DE PERFIL
// =========================================

async function atualizarFotoPerfil(req, res) {

    try {

        const {
            id
        } = req.params;


        if (!req.file) {

            return res.status(400).json({

                mensagem:
                    "Nenhuma imagem foi enviada."

            });

        }


        const fotoPerfil =
            `/uploads/perfis/${req.file.filename}`;


        await usuarioModel.atualizarFotoPerfil(

            id,

            fotoPerfil

        );


        const perfilAtualizado =
            await usuarioModel.buscarPerfil(id);


        return res.status(200).json({

            mensagem:
                "Foto de perfil atualizada com sucesso.",

            usuario:
                perfilAtualizado

        });


    } catch (erro) {

        console.error(
            "Erro ao atualizar foto:",
            erro
        );


        return res.status(500).json({

            mensagem:
                "Erro ao atualizar foto de perfil."

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

    buscarPerfil,

    atualizarPerfil,

    atualizarFotoPerfil

};