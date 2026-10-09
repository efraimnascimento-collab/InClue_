CREATE DATABASE  IF NOT EXISTS `inclue_novo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `inclue_novo`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: inclue_novo
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacoes`
--

DROP TABLE IF EXISTS `avaliacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nota` int NOT NULL,
  `comentario` text,
  `usuario_id` int NOT NULL,
  `local_id` int NOT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `foto` varchar(255) DEFAULT NULL,
  `necessidade_acessibilidade` text,
  `impacto_acessibilidade` text,
  PRIMARY KEY (`id`),
  KEY `fk_avaliacao_usuario` (`usuario_id`),
  KEY `fk_avaliacao_local` (`local_id`),
  CONSTRAINT `fk_avaliacao_local` FOREIGN KEY (`local_id`) REFERENCES `locais` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_avaliacao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_nota` CHECK (((`nota` >= 1) and (`nota` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes`
--

LOCK TABLES `avaliacoes` WRITE;
/*!40000 ALTER TABLE `avaliacoes` DISABLE KEYS */;
INSERT INTO `avaliacoes` VALUES (1,5,'Local muito acessível e bem estruturado.',2,1,'2026-08-29 18:38:50',NULL,NULL,NULL),(2,4,'Boa estrutura de acessibilidade.',2,2,'2026-08-29 18:38:50',NULL,NULL,NULL),(3,5,'Excelente local!',1,1,'2026-08-29 19:11:04',NULL,NULL,NULL),(4,5,'Gostei muito do local e achei a experiência muito boa.',1,1,'2026-08-29 19:53:44',NULL,NULL,NULL),(6,1,'odiei',5,4,'2026-08-29 23:53:28','/uploads/avaliacoes/1788058408554-74141095.png',NULL,NULL),(7,5,'foi uma experiencia otima',4,4,'2026-08-31 20:19:20','/uploads/avaliacoes/1788218360189-428468396.jpg',NULL,NULL);
/*!40000 ALTER TABLE `avaliacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curtidas`
--

DROP TABLE IF EXISTS `curtidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curtidas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `avaliacao_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`avaliacao_id`),
  KEY `avaliacao_id` (`avaliacao_id`),
  CONSTRAINT `curtidas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `curtidas_ibfk_2` FOREIGN KEY (`avaliacao_id`) REFERENCES `avaliacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curtidas`
--

LOCK TABLES `curtidas` WRITE;
/*!40000 ALTER TABLE `curtidas` DISABLE KEYS */;
INSERT INTO `curtidas` VALUES (6,4,1),(7,4,2),(3,4,3),(10,4,4),(14,5,1),(13,5,2),(17,5,3),(16,5,4),(15,5,6);
/*!40000 ALTER TABLE `curtidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `local_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`local_id`),
  KEY `local_id` (`local_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`local_id`) REFERENCES `locais` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (1,1,1),(5,4,4),(8,4,28),(12,4,29),(11,4,33);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locais`
--

DROP TABLE IF EXISTS `locais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `descricao` text,
  `acessibilidade` varchar(255) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locais`
--

LOCK TABLES `locais` WRITE;
/*!40000 ALTER TABLE `locais` DISABLE KEYS */;
INSERT INTO `locais` VALUES (1,'Pelourinho','Largo do Pelourinho','Salvador','Turismo','Centro Histórico de Salvador, conhecido por sua arquitetura, cultura e importância histórica.','Informações de acessibilidade compartilhadas pela comunidade.',''),(2,'Elevador Lacerda','Praça Tomé de Sousa, Centro Histórico','Salvador','Turismo','Um dos principais pontos turísticos de Salvador, ligando a Cidade Alta à Cidade Baixa.','Informações de acessibilidade compartilhadas pela comunidade.',''),(3,'Farol da Barra','Largo do Farol da Barra','Salvador','Turismo','Um dos cartões-postais de Salvador, localizado na região da Barra.','Informações de acessibilidade compartilhadas pela comunidade.',''),(4,'Porto da Barra','Avenida Sete de Setembro, Barra','Salvador','Turismo','Praia tradicional de Salvador, conhecida por sua importância histórica e paisagem.','Informações de acessibilidade compartilhadas pela comunidade.',''),(5,'Igreja e Convento de São Francisco','Largo do Cruzeiro de São Francisco, Pelourinho','Salvador','Turismo','Igreja histórica localizada no Pelourinho, conhecida por sua arquitetura e decoração barroca.','Informações de acessibilidade compartilhadas pela comunidade.','igreja-e-convento-de-sao-francisco.png'),(7,'Mercado Modelo','Praça Visconde de Cayru, Comércio','Salvador','Turismo','Tradicional mercado de Salvador, localizado próximo ao Elevador Lacerda e à Baía de Todos-os-Santos.','Informações de acessibilidade compartilhadas pela comunidade.','mercado-modelo.png'),(8,'Dique do Tororó','Avenida Vasco da Gama, Tororó','Salvador','Turismo','Lagoa urbana conhecida pelas esculturas dos orixás e pelo espaço de lazer ao redor.','Informações de acessibilidade compartilhadas pela comunidade.','dique-do-tororo.png'),(9,'Basílica de Nossa Senhora da Conceição da Praia','Rua da Conceição da Praia, Comércio','Salvador','Turismo','Igreja histórica localizada na Cidade Baixa, próxima ao Elevador Lacerda e ao Mercado Modelo.','Informações de acessibilidade compartilhadas pela comunidade.','basilica-de-nossa-senhora-da-conceicao-da-praia.png'),(10,'Museu de Arte da Bahia','Avenida Sete de Setembro, 2340 - Corredor da Vitória','Salvador','Museu','Museu dedicado à preservação e exposição de obras importantes da história da arte baiana.','Informações de acessibilidade compartilhadas pela comunidade.','museu-de-arte-da-bahia.png'),(11,'Museu de Arte Moderna da Bahia','Avenida Contorno, Solar do Unhão','Salvador','Museu','Museu de arte contemporânea localizado no histórico Solar do Unhão, com vista para a Baía de Todos-os-Santos.','Informações de acessibilidade compartilhadas pela comunidade.','museu-de-arte-moderna-da-bahia.png'),(13,'Fundação Casa de Jorge Amado','Largo do Pelourinho, 49','Salvador','Cultura','Centro cultural dedicado à preservação e divulgação da obra de Jorge Amado.','Informações de acessibilidade compartilhadas pela comunidade.','fundacao-casa-de-jorge-amado.png'),(14,'Palacete das Artes','Rua da Graça, 284 - Graça','Salvador','Museu','Espaço cultural e artístico instalado em um antigo palacete no bairro da Graça.','Informações de acessibilidade compartilhadas pela comunidade.','palacete-das-artes.png'),(15,'Casa do Benin','Rua Padre Agostinho Gomes, 17 - Pelourinho','Salvador','Cultura','Centro cultural que promove a relação histórica e cultural entre Salvador e o Benin.','Informações de acessibilidade compartilhadas pela comunidade.','casa-do-benin.png'),(16,'Museu Afro-Brasileiro','Largo Terreiro de Jesus, Pelourinho','Salvador','Museu','Museu dedicado à cultura africana e afro-brasileira e sua influência na formação da sociedade brasileira.','Informações de acessibilidade compartilhadas pela comunidade.','museu-afro-brasileiro.png'),(17,'Museu Náutico da Bahia','Largo do Farol da Barra, Barra','Salvador','Museu','Museu localizado no Forte de Santo Antônio da Barra, com exposições relacionadas à história marítima da Bahia.','Informações de acessibilidade compartilhadas pela comunidade.','museu-nautico-da-bahia.png'),(19,'Forte de Santa Maria','Praia do Porto da Barra, Barra','Salvador','Turismo','Forte histórico localizado na região do Porto da Barra, às margens da Baía de Todos-os-Santos.','Informações de acessibilidade compartilhadas pela comunidade.','forte-de-santa-maria.png'),(20,'Forte de São Diogo','Praia do Porto da Barra, Barra','Salvador','Turismo','Fortificação histórica localizada no Porto da Barra, com vista para a Baía de Todos-os-Santos.','Informações de acessibilidade compartilhadas pela comunidade.','forte-de-sao-diogo.png'),(21,'Ponta de Humaitá','Rua da Boa Viagem, Monte Serrat','Salvador','Turismo','Um dos locais mais conhecidos para apreciar o pôr do sol em Salvador, com vista para a Baía de Todos-os-Santos.','Informações de acessibilidade compartilhadas pela comunidade.','ponta-de-humaita.png'),(22,'Igreja de Nossa Senhora da Boa Viagem','Largo da Boa Viagem, Boa Viagem','Salvador','Turismo','Igreja histórica localizada na região da Boa Viagem, próxima à Ponta de Humaitá.','Informações de acessibilidade compartilhadas pela comunidade.','igreja-de-nossa-senhora-da-boa-viagem.png'),(23,'Basílica do Senhor do Bonfim','Largo do Bonfim, 1 - Bonfim','Salvador','Turismo','Importante templo religioso de Salvador e destino tradicional de peregrinação.','Informações de acessibilidade compartilhadas pela comunidade.','basilica-do-senhor-do-bonfim.png'),(24,'Arena Fonte Nova','Ladeira da Fonte das Pedras, s/n, Nazaré','Salvador','Turismo','A Arena Fonte Nova é um dos principais espaços esportivos de Salvador e também recebe eventos e atrações, sendo um ponto de interesse para visitantes da cidade.','Informações sobre acessibilidade devem ser consultadas antes da visita, considerando acesso, circulação e demais recursos disponíveis no local.','fonte-nova.png'),(25,'Jardim de Alah','Jardim de Alah, Salvador','Salvador','Turismo','O Jardim de Alah é uma área de lazer localizada na orla de Salvador, conhecida por sua praia, espaço aberto e área de convivência.','As condições de acessibilidade podem variar conforme o espaço e a área visitada.','jardim-de-alah.png'),(26,'Rio Vermelho','Rio Vermelho','Salvador','Cultura','O Rio Vermelho é um dos bairros tradicionais de Salvador, conhecido por sua cultura, gastronomia, manifestações populares e espaços de convivência.','As condições de acessibilidade podem variar de acordo com o espaço visitado.','rio-vermelho.png'),(27,'Praça da Sé','Praça da Sé, Centro Histórico','Salvador','História','A Praça da Sé está localizada no Centro Histórico de Salvador e é um importante espaço histórico e turístico da cidade.','As condições de circulação e acesso podem variar conforme o espaço e seu entorno.','praca-da-se.png'),(28,'Praça Castro Alves','Praça Castro Alves, Centro','Salvador','Cultura','A Praça Castro Alves é um importante espaço cultural e histórico de Salvador, localizado na região central da cidade.','As condições de circulação e acesso podem variar conforme o espaço e seu entorno.','praca-castro-alves.png'),(29,'Cidade da Música da Bahia','Praça Visconde de Cayru, Comércio','Salvador','Cultura','A Cidade da Música da Bahia é um espaço cultural dedicado à música e à história musical da Bahia, apresentando conteúdos e experiências sobre a produção musical do estado.','O local possui recursos de acessibilidade para receber diferentes públicos. Recomenda-se verificar as condições específicas antes da visita.','cidade-da-musica.png'),(30,'Igreja de Nossa Senhora do Rosário dos Pretos','Largo do Pelourinho, s/n, Centro Histórico','Salvador','História','A Igreja de Nossa Senhora do Rosário dos Pretos é um importante patrimônio histórico e cultural de Salvador, localizada no Centro Histórico da cidade e relacionada à história e à cultura afro-brasileira.','As condições de acessibilidade podem variar de acordo com as áreas do local. Recomenda-se verificar as condições de acesso antes da visita.','igreja-de-nossa-senhora-do-rosario-dos-pretos.png'),(33,'Lagoa do Abaeté','Lagoa do Abaeté, Itapuã','Salvador','Turismo','A Lagoa do Abaeté é um importante ponto turístico de Salvador, localizada no bairro de Itapuã e conhecida por sua paisagem natural e suas áreas de convivência.','As condições de acessibilidade podem variar conforme as áreas e os caminhos de acesso ao local. Recomenda-se verificar as condições antes da visita.','lagoa-do-abaete.png');
/*!40000 ALTER TABLE `locais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recuperacao_senha`
--

DROP TABLE IF EXISTS `recuperacao_senha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recuperacao_senha` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expira_em` datetime NOT NULL,
  `usado_em` datetime DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `fk_recuperacao_usuario` (`usuario_id`),
  CONSTRAINT `fk_recuperacao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recuperacao_senha`
--

LOCK TABLES `recuperacao_senha` WRITE;
/*!40000 ALTER TABLE `recuperacao_senha` DISABLE KEYS */;
INSERT INTO `recuperacao_senha` VALUES (1,4,'6d2f33bf5aef196ac04d09134c2f0bac8cf615b5530fb78eb788a8f7a630b170','2026-10-09 21:30:39',NULL,'2026-10-09 21:15:39');
/*!40000 ALTER TABLE `recuperacao_senha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` varchar(20) NOT NULL DEFAULT 'usuario',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador',NULL,NULL,'admin@inclue.com','123456','admin'),(2,'Efraim dos Santos Nascimento',NULL,NULL,'efraim@inclue.com','123456','usuario'),(3,'Teste InClue',NULL,NULL,'teste@inclue.com','123456','usuario'),(4,'Efraim','efralilix',NULL,'honeyalberto125@gmail.com','123456','usuario'),(5,'Efraimm','efralilix4','/uploads/perfis/perfil-5-1788114345574.jpg','efraimnascimento8@gmail.com','140409','usuario');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-09 19:33:53
