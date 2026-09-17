# InClue

## Plataforma de Turismo Acessível

O **InClue** é uma plataforma web desenvolvida com foco em turismo acessível, inclusão e compartilhamento de experiências.

A proposta do projeto é facilitar o acesso a informações sobre a acessibilidade de diferentes locais, permitindo que usuários consultem avaliações e compartilhem suas próprias experiências.

Por meio da plataforma, é possível encontrar locais, visualizar avaliações, registrar informações relacionadas à acessibilidade, adicionar fotografias e interagir com outros usuários.

---

## Instituições

**SESI Manuel Querino**  
**SENAI Candeias**

### Orientador

**Adalberto Santana**

---

## Equipe InClue

Os integrantes da equipe, organizados em ordem alfabética:

- Efraim Nascimento
- Grazielle Miranda
- Júlia Abreu
- Maria Luiza Santana

---

## Sobre o projeto

O InClue foi desenvolvido com o objetivo de contribuir para um turismo mais acessível, reunindo informações que podem ajudar pessoas a conhecer melhor as condições de acessibilidade de diferentes locais.

A plataforma utiliza avaliações feitas pelos próprios usuários para reunir experiências reais sobre os locais cadastrados.

Além de consultar informações, os usuários também podem contribuir com a plataforma realizando avaliações, adicionando comentários, fotografias e informações específicas sobre acessibilidade.

Dessa forma, o InClue busca criar um espaço colaborativo no qual as experiências dos usuários possam auxiliar outras pessoas no planejamento de suas visitas.

---

## Objetivo

O principal objetivo do InClue é desenvolver uma plataforma que facilite o acesso a informações sobre acessibilidade em locais turísticos.

Entre os objetivos do projeto estão:

- Incentivar o turismo acessível;
- Facilitar a consulta de informações sobre locais;
- Permitir o compartilhamento de experiências;
- Disponibilizar informações relacionadas à acessibilidade;
- Permitir avaliações com notas e comentários;
- Possibilitar o envio de fotografias;
- Criar uma experiência de navegação simples e organizada;
- Promover maior acesso à informação sobre os locais.

---

## Funcionalidades

### Cadastro e Login

O sistema possui páginas de cadastro e login para permitir que os usuários criem suas contas e acessem as funcionalidades da plataforma.

### Consulta de locais

Os usuários podem visualizar os locais cadastrados no sistema e consultar informações relacionadas a eles.

### Avaliações

Os usuários podem realizar avaliações dos locais, informando:

- Nota de 1 a 5 estrelas;
- Comentário;
- Fotografia;
- Necessidade de acessibilidade considerada;
- Impacto que afetou a acessibilidade do local.

### Informações de acessibilidade

Durante o processo de avaliação, o usuário pode informar quais necessidades de acessibilidade foram consideradas e quais situações afetaram a acessibilidade durante sua experiência.

Essas informações são armazenadas no banco de dados e apresentadas posteriormente junto às avaliações.

### Curtidas

As avaliações podem receber curtidas de outros usuários, permitindo uma forma de interação dentro da plataforma.

### Favoritos

Os usuários também podem adicionar locais aos favoritos, facilitando o acesso posterior aos locais de seu interesse.

### Perfil

A plataforma possui uma área de perfil para apresentação e gerenciamento das informações do usuário.

### Fotografias

As avaliações podem receber fotografias enviadas pelos usuários.

As imagens são armazenadas pelo servidor e podem ser visualizadas posteriormente na plataforma.

### Dashboard

O projeto possui um dashboard responsável por apresentar informações e funcionalidades da plataforma de forma organizada.

### Contato

A plataforma possui uma página de contato para comunicação relacionada ao projeto.

### Sobre

A página Sobre apresenta informações sobre o InClue e sua proposta.

---

## Tecnologias utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

O frontend foi desenvolvido com HTML, CSS e JavaScript, utilizando arquivos separados para organizar a estrutura, os estilos e as funcionalidades de cada página.

### Back-end

- Node.js
- Express.js
- Multer

O backend é responsável pelo funcionamento da API, processamento das requisições, comunicação com o banco de dados e gerenciamento dos arquivos enviados.

### Banco de dados

- MySQL

O MySQL é utilizado para armazenar as informações relacionadas aos usuários, locais, avaliações, curtidas e favoritos.

---

## Estrutura do projeto

O projeto está dividido principalmente entre **frontend**, **backend** e **banco de dados**.

```text
InClue/
│
├── backend/
│   ├── controllers/
│   │   ├── avaliacaoController.js
│   │   ├── curtidaController.js
│   │   ├── favoritoController.js
│   │   ├── localController.js
│   │   └── usuarioController.js
│   │
│   ├── database/
│   │   └── connection.js
│   │
│   ├── models/
│   │   ├── avaliacaoModel.js
│   │   ├── curtidaModel.js
│   │   ├── favoritoModel.js
│   │   ├── localModel.js
│   │   └── usuarioModel.js
│   │
│   ├── routes/
│   │   ├── avaliacaoRoutes.js
│   │   ├── curtidaRoutes.js
│   │   ├── favoritoRoutes.js
│   │   ├── localRoutes.js
│   │   └── usuarioRoutes.js
│   │
│   ├── uploads/
│   │   ├── avaliacoes/
│   │   └── perfis/
│   │
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── database/
│   └── inclue_novo.sql
│
├── frontend/
│   ├── css/
│   │   ├── acessibilidade.css
│   │   ├── avaliacoes.css
│   │   ├── avaliar.css
│   │   ├── cadastro.css
│   │   ├── contato.css
│   │   ├── login.css
│   │   ├── perfil-flutuante.css
│   │   ├── perfil.css
│   │   ├── sobre.css
│   │   └── style.css
│   │
│   ├── img/
│   │   ├── locais/
│   │   ├── banner1.png
│   │   ├── banner2.png
│   │   ├── banner3.png
│   │   ├── banner4.png
│   │   ├── banner5.png
│   │   ├── inclue.png
│   │   └── perfil-padrao.png
│   │
│   ├── js/
│   │   ├── acessibilidade.js
│   │   ├── avaliacoes.js
│   │   ├── avaliar.js
│   │   ├── cadastro.js
│   │   ├── contato.js
│   │   ├── dashboard.js
│   │   ├── favoritos.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── perfil-flutuante.js
│   │   └── perfil.js
│   │
│   ├── acessibilidade.html
│   ├── avaliacoes.html
│   ├── avaliar.html
│   ├── cadastro.html
│   ├── contato.html
│   ├── favoritos.html
│   ├── index.html
│   ├── login.html
│   ├── perfil.html
│   └── sobre.html
│
├── .gitignore
└── README.md