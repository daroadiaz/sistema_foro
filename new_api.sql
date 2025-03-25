-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         8.0.39 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para new_api
CREATE DATABASE IF NOT EXISTS `new_api` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `new_api`;

-- Volcando estructura para tabla new_api.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla new_api.categorias: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
	(1, 'Tecnología', 'Temas relacionados con tecnología, gadgets y programación'),
	(2, 'Videojuegos', 'Discusiones sobre videojuegos, consolas y gaming'),
	(3, 'Música', 'Discusiones sobre artistas, géneros musicales y lanzamientos'),
	(4, 'Cine', 'Análisis de películas, series y todo lo relacionado con cine');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;

-- Volcando estructura para tabla new_api.comentarios
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenido` text NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `ultima_actualizacion` datetime DEFAULT NULL,
  `esta_baneado` tinyint(1) NOT NULL DEFAULT '0',
  `razon_baneo` varchar(255) DEFAULT NULL,
  `autor_id` bigint NOT NULL,
  `tema_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autor_id` (`autor_id`),
  KEY `tema_id` (`tema_id`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`tema_id`) REFERENCES `temas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla new_api.comentarios: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
INSERT INTO `comentarios` (`id`, `contenido`, `fecha_creacion`, `ultima_actualizacion`, `esta_baneado`, `razon_baneo`, `autor_id`, `tema_id`) VALUES
	(1, 'Totalmente de acuerdo con tu análisis sobre la IA generativa.', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 3, 1),
	(2, 'Yo añadiría a esa lista el juego XYZ, es una joya poco conocida.', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 2, 2),
	(3, 'Gracias por compartir estas recomendaciones, ya estoy escuchando a la banda ABC.', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 1, 3);
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;

-- Volcando estructura para tabla new_api.temas
CREATE TABLE IF NOT EXISTS `temas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `ultima_actualizacion` datetime DEFAULT NULL,
  `esta_baneado` tinyint(1) NOT NULL DEFAULT '0',
  `razon_baneo` varchar(255) DEFAULT NULL,
  `autor_id` bigint NOT NULL,
  `categoria_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autor_id` (`autor_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `temas_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `temas_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla new_api.temas: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `temas` DISABLE KEYS */;
INSERT INTO `temas` (`id`, `titulo`, `contenido`, `fecha_creacion`, `ultima_actualizacion`, `esta_baneado`, `razon_baneo`, `autor_id`, `categoria_id`) VALUES
	(1, 'Novedades en Inteligencia Artificial', 'Discutamos los últimos avances en IA y machine learning...', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 2, 1),
	(2, 'Los mejores juegos de 2025', 'Mi ranking personal de los mejores videojuegos lanzados este año...', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 3, 2),
	(3, 'Bandas emergentes que deberías conocer', 'Estas son algunas bandas nuevas que han lanzado álbumes interesantes...', '2025-03-24 22:22:27', '2025-03-24 22:22:27', 0, NULL, 2, 3);
/*!40000 ALTER TABLE `temas` ENABLE KEYS */;

-- Volcando estructura para tabla new_api.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `rol` varchar(20) NOT NULL,
  `esta_activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla new_api.usuarios: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`id`, `nombre`, `username`, `email`, `password`, `fecha_registro`, `rol`, `esta_activo`) VALUES
	(1, 'Administrador', 'admin', 'admin@example.com', 'password123', '2025-03-24 22:22:27', 'ADMINISTRADOR', 1),
	(2, 'Usuario Normal', 'usuario1', 'usuario1@example.com', 'password123', '2025-03-24 22:22:27', 'USUARIO', 1),
	(3, 'Usuario Frecuente', 'usuario2', 'usuario2@example.com', 'password123', '2025-03-24 22:22:27', 'USUARIO', 1),
	(4, 'Usuario Prueba', 'usuario_test', 'usuario_test@example.com', 'password123', '2025-03-25 01:25:29', 'USUARIO', 1),
	(5, 'Usuario ', 'usuario_test123', 'usuario123_test@example.com', 'password123', '2025-03-25 01:50:19', 'USUARIO', 1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
