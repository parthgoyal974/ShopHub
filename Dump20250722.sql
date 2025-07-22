CREATE DATABASE  IF NOT EXISTS `authentication` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `authentication`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: authentication
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `cartId` (`cartId`),
  KEY `productId` (`productId`),
  CONSTRAINT `cartitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitems`
--

LOCK TABLES `cartitems` WRITE;
/*!40000 ALTER TABLE `cartitems` DISABLE KEYS */;
INSERT INTO `cartitems` VALUES (12,1,3,2),(25,3,1,1),(67,5,4,1),(68,5,5,1);
/*!40000 ALTER TABLE `cartitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (5,20),(6,23);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Beauty'),(3,'Books'),(1,'Electronics'),(2,'Furniture'),(5,'Sport');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderitems_ibfk_7` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitems_ibfk_8` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (7,7,3,1,357.99),(8,8,4,1,15.99),(9,8,6,1,32),(10,9,6,6,32),(11,9,5,5,8.85),(12,10,3,1,357.99),(13,10,7,1,357.99),(18,13,7,1,357.99),(19,13,1,1,799.99),(20,14,6,1,32),(21,14,3,1,357.99),(36,21,2,1,249.99),(37,21,3,1,357.99),(38,21,4,1,15.99),(39,22,5,1,8.85),(40,22,1,1,799.99),(41,23,2,1,249.99),(42,23,4,1,15.99),(43,24,3,1,357.99),(44,24,1,1,799.99),(45,25,5,1,8.85),(46,25,3,1,357.99),(47,26,3,1,357.99),(48,27,3,1,357.99),(49,28,4,1,15.99),(50,29,7,1,357.99),(51,30,2,1,249.99),(52,31,4,1,15.99),(53,32,3,1,357.99),(54,33,7,1,357.99),(55,34,2,1,249.99),(56,35,3,1,357.99),(57,36,1,2,799.99),(58,36,2,2,249.99),(59,36,4,2,15.99),(60,37,2,1,249.99);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `total` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'completed',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentIntentId` varchar(255) DEFAULT NULL,
  `billingAddress` json DEFAULT NULL,
  `receiptUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (7,20,357.99,'completed','2025-06-23 02:36:04','2025-06-23 02:36:04',NULL,NULL,NULL),(8,20,47.99,'completed','2025-06-23 05:07:10','2025-06-23 05:07:10',NULL,NULL,NULL),(9,20,236.25,'completed','2025-06-23 05:14:22','2025-06-23 05:14:22',NULL,NULL,NULL),(10,20,715.98,'completed','2025-06-26 04:30:55','2025-06-26 04:30:55',NULL,NULL,NULL),(13,20,1157.98,'completed','2025-06-29 18:57:32','2025-06-29 18:57:32',NULL,NULL,NULL),(14,20,389.99,'completed','2025-06-29 18:58:18','2025-06-29 18:58:18',NULL,NULL,NULL),(21,20,623.97,'completed','2025-06-29 19:35:19','2025-06-29 19:35:19','pi_3RfR0RR4ZyS2iPO31J2WAkdz','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}',NULL),(22,20,808.84,'completed','2025-06-29 19:37:17','2025-06-29 19:37:17','pi_3RfR2LR4ZyS2iPO32rvCcmjm','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}',NULL),(23,23,265.98,'shipped','2025-06-30 05:01:06','2025-06-30 05:25:23','pi_3RfZpzR4ZyS2iPO32QlFpos4','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}',NULL),(24,20,1157.98,'completed','2025-06-30 05:29:05','2025-06-30 05:29:05',NULL,NULL,NULL),(25,20,366.84,'completed','2025-06-30 05:31:16','2025-06-30 05:31:16',NULL,NULL,NULL),(26,20,357.99,'completed','2025-06-30 05:36:26','2025-06-30 05:36:26',NULL,NULL,NULL),(27,20,357.99,'completed','2025-06-30 05:39:33','2025-06-30 05:39:34','pi_3RfaRCR4ZyS2iPO300CO4SQj','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','Receipt not available'),(28,20,15.99,'completed','2025-06-30 05:46:09','2025-06-30 05:46:11','pi_3RfaXZR4ZyS2iPO30ENvNF7E','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','Receipt not available'),(29,20,357.99,'completed','2025-06-30 05:50:27','2025-06-30 05:50:28','pi_3RfabkR4ZyS2iPO32dMXSisc','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','Receipt not available'),(30,20,249.99,'shipped','2025-06-30 23:38:22','2025-07-01 00:21:58','pi_3RfrHCR4ZyS2iPO32jv5Zuur','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKO-_jMMGMgb0p3dZkPY6LBb_Y3R715exkpi4xCO-p3fOdSxBipLkGyGd-20-8OdlNGeBjqesXMds2Jfv'),(31,20,15.99,'completed','2025-07-02 04:22:43','2025-07-02 04:22:44','pi_3RgIBwR4ZyS2iPO31bZ6TsCa','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKJToksMGMgZKfA5tZI86LBbvl71exdq5N3uVuQ6pvLlH7DZmWikHiaEv0MBWrR1VH1YG62nS4NEpyJ3_'),(32,20,357.99,'completed','2025-07-02 04:24:56','2025-07-02 04:24:57','pi_3RgIE5R4ZyS2iPO31YTHFErd','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKJnpksMGMgYk1405u686LBaPZdhGpRivNHNZSauSE-MfHZkFGpBMBBT_ToQd9PUaBskyJt3BNYsE4G72'),(33,20,357.99,'completed','2025-07-02 04:29:22','2025-07-02 04:29:24','pi_3RgIINR4ZyS2iPO317k7gGAz','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKKTrksMGMgYYAwEAams6LBawOEd-Dy_r2fWRCLyvkmNONgECBv4kEfEwgkvXYgq5-icPpNLrb9wA8a6p'),(34,20,249.99,'completed','2025-07-02 04:31:38','2025-07-02 04:31:40','pi_3RgIKYR4ZyS2iPO3121RVs2F','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKKvsksMGMgadlpYafEI6LBY4hK2ZErlfeA3qCU-9bnk7s1Hc0eSxNNZkcJIuBuwU6O1pkKcgY0iBc94U'),(35,20,357.99,'completed','2025-07-02 05:31:57','2025-07-02 05:31:58','pi_3RgJGwR4ZyS2iPO30LujclOq','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKM6Ik8MGMgYzXgBQwr86LBbhMrzJWnAFSEIAbmCPV74lTjapTpB7LFwnJG3MQv4nytAzOHm2ComClPDB'),(36,20,2131.94,'completed','2025-07-03 11:44:55','2025-07-03 11:44:56','pi_3RglZRR4ZyS2iPO30dTH3wl2','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKLnamcMGMgbntRjI2kU6LBZ9Y38nCbG2DUyKIfBSw-80kihgNIy3BBrkG6ukScQgqeBgY7ZPiUCIUo0l'),(37,20,249.99,'completed','2025-07-08 15:51:18','2025-07-08 15:51:19','pi_3RidnZR4ZyS2iPO3077hdTzE','{\"city\": \"Chandigarh State\", \"line1\": \"Highway\", \"line2\": null, \"state\": \"PB\", \"country\": \"IN\", \"postal_code\": \"140413\"}','https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUmJWdVJSNFp5UzJpUE8zKPb8tMMGMga7KjlO0T46LBZbn-PlkVXcnlT9WJE9YaeyHWqq2EnrrmRLxJyRCqYuHsMNNSihwY3kekEX');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `purpose` varchar(255) NOT NULL DEFAULT 'verification',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES (2,'parth.goyal2023@vitstudent.ac.in','433506','2025-06-17 03:16:39','2025-06-17 03:01:39','2025-06-17 03:01:39','verification'),(3,'parth.goyal202@vitent.ac.in','241742','2025-06-17 06:39:35','2025-06-17 06:24:35','2025-06-17 06:24:35','verification'),(4,'parthgoyal5404@gmail.com','769848','2025-06-17 06:42:32','2025-06-17 06:27:32','2025-06-17 06:27:32','verification'),(5,'parthgoyal54041@gmail.com','254637','2025-06-17 06:49:26','2025-06-17 06:34:26','2025-06-17 06:34:26','verification'),(7,'parth@gmail.com','469978','2025-06-17 07:50:57','2025-06-17 07:35:57','2025-06-17 07:35:57','verification'),(10,'parth.goyal@gmail.com','312642','2025-06-17 08:22:40','2025-06-17 08:07:40','2025-06-17 08:07:40','verification'),(11,'parthgoyal974@gmail.com','213897','2025-06-17 08:23:30','2025-06-17 08:08:30','2025-06-17 08:08:30','verification'),(16,'parthgoyal0097@gmail.com','630165','2025-07-08 16:17:57','2025-07-08 16:02:57','2025-07-08 16:02:57','verification');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `image` varchar(255) NOT NULL,
  `rating` float DEFAULT '0',
  `categoryId` int NOT NULL,
  `subcategoryId` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `subcategoryId` (`subcategoryId`),
  FULLTEXT KEY `products_fulltext_idx` (`name`,`description`),
  CONSTRAINT `products_ibfk_11` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `products_ibfk_12` FOREIGN KEY (`subcategoryId`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Modern Sofa',799.99,'1749199539916-416736386.jpeg',3.5,2,3,'sofa'),(2,'Smart Fitness Watch',249.99,'1749121323925-910587829.jpg',3.5,1,2,'wkjdwkndfk'),(3,'Wireless Bluetooth Headphones',357.99,'1749121351272-866227353.jpg',4,1,2,NULL),(4,'Atomic Habits',15.99,'1749121452562-742409532.jpeg',4.9,3,NULL,NULL),(5,'\\tMaybelline Foundation',8.85,'1749121690556-101162526.jpeg',4.6,4,4,''),(6,'Adidas Soccer Ball',32,'1749121729372-869486894.jpeg',4.8,5,NULL,NULL),(7,'Ergonomic Office Chair',357.99,'1749121756886-803975587.jpg',4.9,2,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `rating` float NOT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `userId` (`userId`),
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,2,20,5,'Good\n','2025-06-23 05:10:02','2025-06-23 05:10:02'),(2,2,20,2,'bad','2025-06-23 05:10:22','2025-06-23 05:10:22');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20250605224413-create-subcategory.js'),('20250605224541-add-subcategoryid-to-product.js'),('20250606080559-add-fulltext-index-to-products.js'),('20250606101440-add-reviews.js'),('20250617020249-add-verified-to-users.js'),('20250617020411-create-otp-table.js'),('20250702044337-add-purpose-to-otp.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parentId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,'Smart Watch',1),(2,'Headphones',1),(3,'Chair',2),(4,'Foundation',4);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unverified_users`
--

DROP TABLE IF EXISTS `unverified_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unverified_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unverified_users`
--

LOCK TABLES `unverified_users` WRITE;
/*!40000 ALTER TABLE `unverified_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `unverified_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_unique` (`username`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (20,'Parth','parth.goyal44@gmail.com','$2b$10$TM0aY9MxIn3klQo6DdRGwOsGgwwdDn3kFvl6cfGUiyrrjrAjvCMA.',1,0,'2025-06-26 04:44:06'),(21,'Parth1','parth@gmail.com','Parth#974',0,0,'2025-06-26 04:44:06'),(23,'Parth2','parthgoyal974@gmail.com','$2b$10$fxVbzUXqxuwMH/n8Vq6QsOvvYNvlDtGr3YdrMTK.eE/Ro1h0TkGYG',1,0,'2025-06-26 04:44:06'),(24,'Parth3','parth.goyal@gmail.com','$2b$10$q6tdIG3umPenw1D3G/keb.m2BAkmmO8RXuaeLASgimDHJiRYmXBG.',1,0,'2025-07-04 05:10:22'),(25,'jkbcjd','parthgoyal0097@gmail.com','$2b$10$7EX8uswSZgSLxgjCfRwiPurebDQ8CMVKu7JTBsTWjPmtnAa7aIyCm',0,0,'2025-07-08 16:02:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-22 13:06:25
