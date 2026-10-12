require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connection = require('./database/connection');

const usuarioRoutes = require('./routes/usuarioRoutes');
const localRoutes = require('./routes/localRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const curtidaRoutes = require('./routes/curtidaRoutes');
const contatoRoutes = require('./routes/contatoRoutes');

const app = express();

// =========================================
// CONFIGURAÇÕES
// =========================================

app.use(cors());

app.use(express.json());

// =========================================
// ARQUIVOS DE UPLOAD
// =========================================

const pastaUploads = path.join(__dirname, 'uploads');

app.use('/uploads', express.static(pastaUploads));

// =========================================
// ROTAS
// =========================================

app.use(usuarioRoutes);
app.use(localRoutes);
app.use(avaliacaoRoutes);
app.use('/', favoritoRoutes);
app.use('/curtidas', curtidaRoutes);
app.use(contatoRoutes);

// =========================================
// ROTA PRINCIPAL
// =========================================

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do InClue funcionando!'
    });
});

// =========================================
// TESTE DE CONEXÃO COM MYSQL
// =========================================

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await connection.query(
            'SELECT 1 AS teste'
        );

        res.status(200).json({
            mensagem: 'Conexão com o banco funcionando!',
            resultado
        });
    } catch (erro) {
        console.error('Erro no banco:', erro);

        res.status(500).json({
            mensagem: 'Erro ao conectar com o banco de dados.'
        });
    }
});

// =========================================
// TRATAMENTO GERAL DE ERROS
// =========================================

app.use((erro, req, res, next) => {
    console.error('Erro na API:', erro);

    if (res.headersSent) {
        return next(erro);
    }

    res.status(500).json({
        mensagem: 'Ocorreu um erro interno no servidor.'
    });
});

// =========================================
// INICIAR SERVIDOR
// =========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});