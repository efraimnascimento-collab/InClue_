const express = require('express');
const cors = require('cors');

const connection = require('./database/connection');

const usuarioRoutes = require('./routes/usuarioRoutes');
const localRoutes = require('./routes/localRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');

// NOVA ROTA - CURTIDAS DAS AVALIAÇÕES
const curtidaRoutes = require('./routes/curtidaRoutes');

const app = express();


// =========================================
// CONFIGURAÇÕES
// =========================================

app.use(cors());

app.use(express.json());


// =========================================
// ARQUIVOS DE UPLOAD
// =========================================

app.use(
    '/uploads',
    express.static('uploads')
);


// =========================================
// ROTAS
// =========================================

app.use(usuarioRoutes);

app.use(localRoutes);

app.use(avaliacaoRoutes);

app.use('/', favoritoRoutes);
// NOVA ROTA
app.use("/curtidas", curtidaRoutes);


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

        const [resultado] =
            await connection.query(
                'SELECT 1 AS teste'
            );

        res.status(200).json({

            mensagem:
                'Conexão com o banco funcionando!',

            resultado:
                resultado

        });

    } catch (erro) {

        console.error(
            'Erro no banco:',
            erro
        );

        res.status(500).json({

            mensagem:
                'Erro ao conectar com o banco de dados'

        });

    }

});


// =========================================
// INICIAR SERVIDOR
// =========================================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );

});