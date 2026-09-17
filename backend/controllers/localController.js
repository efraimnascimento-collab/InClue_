const localModel = require('../models/localModel');


// =========================================
// LISTAR LOCAIS
// =========================================

async function listarLocais(req, res) {

    try {

        const locais = await localModel.listarLocais();

        res.status(200).json(locais);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar locais'
        });

    }
}


// =========================================
// BUSCAR LOCAL POR ID
// =========================================

async function buscarLocalPorId(req, res) {

    try {

        const { id } = req.params;

        const local = await localModel.buscarLocalPorId(id);

        if (!local) {

            return res.status(404).json({
                mensagem: 'Local não encontrado'
            });

        }

        res.status(200).json(local);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao buscar local'
        });

    }
}


// =========================================
// CADASTRAR LOCAL
// =========================================

async function cadastrarLocal(req, res) {

    try {

        const {
            nome,
            endereco,
            cidade,
            categoria,
            descricao,
            acessibilidade,
            imagem
        } = req.body;


        // Validação

        if (
            !nome ||
            !endereco ||
            !cidade ||
            !categoria
        ) {

            return res.status(400).json({
                mensagem: 'Nome, endereço, cidade e categoria são obrigatórios'
            });

        }


        const resultado = await localModel.cadastrarLocal(
            nome,
            endereco,
            cidade,
            categoria,
            descricao || '',
            acessibilidade || '',
            imagem || ''
        );


        res.status(201).json({
            mensagem: 'Local cadastrado com sucesso',
            id: resultado.insertId
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao cadastrar local'
        });

    }
}


// =========================================
// ATUALIZAR LOCAL
// =========================================

async function atualizarLocal(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            endereco,
            cidade,
            categoria,
            descricao,
            acessibilidade,
            imagem
        } = req.body;


        if (
            !nome ||
            !endereco ||
            !cidade ||
            !categoria
        ) {

            return res.status(400).json({
                mensagem: 'Nome, endereço, cidade e categoria são obrigatórios'
            });

        }


        const resultado = await localModel.atualizarLocal(
            id,
            nome,
            endereco,
            cidade,
            categoria,
            descricao || '',
            acessibilidade || '',
            imagem || ''
        );


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensagem: 'Local não encontrado'
            });

        }


        res.status(200).json({
            mensagem: 'Local atualizado com sucesso'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao atualizar local'
        });

    }
}


// =========================================
// EXCLUIR LOCAL
// =========================================

async function excluirLocal(req, res) {

    try {

        const { id } = req.params;

        const resultado = await localModel.excluirLocal(id);


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensagem: 'Local não encontrado'
            });

        }


        res.status(200).json({
            mensagem: 'Local excluído com sucesso'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao excluir local'
        });

    }
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