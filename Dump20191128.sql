-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: tlugame
-- ------------------------------------------------------
-- Server version	8.0.17

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
-- Table structure for table `achievements`
--

DROP TABLE IF EXISTS `achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(250) NOT NULL,
  `src` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievements`
--

LOCK TABLES `achievements` WRITE;
/*!40000 ALTER TABLE `achievements` DISABLE KEYS */;
INSERT INTO `achievements` VALUES (1,'Staff Member','They are a staff in the game!','img/achievements/2.png'),(2,'Founder','They supported the game when it first came out!','img/achievements/1.png'),(3,'Bug Hunter','Wait... people actually report bugs and not exploit them?','img/achievements/3.png');
/*!40000 ALTER TABLE `achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beasts`
--

DROP TABLE IF EXISTS `beasts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beasts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `hp` int(11) NOT NULL DEFAULT '0',
  `atk` int(11) NOT NULL DEFAULT '0',
  `def` int(11) NOT NULL DEFAULT '0',
  `acc` int(11) NOT NULL DEFAULT '0',
  `eva` int(11) NOT NULL DEFAULT '0',
  `gold` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  `mithril` int(11) NOT NULL DEFAULT '0',
  `timber` int(11) NOT NULL DEFAULT '0',
  `stones` int(11) NOT NULL DEFAULT '0',
  `reputation` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beasts`
--

LOCK TABLES `beasts` WRITE;
/*!40000 ALTER TABLE `beasts` DISABLE KEYS */;
INSERT INTO `beasts` VALUES (1,'Colossus',100000,500000,2000,4000,1000,0,0,0,0,1000,0),(2,'Chaotic Knight',100000,500000,3000,4000,1000,0,0,0,0,0,1),(3,'Ancient Treeant',100000,500000,2000,4000,1000,0,0,0,1000,0,0),(4,'Corrupt Communist',300000,500000,3000,4000,1000,1000000,0,0,0,0,0),(5,'Level 100 Mafia Boss',1000000,500000,30000,4000,1000,0,10,0,0,0,0),(6,'Level 1 Crook',1000,500,30,4000,1000,0,1,0,0,0,0),(7,'Stone Golem',50000,500000,2000,4000,1000,0,0,0,0,500,0),(8,'Enchanted Sapling',50000,500000,2000,4000,1000,0,0,0,500,0,0),(9,'Usurper',50000,500000,3000,4000,1000,0,0,0,0,0,1),(10,'Red Baron',50000,500000,3000,4000,1000,0,0,0,0,0,1);
/*!40000 ALTER TABLE `beasts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel` varchar(10) NOT NULL DEFAULT '',
  `user` int(11) NOT NULL,
  `time` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `message` varchar(350) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,'',2,'2019-09-07 21:34:59.808','placeholder message'),(2,'',2,'2019-09-07 21:34:59.808','test'),(3,'global',1,'2019-09-07 21:34:59.808','Drak has purchased <b class=\"text-primary\">50</b> minutes of <b>global double</b> for everyone!'),(4,'global',1,'2019-09-07 21:34:59.808','Drak has found a small treasure trove of 500,000 gold!'),(5,'',3,'2019-09-07 21:34:59.808','stupid ***'),(6,'',3,'2019-09-07 21:34:59.808','stupud ***'),(7,'',3,'2019-09-07 21:34:59.808','is stupid *** still on?'),(8,'',2,'2019-09-07 21:34:59.808','hey'),(9,'global',1,'2019-09-07 21:34:59.808','Hentai has stumbled upon a pouch containing 1 credit!'),(10,'',2,'2019-09-07 21:34:59.808','what a loser'),(11,'',3,'2019-09-07 21:34:59.808','bro i need more stats'),(12,'',2,'2019-09-07 21:34:59.808','harder mobs have higher stat drop chance'),(13,'global',1,'2019-09-07 21:34:59.808','Hentai has found a small treasure trove of 500,000 gold!'),(14,'',3,'2019-09-07 21:34:59.808','hm'),(15,'',2,'2019-09-07 21:34:59.808','ok'),(16,'',3,'2019-09-07 21:34:59.808','1/2000  u say'),(17,'',2,'2019-09-07 21:34:59.808','ok'),(18,'',3,'2019-09-07 21:34:59.808','what is the chance for the small puch'),(19,'',3,'2019-09-07 21:34:59.808','pouch'),(20,'',2,'2019-09-07 21:34:59.808','it\'s all 1/2000'),(21,'',2,'2019-09-07 21:34:59.808','oh'),(22,'',2,'2019-09-07 21:34:59.808','because of the triple'),(23,'',2,'2019-09-07 21:34:59.808','it\'s like 3/2000'),(24,'',3,'2019-09-07 21:34:59.808','but i got 2'),(25,'',2,'2019-09-07 21:34:59.808','1/666'),(26,'',3,'2019-09-07 21:34:59.808','very e'),(27,'',3,'2019-09-07 21:34:59.808','z'),(28,'',2,'2019-09-07 21:34:59.808','ok'),(29,'global',1,'2019-09-07 21:34:59.808','The Level 1 Crook has been spotted at (7, 9) of Space Station X.'),(30,'global',1,'2019-09-07 21:34:59.808','Great performance! Hentai has slain the Level 1 Crook and is awarded with Credits: 1!'),(31,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(32,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(33,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(34,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(35,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(36,'',3,'2019-09-07 21:34:59.808','where is my 3x'),(37,'global',1,'2019-09-07 21:34:59.808','Hentai has found a small treasure trove of 500,000 gold!'),(38,'global',1,'2019-09-07 21:34:59.808','The Usurper has been spotted at (1, 9) of Space Station X.'),(39,'global',1,'2019-09-07 21:34:59.808','Drak has stumbled upon a pouch containing 1 credit!'),(40,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small cache of 100 mithril!'),(41,'global',1,'2019-09-07 21:34:59.808','canhuck has stumbled upon a pouch containing 1 credit!'),(42,'global',1,'2019-09-07 21:34:59.808','canhuck has stumbled upon a pouch containing 1 credit!'),(43,'global',1,'2019-09-07 21:34:59.808','The Usurper has been spotted at (0, 0) of The Jungle.'),(44,'global',1,'2019-09-07 21:34:59.808','The Enchanted Sapling has been spotted at (22, 22) of The Jungle.'),(45,'global',1,'2019-09-07 21:34:59.808','Drak has found a chest containing 2 credits!'),(46,'global',1,'2019-09-07 21:34:59.808','The Colossus has been spotted at (9, 8) of Space Station X.'),(47,'global',1,'2019-09-07 21:34:59.808','The Corrupt Communist has been spotted at (5, 1) of Space Station X.'),(48,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small treasure trove of 500,000 gold!'),(49,'global',1,'2019-09-07 21:34:59.808','Ruffcrew has found a treasure trove of 1,000,000 gold!'),(50,'global',1,'2019-09-07 21:34:59.808','The Level 1 Crook has been spotted at (3, 5) of Space Station X.'),(51,'global',1,'2019-09-07 21:34:59.808','The Stone Golem has been spotted at (9, 4) of Space Station X.'),(52,'global',1,'2019-09-07 21:34:59.808','The Colossus has been spotted at (5, 2) of Space Station X.'),(53,'',2,'2019-09-07 21:34:59.808','fixed mithril upgrade bug'),(54,'global',1,'2019-09-07 21:34:59.808','TheManic has found a chest containing 2 credits!'),(55,'',2,'2019-09-07 21:34:59.808','pushed visual update, game might look weird if page isn\'t refreshed'),(56,'',2,'2019-09-07 21:34:59.808','quest visual is bugged, will fix ~30 minutes'),(57,'',2,'2019-09-07 21:34:59.808','refreshing will fix quest visual now'),(58,'',9,'2019-09-07 21:34:59.808','ahh evening all'),(59,'',9,'2019-09-07 21:34:59.808','how do i get 25 gems on the story line then'),(60,'',6,'2019-09-07 21:34:59.808','I got mine doje by attacking random mobs.'),(61,'',6,'2019-09-07 21:34:59.808','Mine*'),(62,'',9,'2019-09-07 21:34:59.808','ok thanks, jut not had any drop yet'),(63,'',2,'2019-09-07 21:34:59.808','it\'s a 10% drop from the Corrupt Pilot'),(64,'',6,'2019-09-07 21:34:59.808','I think thats who i was attacking when i done mine.'),(65,'',9,'2019-09-07 21:34:59.808','ah right bit high leel still then for me cheers mr admin SIR'),(66,'global',1,'2019-09-07 21:34:59.808','The Level 1 Crook has been spotted at (6, 2) of Space Station X.'),(67,'global',1,'2019-09-07 21:34:59.808','Great performance! TheManic has slain the Level 1 Crook and is awarded with Credits: 1!'),(68,'global',1,'2019-09-07 21:34:59.808','Great performance! TheManic has slain the Level 1 Crook and is awarded with Credits: 1!'),(69,'global',1,'2019-09-07 21:34:59.808','The Level 1 Crook has been spotted at (1, 3) of Space Station X.'),(70,'global',1,'2019-09-07 21:34:59.808','Great performance! TheManic has slain the Level 1 Crook and is awarded with Credits: 1!'),(71,'global',1,'2019-09-07 21:34:59.808','Drak has found a small treasure trove of 500,000 gold!'),(72,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small treasure trove of 500,000 gold!'),(73,'global',1,'2019-09-07 21:34:59.808','TheManic has found a cache of 500 mithril!'),(74,'global',1,'2019-09-07 21:34:59.808','TheManic has found a chest containing 2 credits!'),(75,'global',1,'2019-09-07 21:34:59.808','canhuck has stumbled upon a pouch containing 1 credit!'),(76,'global',1,'2019-09-07 21:34:59.808','TheManic has stumbled upon a pouch containing 1 credit!'),(77,'global',1,'2019-09-07 21:34:59.808','canhuck has found a HUGE cache of 2000 mithril!'),(78,'global',1,'2019-09-07 21:34:59.808','canhuck has found a treasure trove of 1,000,000 gold!'),(79,'global',1,'2019-09-07 21:34:59.808','The Level 100 Mafia Boss has been spotted at (0, 0) of The Jungle.'),(80,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small cache of 100 mithril!'),(81,'global',1,'2019-09-07 21:34:59.808','The Colossus has been spotted at (19, 3) of The Jungle.'),(82,'global',1,'2019-09-07 21:34:59.808','Great performance! canhuck has slain the Colossus and is awarded with Stones: 1,000!'),(83,'global',1,'2019-09-07 21:34:59.808','Great performance! canhuck has slain the Usurper and is awarded with Reputation: 1!'),(84,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small cache of 100 mithril!'),(85,'global',1,'2019-09-07 21:34:59.808','TheManic has found a treasure trove of 1,000,000 gold!'),(86,'global',1,'2019-09-07 21:34:59.808','The Level 100 Mafia Boss has been spotted at (21, 18) of The Jungle.'),(87,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small treasure trove of 500,000 gold!'),(88,'global',1,'2019-09-07 21:34:59.808','canhuck has found a small treasure trove of 500,000 gold!'),(89,'global',1,'2019-09-07 21:34:59.808','The Corrupt Communist has been spotted at (24, 18) of The Jungle.'),(90,'global',1,'2019-09-07 21:34:59.808','Great performance! canhuck has slain the Corrupt Communist and is awarded with Gold: 1,000,000!'),(91,'global',1,'2019-09-07 21:34:59.808','canhuck has found a treasure trove of 1,000,000 gold!'),(92,'global',1,'2019-09-07 21:34:59.808','Lucky day! canhuck has found a chest containing 5 credits!'),(93,'global',1,'2019-09-07 21:34:59.808','The Enchanted Sapling has been spotted at (18, 20) of The Jungle.'),(94,'',9,'2019-09-07 21:34:59.808','i cant get the market page to go back to the first page'),(95,'',9,'2019-09-07 21:34:59.808','it is stuck on the credit page'),(96,'global',1,'2019-09-07 21:34:59.808','canhuck has stumbled upon a pouch containing 1 credit!'),(97,'global',1,'2019-09-07 21:34:59.808','Great performance! canhuck has slain the Enchanted Sapling and is awarded with Timber: 500!'),(98,'global',1,'2019-09-07 21:34:59.808','The Level 1 Crook has been spotted at (18, 10) of The Jungle.'),(99,'global',1,'2019-09-07 21:34:59.808','Great performance! canhuck has slain the Level 1 Crook and is awarded with Credits: 1!'),(100,'global',1,'2019-09-07 21:34:59.808','canhuck has stumbled upon a pouch containing 1 credit!'),(101,'',2,'2019-09-07 21:34:59.808','fixed problem with registration - I was using the wrong CAPTCHA key'),(102,'',2,'2019-09-07 21:34:59.808','will check out the market bug later'),(103,'',2,'2019-09-07 21:34:59.808','I found the problem - I used different variable names by accident. I\'ll fix it in an hour or so'),(104,'',2,'2019-09-07 21:34:59.808','fixed mobile data login problem'),(105,'',2,'2019-09-07 21:34:59.808','Going to redesign the login/home page now'),(106,'global',1,'2019-09-07 21:34:59.808','Soravery has found a treasure trove of 1,000,000 gold!'),(107,'global',1,'2019-09-07 21:34:59.808','digfatbick has stumbled upon a pouch containing 1 credit!'),(108,'global',1,'2019-09-07 21:34:59.808','digfatbick has found a treasure trove of 1,000,000 gold!'),(109,'global',1,'2019-09-07 21:34:59.808','The Stone Golem has been spotted at (7, 2) of Space Station X.'),(110,'global',1,'2019-09-07 21:34:59.808','SapheraKurenai has stumbled upon a pouch containing 1 credit!'),(111,'global',1,'2019-09-07 21:34:59.808','The Red Baron has been spotted at (8, 4) of Space Station X.'),(112,'pub',2,'2019-09-07 21:34:59.808','<i>rolled a <b>19</b>.</i>'),(113,'global',1,'2019-09-07 21:34:59.808','Sigurd has found a small cache of 100 mithril!'),(114,'',19,'2019-09-07 21:34:59.808','admin online ?'),(115,'global',1,'2019-09-07 21:34:59.808','The Usurper has been spotted at (3, 8) of Space Station X.'),(116,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a small cache of 100 mithril!'),(117,'global',1,'2019-09-07 21:34:59.808','The Colossus has been spotted at (0, 8) of Space Station X.'),(118,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a small treasure trove of 500,000 gold!'),(119,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a cache of 500 mithril!'),(120,'global',1,'2019-09-07 21:34:59.808','The Level 100 Mafia Boss has been spotted at (11, 8) of The Jungle.'),(121,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a cache of 500 mithril!'),(122,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a treasure trove of 1,000,000 gold!'),(123,'global',1,'2019-09-07 21:34:59.808','The Red Baron has been spotted at (10, 18) of The Jungle.'),(124,'global',1,'2019-09-07 21:34:59.808','Dioxide has found a cache of 500 mithril!'),(125,'global',1,'2019-09-07 21:34:59.808','Dioxide has stumbled upon a pouch containing 1 credit!'),(126,'',2,'2019-09-11 23:46:42.269','test'),(127,'global',1,'2019-09-12 02:19:00.369','Great performance! Drak has slain the Usurper and is awarded with Reputation: 1!'),(128,'',2,'2019-10-10 04:16:24.407','test'),(129,'global',1,'2019-10-12 20:26:30.022','Drak has found a HUGE cache of 2000 mithril!'),(130,'global',1,'2019-10-12 20:27:05.022','Drak has found a small treasure trove of <span title=\"Velites\" style=\"color:#ffcccb\">50v</span> <span title=\"Calites\" style=\"color:#e68916\">0c</span> <span title=\"Emites\" style=\"color:#9799ff\">0e</span>!'),(131,'global',1,'2019-10-12 20:28:57.022','The Usurper has been spotted at (4, 1) of Space Station X.'),(132,'global',1,'2019-10-13 20:26:33.736','Drak has stumbled upon a pouch containing 1 credit!'),(133,'me',2,'2019-10-14 02:55:41.390','test'),(134,'global',1,'2019-10-14 03:17:04.955','Drak has found a chest containing 2 credits!'),(135,'global',1,'2019-10-14 03:21:51.944','The Ancient Treeant has been spotted at (2, 9) of Space Station X.'),(136,'global',1,'2019-10-14 04:02:32.948','Drak has found a small cache of 100 mithril!'),(137,'',2,'2019-10-14 21:53:52.408','@Drak'),(138,'w',2,'2019-10-24 02:21:36.306','Drak hi'),(139,'global',1,'2019-10-29 21:13:28.076','The Red Baron has been spotted at (4, 1) of Space Station X.'),(140,'guild',2,'2019-11-12 23:06:03.092','Testers test'),(141,'pub',2,'2019-11-12 23:06:10.475','<i>rolled a <b>29</b>.</i>');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dungeons`
--

DROP TABLE IF EXISTS `dungeons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dungeons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT '1',
  `rooms` int(11) DEFAULT '10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dungeons`
--

LOCK TABLES `dungeons` WRITE;
/*!40000 ALTER TABLE `dungeons` DISABLE KEYS */;
INSERT INTO `dungeons` VALUES (1,'Abandoned Farm','A place full of horrors.',1,5),(2,'Fungal Cavern','Toxic spores permeate the air here.',100,5);
/*!40000 ALTER TABLE `dungeons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dungeons_drops`
--

DROP TABLE IF EXISTS `dungeons_drops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dungeons_drops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dungeon` int(11) NOT NULL DEFAULT '1',
  `drop` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dungeons_drops`
--

LOCK TABLES `dungeons_drops` WRITE;
/*!40000 ALTER TABLE `dungeons_drops` DISABLE KEYS */;
INSERT INTO `dungeons_drops` VALUES (1,1,12),(2,2,12),(3,2,13);
/*!40000 ALTER TABLE `dungeons_drops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dungeons_monsters`
--

DROP TABLE IF EXISTS `dungeons_monsters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dungeons_monsters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT 'Unknown',
  `hp` int(11) DEFAULT '100',
  `atk` int(11) DEFAULT '0',
  `def` int(11) DEFAULT '0',
  `acc` int(11) DEFAULT '0',
  `eva` int(11) DEFAULT '0',
  `progress` int(11) DEFAULT '0',
  `dungeon` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dungeons_monsters`
--

LOCK TABLES `dungeons_monsters` WRITE;
/*!40000 ALTER TABLE `dungeons_monsters` DISABLE KEYS */;
INSERT INTO `dungeons_monsters` VALUES (1,'Farm Mon 1',500,500,50,500,500,1,1),(2,'Farm Mon 2',1000,1000,100,500,500,2,1),(3,'Farm Mon 3',1500,1500,150,500,500,3,1),(4,'Farm Mon 4',2000,2000,200,500,500,4,1),(5,'Farm Mon 5',2500,2500,250,500,500,5,1),(6,'Cavern Mon 1',3000,1,1,1,1,1,2),(7,'Cavern Mon 2',3500,1,1,1,1,2,2),(8,'Cavern Mon 3',4000,1,1,1,1,3,2),(9,'Cavern Mon 4',4500,1,1,1,1,4,2),(10,'Cavern Mon 5',5000,1,1,1,1,5,2);
/*!40000 ALTER TABLE `dungeons_monsters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(100) NOT NULL,
  `answer` varchar(2000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'Why isn\'t my overflow exp stored?','The game does not store overflow exp. You can only gain a maximum of one level per kill and will have to gain all of the exp for the next level again.'),(2,'How do I gain reputation?','Kill nobility beasts that spawn randomly or you can gain 1 reputation per $ spent on the game.'),(3,'How does reputation ranks affect my character?','Besides a shiny rank, it doesn\'t. It\'s just a marker to show how hard you grind or support the game.'),(4,'I\'m getting errors trying to use my currencies (coins, mithril, etc.)','Sometimes, the server doesn\'t update client side accurately. Just log out and log back in and it should show your actual amounts of each currency.'),(5,'Can accuracy go over 100%?','Yeah. No benefits though.'),(6,'Why aren\'t all the numbers (like quest monster kills) comma formatted?','Due to some limitations, numbers that can be <i>null</i> (like when you drop your quest) cannot be formatted.'),(7,'Will there ever be more developers for the game?','No.');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guilds`
--

DROP TABLE IF EXISTS `guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guilds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  `motd` varchar(150) NOT NULL DEFAULT 'Hello world!',
  `slots` tinyint(11) NOT NULL DEFAULT '15',
  `hpboost` smallint(11) NOT NULL DEFAULT '0',
  `atkboost` smallint(11) NOT NULL DEFAULT '0',
  `gold` bigint(20) unsigned NOT NULL DEFAULT '0',
  `credits` int(11) unsigned NOT NULL DEFAULT '0',
  `mithril` int(11) unsigned NOT NULL DEFAULT '0',
  `timber` int(11) unsigned NOT NULL DEFAULT '0',
  `stones` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guilds`
--

LOCK TABLES `guilds` WRITE;
/*!40000 ALTER TABLE `guilds` DISABLE KEYS */;
INSERT INTO `guilds` VALUES (1,'Testers','Test this message',15,0,0,50,0,0,0,0);
/*!40000 ALTER TABLE `guilds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT 'Placeholder',
  `description` varchar(150) NOT NULL DEFAULT '*no description*',
  `health` int(11) NOT NULL DEFAULT '0',
  `attack` int(11) NOT NULL DEFAULT '0',
  `defense` int(11) NOT NULL DEFAULT '0',
  `accuracy` int(11) NOT NULL DEFAULT '0',
  `evasion` int(11) NOT NULL DEFAULT '0',
  `rarity` int(11) NOT NULL DEFAULT '1',
  `level` int(11) NOT NULL DEFAULT '1',
  `type` varchar(10) NOT NULL DEFAULT 'none',
  `stack` int(11) NOT NULL DEFAULT '1',
  `bcredits` tinyint(1) NOT NULL DEFAULT '0',
  `cost` bigint(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Book of Forbidden Knowledge','Keeping this book on you gives you supreme power.',50,60,70,80,90,5,1,'artifact',1,0,1000000),(2,'Cursed Scepter','A cursed scepter that saps the user of all his health and in return gives meager stat boosts.',-999,10,10,10,10,2,1,'artifact',1,1,50),(3,'Holy Cross','A holy cross to fend off the vampires.',50,5,5,5,5,3,1,'artifact',1,0,0),(4,'Rat Skull','Yuck',5,5,5,5,5,1,1,'artifact',1,0,0),(5,'Rusted Medallion','Where did the rat get this from?',5,5,5,5,5,1,1,'artifact',1,0,0),(6,'Alien Eye','An eyeball that makes you feel makes you feel invigorated and much more focused.',20,5,0,25,25,2,1,'artifact',1,0,10000),(7,'Cursed Scepter3','A cursed scepter that saps the user of all his health and in return gives meager stat boosts.',-999,10,10,10,10,2,1,'artifact',1,0,0),(8,'Legion Token','A token of immense power.',0,0,0,0,0,1,1,'misc',1000,0,0),(9,'Test Merge Item','...',10,10,10,10,10,2,1,'artifact',1,0,5000),(10,'Crystal Fragment','A fragment of a crystal.',0,0,0,0,0,1,1,'misc',1000,0,0),(11,'Red Key Card','Probably used to open a portal somewhere?',0,0,0,0,0,1,1,'misc',1,0,10000),(12,'Shard T1','...',0,0,0,0,0,1,1,'misc',100,0,0),(13,'Shard T2','...',0,0,0,0,0,1,1,'misc',100,0,0),(14,'Shard T3','...',0,0,0,0,0,1,1,'misc',100,0,0),(15,'Shard T4','...',0,0,0,0,0,1,1,'misc',100,0,0),(16,'Shard T5','...',0,0,0,0,0,1,1,'misc',100,0,0),(17,'Shard T6','...',0,0,0,0,0,1,1,'misc',100,0,0),(18,'Shard T7','...',0,0,0,0,0,1,1,'misc',100,0,0),(19,'Shard T8','...',0,0,0,0,0,1,1,'misc',100,0,0),(20,'Shard T9','...',0,0,0,0,0,1,1,'misc',100,0,0),(21,'Shard T10','...',0,0,0,0,0,1,1,'misc',100,0,0),(22,'Abandoned Farm Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(23,'Fungal Cavern Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(24,'Frozen Blight Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(25,'Inferno Forest Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(26,'Dungeon 5 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(27,'Dungeon 6 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(28,'Dungeon 7 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(29,'Dungeon 8 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(30,'Dungeon 9 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0),(31,'Dungeon 10 Key','*no description*',0,0,0,0,0,1,1,'misc',10,0,0);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items_requirements`
--

DROP TABLE IF EXISTS `items_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_requirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL,
  `requirement` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items_requirements`
--

LOCK TABLES `items_requirements` WRITE;
/*!40000 ALTER TABLE `items_requirements` DISABLE KEYS */;
INSERT INTO `items_requirements` VALUES (1,9,8,50),(2,9,10,50);
/*!40000 ALTER TABLE `items_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT 'Placeholder',
  `description` varchar(500) NOT NULL DEFAULT 'None',
  `level` int(11) NOT NULL DEFAULT '1',
  `distancex` int(11) NOT NULL DEFAULT '10',
  `distancey` int(11) NOT NULL DEFAULT '10',
  `reqitem` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Space Station X','After the takeover of the New Government, space exploration and colonization was made a priority. Space Station X is the largest functioning space station.',1,10,10,0),(2,'The Jungle','The jungle stretches out for a vast stretch of land.',25,25,25,0),(3,'Hundred Acre Wood','Why are you trying to hunt down Winnie the Pooh?',50,10,10,11),(4,'Derelict Outpost','An old outpost that new recruits frequently visit.',100,10,10,0);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations_beasts`
--

DROP TABLE IF EXISTS `locations_beasts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations_beasts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` int(11) NOT NULL,
  `locationx` tinyint(4) NOT NULL,
  `locationy` tinyint(4) NOT NULL,
  `beast` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations_beasts`
--

LOCK TABLES `locations_beasts` WRITE;
/*!40000 ALTER TABLE `locations_beasts` DISABLE KEYS */;
INSERT INTO `locations_beasts` VALUES (4,2,22,22,8,50000),(5,1,9,8,1,100000),(6,1,5,1,4,299778),(8,1,9,4,7,50000),(9,1,5,2,1,99993),(12,2,0,0,5,998974),(14,2,21,18,5,1000000),(18,1,7,2,7,50000),(19,1,8,4,10,50000),(20,1,3,8,9,50000),(21,1,0,8,1,99912),(22,2,11,8,5,999991),(23,2,10,18,10,50000),(24,1,4,1,9,50000),(25,1,2,9,3,100000),(26,1,4,1,10,50000);
/*!40000 ALTER TABLE `locations_beasts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations_places`
--

DROP TABLE IF EXISTS `locations_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations_places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` int(11) NOT NULL DEFAULT '1',
  `locationx` tinyint(4) NOT NULL DEFAULT '0',
  `locationy` tinyint(4) NOT NULL DEFAULT '0',
  `function` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations_places`
--

LOCK TABLES `locations_places` WRITE;
/*!40000 ALTER TABLE `locations_places` DISABLE KEYS */;
INSERT INTO `locations_places` VALUES (1,1,5,2,'enter 2'),(2,2,13,10,'enter 1'),(3,1,6,9,'shop 1'),(4,1,6,10,'shop 2'),(5,2,1,20,'enter 3'),(6,3,2,2,'enter 2'),(7,1,0,0,'shop 3'),(8,1,2,5,'enter 4'),(9,4,3,1,'enter 1');
/*!40000 ALTER TABLE `locations_places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market`
--

DROP TABLE IF EXISTS `market`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `item` int(11) NOT NULL DEFAULT '0',
  `amount` int(11) unsigned NOT NULL DEFAULT '1',
  `price` int(11) unsigned NOT NULL DEFAULT '0',
  `status` varchar(20) NOT NULL DEFAULT 'selling',
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market`
--

LOCK TABLES `market` WRITE;
/*!40000 ALTER TABLE `market` DISABLE KEYS */;
/*!40000 ALTER TABLE `market` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `milestones`
--

DROP TABLE IF EXISTS `milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `milestones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(250) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'level',
  `required` int(11) NOT NULL DEFAULT '1',
  `gold` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  `mithril` int(11) NOT NULL DEFAULT '0',
  `achievement` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `milestones`
--

LOCK TABLES `milestones` WRITE;
/*!40000 ALTER TABLE `milestones` DISABLE KEYS */;
INSERT INTO `milestones` VALUES (1,'No Training Wheels','Reach level 100','level',100,50000,25,100,0),(2,'A Newbie No More','Reach level 500','level',500,150000,50,500,0),(3,'Birth of a Legend','Reach level 1000','level',1000,500000,100,1500,0),(4,'Explorer Adept','Reach level 2000','level',2000,1000000,150,2500,0);
/*!40000 ALTER TABLE `milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monsters`
--

DROP TABLE IF EXISTS `monsters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monsters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT 'Thing',
  `hp` int(11) NOT NULL DEFAULT '50',
  `atk` int(11) NOT NULL DEFAULT '5',
  `def` int(11) NOT NULL DEFAULT '0',
  `acc` int(11) NOT NULL DEFAULT '0',
  `eva` int(11) NOT NULL DEFAULT '0',
  `crit` int(11) NOT NULL DEFAULT '0',
  `gold` int(11) NOT NULL DEFAULT '0',
  `exp` int(11) NOT NULL DEFAULT '0',
  `location` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monsters`
--

LOCK TABLES `monsters` WRITE;
/*!40000 ALTER TABLE `monsters` DISABLE KEYS */;
INSERT INTO `monsters` VALUES (1,'Training Dummy',4,2,0,0,0,0,1,6,1),(2,'Mutated Rat',34,50,1,0,0,0,3,12,1),(3,'Tarantula',113,155,2,0,0,0,6,18,1),(4,'Toxic Tarantula',269,250,3,0,0,0,10,25,1),(5,'Rabid Dog',525,375,4,0,0,0,13,35,1),(6,'Thug',907,510,5,0,0,0,15,40,1),(7,'Drug Dealer',1441,1200,6,0,0,0,17,45,1),(8,'Drunk Recruit',2150,1300,7,0,0,0,20,52,1),(9,'Instructor',3062,2000,8,0,0,0,23,63,1),(10,'Corrupt Pilot',4200,2550,9,0,0,0,28,70,1),(11,'Wild Hog',5912,4050,10,0,0,0,35,80,2),(12,'Wolf',7905,5250,12,0,0,0,40,95,2),(13,'Brown Bear',11005,11005,14,0,0,0,45,100,2),(14,'Feral Gorilla',15328,15328,16,0,0,0,50,107,2),(15,'Tiger',19003,19003,18,0,1000,0,57,115,2),(16,'Giant Python',25734,25734,20,0,1000,0,65,125,2),(17,'Hungry Piranha',35734,35734,22,0,1000,0,68,130,2),(18,'Harambe',41734,41734,24,0,1000,0,71,135,2),(19,'Wildlife Ranger',47111,47111,26,0,1000,0,77,140,2),(20,'Witch that Ate Hansel and Gretel',55888,55888,30,2000,1000,0,85,150,2),(21,'Piglet',63666,83666,33,2000,1000,0,90,165,3),(22,'Roo',72837,92612,37,2000,1000,0,100,175,3),(23,'Eeyore',84938,104938,41,2000,1000,0,110,183,3),(24,'Owl',99827,119827,45,2000,1000,0,120,191,3),(25,'Kanga',110000,130000,47,2000,1000,0,130,200,3),(26,'Rabbit',128271,158271,49,2000,1000,0,140,210,3),(27,'Winnie the Pooh',143928,173928,51,2000,1000,0,150,225,3),(28,'Tigger',159281,199281,53,2000,1000,0,160,240,3),(29,'Christopher Robin',167266,217266,53,2000,1000,0,170,260,3),(30,'Heffalump',181333,251333,53,2000,1000,0,180,280,3),(31,'Aggressive Recruit',187928,307928,53,2000,1000,1000,190,300,4),(32,'Seasoned Thief',194123,312123,53,2000,1000,1000,200,325,4),(33,'Bounty Hunter',200000,321212,53,2000,1000,1000,200,350,4),(34,'Witch Doctor',212345,321212,55,2000,1000,1000,210,375,4),(35,'Old World Heretic',222261,331212,55,2000,1000,1000,220,400,4),(36,'Highwayman',230032,341212,55,2000,1000,1000,230,425,4),(37,'Retired Commander',243888,351212,59,2000,1000,1000,240,450,4),(38,'Demolitionist',258371,371212,59,2000,1000,1000,250,475,4),(39,'Resting Sergeant',282711,391212,61,2000,1000,1000,260,500,4),(40,'Drunk Assassin',329281,411212,61,2000,1000,1000,270,550,4);
/*!40000 ALTER TABLE `monsters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monsters_drops`
--

DROP TABLE IF EXISTS `monsters_drops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monsters_drops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `monster` int(11) NOT NULL,
  `item` int(11) NOT NULL,
  `rate` decimal(10,5) NOT NULL DEFAULT '1.00000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monsters_drops`
--

LOCK TABLES `monsters_drops` WRITE;
/*!40000 ALTER TABLE `monsters_drops` DISABLE KEYS */;
INSERT INTO `monsters_drops` VALUES (1,1,4,0.00500),(2,1,5,0.00500);
/*!40000 ALTER TABLE `monsters_drops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL DEFAULT 'Title',
  `content` varchar(500) NOT NULL DEFAULT 'Content',
  `author` varchar(20) NOT NULL DEFAULT 'No one',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'Hello World!','This is to test the updates popup','Drak','2019-09-07 21:35:00'),(2,'Alpha Testing Phase 1','The goal as of right now is to find all of the bugs and fix them. The game won\'t be heavily advertised until afterwards.','Drak','2019-09-07 21:35:00');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `redeems`
--

DROP TABLE IF EXISTS `redeems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redeems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(20) NOT NULL DEFAULT 'level',
  `required` int(11) NOT NULL DEFAULT '1',
  `gold` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  `mithril` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redeems`
--

LOCK TABLES `redeems` WRITE;
/*!40000 ALTER TABLE `redeems` DISABLE KEYS */;
INSERT INTO `redeems` VALUES (1,'ALPHATESTER','2019-09-07 21:35:00','level',1,20000,50,750),(2,'TLUFIRST8','2019-09-07 21:35:00','level',50,300000,50,250),(3,'IGOTFRIENDS8','2019-09-07 21:35:00','referral',20,1000000,125,1000);
/*!40000 ALTER TABLE `redeems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reputation_ranks`
--

DROP TABLE IF EXISTS `reputation_ranks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reputation_ranks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nameM` varchar(1000) NOT NULL DEFAULT 'None',
  `nameF` varchar(1000) NOT NULL,
  `reputation` int(11) NOT NULL DEFAULT '0',
  `faction` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reputation_ranks`
--

LOCK TABLES `reputation_ranks` WRITE;
/*!40000 ALTER TABLE `reputation_ranks` DISABLE KEYS */;
INSERT INTO `reputation_ranks` VALUES (1,'<span style=\"color:#EEEEEE;\">Recruit</span>','<span style=\"color:#EEEEEE;\">Recruit</span>',0,1),(2,'<span style=\"color:#ddccbb;\">Scout</span>','<span style=\"color:#ddccbb;\">Scout</span>',5,1),(3,'<span style=\"color:#ccccff;\">Explorer</span>','<span style=\"color:#ccccff;\">Explorer</span>',10,1),(4,'<span style=\"color:#9999ff;\">Outrider</span>','<span style=\"color:#9999ff;\">Outrider</span>',20,1),(5,'<span style=\"color:#6666ff;\">Rogue</span>','<span style=\"color:#6666ff;\">Rogue</span>',50,1),(6,'<span style=\"color:#007777;\">Assassin</span>','<span style=\"color:#007777;\">Assassin</span>',100,1),(7,'<span style=\"color:#009999;\">Gunslinger</span>','<span style=\"color:#009999;\">Gunslinger</span>',200,1),(8,'<span style=\"color:#00bbbb;\">Slayer</span>','<span style=\"color:#00bbbb;\">Slayer</span>',300,1),(9,'<span style=\"color:#00dddd;\">Doombringer</span>','<span style=\"color:#00dddd;\">Doombringer</span>',400,1),(10,'<span style=\"color:#00ffff;\">Eidolon</span>','<span style=\"color:#00ffff;\">Eidolon</span>',500,1),(11,'<span style=\"color:#dd7744;\">Lord</span>','<span style=\"color:#dd7744;\">Lady</span>',650,1),(12,'<span style=\"color:#dd7744;\">Prince</span>','<span style=\"color:#dd7744;\">Princess</span>',800,1),(13,'<span style=\"color:#ff9966;\">King</span>','<span style=\"color:#ff9966;\">Queen</span>',1000,1),(14,'<span style=\"color:#ff9900;\">Emperor</span>','<span style=\"color:#ff9900;\">Empress</span>',1300,1),(15,'<span style=\"color:#00ff00;\">Patriarch</span>','<span style=\"color:#00ff00;\">Matriarch</span>',1600,1),(16,'<span style=\"color:#00ff00;\">Conqueror</span>','<span style=\"color:#00ff00;\">Conqueress</span>',2000,1),(17,'<span style=\"color:#66ddff;\">Legend</span>','<span style=\"color:#66ddff;\">Legend</span>',2500,1),(18,'<span style=\"color:#66ddff;\">Paragon</span>','<span style=\"color:#66ddff;\">Paragon</span>',3000,1),(19,'<span style=\"color:#ffd700;\">Hand of Fate</span>','<span style=\"color:#ffd700;\">Hand of Fate</span>',4000,1),(20,'<span style=\"color:#ffd700;\">Reign Ender</span>','<span style=\"color:#ffd700;\">Reign Ender</span>',5000,1),(21,'<span style=\"color:#ffd700;\">Ascendent</span>','<span style=\"color:#ffd700;\">Ascendent</span>',6500,1),(22,'<span style=\"color:#ff3333;\">God</span>','<span style=\"color:#ff3333;\">Goddess</span>',8000,1),(23,'<span style=\"color:#ff3333;\">Origin</span>','<span style=\"color:#ff3333;\">Origin</span>',10000,1);
/*!40000 ALTER TABLE `reputation_ranks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `value` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'motd','Welcome to the Alpha test! This means that the game is filled with bugs. Don\'t be surprised if something weird happens. Just remember to report it! Currently, purchasing packages of credits valued $19.99 or above will grant you the <span class=\"font-weight-bold\" style=\"color:yellow\">Founder</span> chat rank. If anything goes wrong and the database gets deleted, go on Discord and your purchased credits will be given again.'),(2,'mithrildrop','0.0005'),(3,'creditdrop','0.0005'),(4,'golddrop','0.0005'),(5,'beastspawn','0.001'),(6,'double','1565047851'),(7,'triple','1565147851');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `level` int(11) NOT NULL DEFAULT '10',
  `merge` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,'Recruit Shop',1,0),(2,'Basic Merge Shop',1,1),(3,'Junk Vendor',1,0);
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops_items`
--

DROP TABLE IF EXISTS `shops_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop` int(11) NOT NULL,
  `item` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops_items`
--

LOCK TABLES `shops_items` WRITE;
/*!40000 ALTER TABLE `shops_items` DISABLE KEYS */;
INSERT INTO `shops_items` VALUES (1,1,1),(2,1,2),(3,2,9),(4,3,6),(5,3,11);
/*!40000 ALTER TABLE `shops_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story`
--

DROP TABLE IF EXISTS `story`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `monster` int(11) NOT NULL DEFAULT '1',
  `amount` int(11) NOT NULL DEFAULT '0',
  `rate` decimal(10,5) NOT NULL DEFAULT '0.50000',
  `gold` int(11) NOT NULL DEFAULT '0',
  `mithril` int(11) NOT NULL DEFAULT '0',
  `credits` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story`
--

LOCK TABLES `story` WRITE;
/*!40000 ALTER TABLE `story` DISABLE KEYS */;
INSERT INTO `story` VALUES (1,'A New World','<i>Darkness. It\'s everywhere. Ignoring your splitting headache, you open your eyes.</i><br /><br />\r\n<b class=\"text-success\">Unknown figure</b>: Hey you. You\'re finally awake.<br /><br />\r\n<i>Still disoriented, you check your surroundings. What is this place? Who are you?</i><br /><br />\r\n<b class=\"text-success\">Unknown figure</b>: Alright, get up. We have work to do. My name is Ben by the way.<br /><br />\r\n<b class=\"text-success\">You</b>: *still disoriented* Where am I? Who am I?<br /><br />\r\n<b class=\"text-success\">Ben</b>: I\'ll answer your questions later. But right now, IT IS TIME FOR YOUR MORNING TRAINING, PRIVATE. Go beat up 50 or so of those training dummies, and then come back. We\'ll take it from there.',1,50,1.00000,5000,100,5),(2,'Q&A Time','<b class=\"text-success\">Ben</b>: Ah, so you didn\'t get yourself killed back there, eh? Ha! Imagine dying to a near inanimate object!<br /><br />\r\n<b class=\"text-success\">You</b>: So, how about some answers?<br /><br />\r\n<b class=\"text-success\">Ben</b>: Hm, so that knock to the head really did some mental damage I see. Well, for starters you are on Space Station X. Apparently we were in need of new recruits. A lot of them too, in fact.<br /><br />\r\n<b class=\"text-success\">You</b>: So this is it? I just go around beating stuff up?<br /><br />\r\n<b class=\"text-success\">Ben</b>: Errr... Sure. The crew here pioneers in the exploration of the galaxy. Speaking of which, can you complete this quick task for me? There are some pilots that need to be taught a lesson in not taking bribes. Some of them carry a very unique gem with them. I need 25 of those.',10,25,0.10000,10000,200,5),(3,'A Distress Call','<b class=\"text-success\">Ben</b>: The gems!<br /><br />\r\n<b class=\"text-success\">You</b>: Now can you answer some of my questions?<br /><br />\r\n<b class=\"text-success\">Ben</b>: Unfortunately not. I\'ve just received a distress signal from a crew stationed on a nearby planet. It appears that an aggressive entity has made contact with them. The audio cuts off, so you have to go investigate. I believe there\'s a portal on the coordinates (5, 2) of the station. Slay a couple wolves for their pelts first. You will be staying there overnight. Note that not all of the pelts will be usable!',12,50,0.50000,20000,200,5),(4,'Gingerbread House','<b class=\"text-success\">Ben</b>: You survived the night! Great, I\'ve discovered some info regarding the crew. It appears that a witch has kidnapped them! Quick! Beat up the witch until she tells you where she hid the crew members!<br /><br />\r\n<b class=\"text-success\">You</b>: ...',20,1,0.00500,50000,200,5);
/*!40000 ALTER TABLE `story` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `access` tinyint(11) unsigned NOT NULL DEFAULT '1',
  `reprank` smallint(6) NOT NULL DEFAULT '1',
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gender` tinyint(1) NOT NULL DEFAULT '3',
  `avatar` int(11) unsigned NOT NULL DEFAULT '0',
  `level` int(11) NOT NULL DEFAULT '1',
  `exp` int(11) NOT NULL DEFAULT '0',
  `health` int(11) NOT NULL DEFAULT '1',
  `attack` int(11) NOT NULL DEFAULT '1',
  `defense` int(11) NOT NULL DEFAULT '0',
  `accuracy` int(11) NOT NULL DEFAULT '0',
  `evasion` int(11) NOT NULL DEFAULT '0',
  `critp` smallint(6) NOT NULL DEFAULT '0',
  `critd` smallint(6) NOT NULL DEFAULT '0',
  `xhitp` smallint(6) NOT NULL DEFAULT '0',
  `xhitd` smallint(6) NOT NULL DEFAULT '0',
  `shortsword` smallint(6) NOT NULL DEFAULT '1',
  `aug1` tinyint(2) NOT NULL DEFAULT '0',
  `dagger` smallint(6) NOT NULL DEFAULT '1',
  `aug2` tinyint(2) NOT NULL DEFAULT '0',
  `helmet` smallint(6) NOT NULL DEFAULT '1',
  `aug3` tinyint(2) NOT NULL DEFAULT '0',
  `shoulders` smallint(6) NOT NULL DEFAULT '1',
  `aug4` tinyint(2) NOT NULL DEFAULT '0',
  `wrists` smallint(6) NOT NULL DEFAULT '1',
  `aug5` tinyint(2) NOT NULL DEFAULT '0',
  `gloves` smallint(6) NOT NULL DEFAULT '1',
  `aug6` tinyint(2) NOT NULL DEFAULT '0',
  `chestpiece` smallint(6) NOT NULL DEFAULT '1',
  `aug7` tinyint(2) NOT NULL DEFAULT '0',
  `leggings` smallint(6) NOT NULL DEFAULT '1',
  `aug8` tinyint(2) NOT NULL DEFAULT '0',
  `boots` smallint(6) NOT NULL DEFAULT '1',
  `aug9` tinyint(2) NOT NULL DEFAULT '0',
  `gold` bigint(20) unsigned NOT NULL DEFAULT '0',
  `credits` int(11) unsigned NOT NULL DEFAULT '0',
  `pcredits` int(10) unsigned NOT NULL DEFAULT '0',
  `mithril` int(11) unsigned NOT NULL DEFAULT '0',
  `timber` int(11) unsigned NOT NULL DEFAULT '0',
  `stones` int(11) unsigned NOT NULL DEFAULT '0',
  `reputation` int(11) unsigned NOT NULL DEFAULT '0',
  `autos` int(11) unsigned NOT NULL DEFAULT '100',
  `inventory` tinyint(3) unsigned NOT NULL DEFAULT '5',
  `equipslots` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `quests` int(11) unsigned NOT NULL DEFAULT '0',
  `story` smallint(5) unsigned NOT NULL DEFAULT '0',
  `expboost` smallint(6) NOT NULL DEFAULT '0',
  `goldboost` smallint(6) NOT NULL DEFAULT '0',
  `location` smallint(5) unsigned NOT NULL DEFAULT '1',
  `locationx` tinyint(4) NOT NULL DEFAULT '0',
  `locationy` tinyint(4) NOT NULL DEFAULT '0',
  `kills` int(11) unsigned NOT NULL DEFAULT '0',
  `lastonline` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ipaddress` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0.0.0.0',
  `muted` tinyint(1) NOT NULL DEFAULT '0',
  `warns` int(11) NOT NULL DEFAULT '0',
  `vote` int(11) NOT NULL DEFAULT '0',
  `referrer` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,1,'system','contact@tolandsunknown.com','$2b$06$Wz3dERpeqe63uoLnBRJR0eA9Qb92.7.TTj1rwHdRv/wJ5PsmW3xVu',1,0,2,6,1,1,1,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,6,0,0,0,0,0,0,100,5,1,0,0,0,0,1,0,0,5,'2019-09-07 21:35:00','2019-09-07 21:35:00','172.68.189.208',0,0,0,0),(2,60,2,'Drak','tolandsunknown@gmail.com','$2b$06$bAEqqVaHab83IEp3Pjo9beSvL.MbNzYITwCQ19QttIIiLiBgmNYSe',1,2,154,3710,153,151,152,148,164,3,0,0,0,13,0,13,0,3,0,5,0,5,0,4,0,4,0,3,0,4,0,25647809,11,0,3052,0,0,56,100,5,1,11,2,0,10,1,0,0,4139,'2019-11-27 23:58:37','2019-09-07 21:35:00','127.0.0.1',0,1,0,0),(3,1,1,'Hentai','whohudid@gmail.com','$2b$06$Al2m/3NzlRm.lYZxH2n2KOVuA3pPBoKeaHy76JXQ7Qot//b4VHfje',1,0,119,1498,88,95,95,104,104,0,0,0,0,4,0,4,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,948698,67,0,1250,0,0,0,100,5,1,0,4,0,0,2,13,10,1052,'2019-09-07 21:35:00','2019-09-07 21:35:00','76.102.74.196',0,0,0,0),(4,1,1,'Jarles','bankoftherevolution@gmail.com','$2b$06$1.f7Sg8.kwE/WeAoIg7Lkuu/PZI8vvfZ3rgmcBDEMXmhS6bXDMbRm',1,0,10,75,12,10,13,12,10,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,431,5,0,102,0,0,0,100,5,1,1,2,0,0,1,10,9,91,'2019-09-07 21:35:00','2019-09-07 21:35:00','2.104.94.31',0,0,0,0),(5,1,1,'Omegalul','harugawada@gmail.com','$2b$06$8vjBR0eaeld4QzRa.s/S2OabjK3zJc.ZppYSV6Gmgce8xE98hKmnS',1,0,5,18,8,5,7,7,6,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,48,0,0,0,0,0,0,100,5,1,0,1,0,0,1,0,0,47,'2019-09-07 21:35:00','2019-09-07 21:35:00','87.52.42.202',0,0,0,0),(6,1,1,'Ruffcrew','matt28roch@gmail.com','$2b$06$DNAWcpOUFux3/PGuutKnW.FmEddmQvjhlyCcxfkrD17fCdM6F66jm',1,0,162,700,189,179,185,176,191,0,14,0,0,5,0,5,0,5,0,5,0,5,0,5,0,5,0,5,0,4,0,44045,40,0,285,0,0,0,100,5,1,14,4,0,0,2,13,10,3120,'2019-09-07 21:35:00','2019-09-07 21:35:00','2a02:6b60:a123:0:f53f:acf9:6055:83f2',0,3,0,0),(7,1,1,'canhuck','jch811@gmail.com','$2b$06$4kKrPhYeD8SrJEl4IYokuuqU7PN0ikRPWowCee7MDiX9gT5oXbgJ.',1,0,308,3000,265,279,262,277,277,5,5,30,16,12,0,11,0,6,0,6,0,5,0,5,0,5,0,6,0,5,0,130829,51,0,297,500,1000,2,100,5,1,23,4,0,0,2,18,10,8629,'2019-09-07 21:35:00','2019-09-07 21:35:00','108.162.241.155',0,7,0,0),(8,1,1,'bloodpanic','mario.majors@yahoo.com','$2b$06$6RUojoyVxFIlYMN6WPPzCePCleDPsQpoWkh8cQjVS9E9qZGksQNNe',1,0,8,60,7,10,9,11,11,0,0,6,0,1,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,402,5,0,1,0,0,0,100,5,1,2,2,0,0,1,0,0,100,'2019-09-07 21:35:00','2019-09-07 21:35:00','172.69.160.151',0,0,0,0),(9,1,1,'TheManic','andrewmanic5@gmail.com','$2b$06$0eICLNfUD5eElogoxuodvu147C69k7Af9E.JZPacVR47CVLh6MZFy',1,0,156,3317,150,142,144,137,150,13,9,7,8,7,0,6,0,4,0,4,0,4,0,4,0,4,0,4,0,4,0,42637,23,0,306,0,0,0,100,5,1,17,4,0,0,2,0,0,4207,'2019-09-07 21:35:00','2019-09-07 21:35:00','2.97.162.222',0,3,0,0),(10,1,1,'Soravery','seabass.acc@gmail.com','$2b$06$AkyitwJY5y89UjvGfnE/g.30EHeBCZtNv.Kcfa40Z/7Q8jErZt7Hq',1,0,46,800,43,38,43,40,46,0,0,0,0,5,0,5,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,546078,5,0,142,0,0,0,100,5,1,6,2,0,0,1,10,9,1130,'2019-09-07 21:35:00','2019-09-07 21:35:00','83.81.212.76',0,2,0,7),(11,1,1,'Moxxi','morganhollis123@gmail.com','$2b$06$C/RvuZW24uHUA173FeeL9.GitsMdpZOCiFCz/DTLjm0Z5cbWXKrnq',2,0,2,0,1,2,1,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,5,0,0,0,0,0,0,100,5,1,0,0,0,0,1,0,0,5,'2019-09-07 21:35:00','2019-09-07 21:35:00','172.98.67.46',0,0,0,0),(12,1,1,'abbathorx','abbathorx@yahoo.com','$2b$06$KlH1pgRIiBzSUcqsl9kDG.X6KylOv9sm2r3tsqvBl9yZ6CTK7yhvy',2,0,10,216,8,7,8,8,9,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,25335,55,0,852,0,0,0,100,5,1,1,2,0,0,1,0,0,153,'2019-09-07 21:35:00','2019-09-07 21:35:00','2605:6000:668b:a500:a588:fc4a:97e4:db42',0,0,0,0),(13,1,1,'6Blade99','tyd69@msn.com','$2b$06$ZQAVKtveV1m/GSV4DYUvnucaoDaqc1LUL/O3/gfvBtKd9xRySZURy',1,0,2,0,1,2,0,1,1,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,7,0,0,0,0,0,0,100,5,1,0,0,0,0,1,0,0,5,'2019-09-07 21:35:00','2019-09-07 21:35:00','2604:3d08:ea7f:ee30:2179:8fa9:7d7b:1caa',0,0,0,0),(14,1,1,'elnaeth','lord.damarus@gmail.com','$2b$06$RgRPEAP83q7M6nxL0mAxl.l8vZuuQdxKEX3wkMpBcSllf.uLGUlXS',1,0,9,114,7,10,10,6,7,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,173,0,0,0,0,0,0,100,5,1,0,1,0,0,1,0,0,147,'2019-09-07 21:35:00','2019-09-07 21:35:00','84.25.152.110',0,0,0,0),(15,1,1,'digfatbick','a@gmail.com','$2b$06$2JJiAbCVasf.458/CGY3oedoABidWhVZ4lEZKqxZ2uvtgMZIIINgm',2,0,25,114,20,22,23,26,26,0,0,0,0,6,0,6,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,447054,6,0,862,0,0,0,100,5,1,3,2,10,0,1,0,0,308,'2019-09-07 21:35:00','2019-09-07 21:35:00','76.126.230.234',0,0,0,0),(16,1,1,'Drak2','haskdasd@xsa.asd','$2b$06$Flz2GKAVeHT6K5NLeep0AesURSt/mHu0ujzU9t0ByiXMS81E6uuVS',2,0,1,0,1,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,100,5,1,0,0,0,0,1,0,0,0,'2019-09-07 21:35:00','2019-09-07 21:35:00','108.211.107.12',0,0,0,0),(17,1,1,'SapheraKurenai','sapherakurenai@hotmail.com','$2b$06$1IgiPuuJ0jJlUCHu1A4SquE5sRSTsQ24MvgsmIhACXrlUMCM1l9RO',2,0,23,540,19,23,27,23,20,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3437,1,0,20,0,0,0,100,5,1,4,0,0,0,1,0,0,489,'2019-09-07 21:35:00','2019-09-07 21:35:00','217.19.26.125',0,0,0,0),(18,1,1,'Treyb1030','tbelcher2005@icloud.com','$2b$06$.pIS5IpuCsLcGunIDgeQsOLS89.59BAKbs1cVVER6YMg0DQX4p566',1,0,24,315,21,23,23,18,19,0,0,0,0,2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2585,5,0,100,0,0,0,100,5,1,0,2,0,0,1,0,0,357,'2019-09-07 21:35:00','2019-09-07 21:35:00','165.138.9.81',0,1,0,0),(19,1,1,'Sigurd','nicolasbaracho@gmail.com','$2b$06$zAFc8R9kUDoP1uEvCQVfBe306SEq/HaHXcdOhRKZcCf8yiezMoTR2',1,0,55,468,46,57,52,52,61,9,1,1,0,2,0,2,0,2,0,2,0,2,0,1,0,1,0,1,0,1,0,4365,5,0,37,0,0,0,100,5,1,8,2,0,0,1,0,0,1194,'2019-09-07 21:35:00','2019-09-07 21:35:00','177.149.97.101',0,1,0,0),(20,1,1,'Dioxide','nola@coin-one.com','$2b$06$w5K573nQOFU8TOpIn6z.ZunFSgUCuhzQMn7HI7rmtdj3uQlKsGjjy',1,0,134,1625,117,119,103,127,119,10,10,9,9,6,0,6,0,5,0,5,0,5,0,5,0,5,0,5,0,4,0,174327,16,0,1340,0,0,0,100,5,1,15,4,0,0,2,12,8,3410,'2019-09-07 21:35:00','2019-09-07 21:35:00','2606:ed00:2:4000::15d6',0,0,0,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_achievements`
--

DROP TABLE IF EXISTS `users_achievements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `achievement` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`achievement`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_achievements`
--

LOCK TABLES `users_achievements` WRITE;
/*!40000 ALTER TABLE `users_achievements` DISABLE KEYS */;
INSERT INTO `users_achievements` VALUES (1,2,1);
/*!40000 ALTER TABLE `users_achievements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_dungeons`
--

DROP TABLE IF EXISTS `users_dungeons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_dungeons` (
  `user` int(11) NOT NULL,
  `dungeon` int(11) NOT NULL,
  `progress` int(11) DEFAULT '0',
  PRIMARY KEY (`user`),
  UNIQUE KEY `user_UNIQUE` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_dungeons`
--

LOCK TABLES `users_dungeons` WRITE;
/*!40000 ALTER TABLE `users_dungeons` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_dungeons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_guilds`
--

DROP TABLE IF EXISTS `users_guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_guilds` (
  `user` int(11) NOT NULL,
  `guild` int(11) NOT NULL,
  `rank` tinyint(4) NOT NULL DEFAULT '1',
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_guilds`
--

LOCK TABLES `users_guilds` WRITE;
/*!40000 ALTER TABLE `users_guilds` DISABLE KEYS */;
INSERT INTO `users_guilds` VALUES (2,1,3);
/*!40000 ALTER TABLE `users_guilds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_guilds_invites`
--

DROP TABLE IF EXISTS `users_guilds_invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_guilds_invites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `guild` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`guild`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_guilds_invites`
--

LOCK TABLES `users_guilds_invites` WRITE;
/*!40000 ALTER TABLE `users_guilds_invites` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_guilds_invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_guilds_logs`
--

DROP TABLE IF EXISTS `users_guilds_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_guilds_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `guild` int(11) NOT NULL,
  `action` varchar(300) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_guilds_logs`
--

LOCK TABLES `users_guilds_logs` WRITE;
/*!40000 ALTER TABLE `users_guilds_logs` DISABLE KEYS */;
INSERT INTO `users_guilds_logs` VALUES (1,2,1,'Drak donated 50 gold','2019-10-10 04:48:24');
/*!40000 ALTER TABLE `users_guilds_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_items`
--

DROP TABLE IF EXISTS `users_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `item` int(11) NOT NULL,
  `equipped` tinyint(1) NOT NULL DEFAULT '0',
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`item`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_items`
--

LOCK TABLES `users_items` WRITE;
/*!40000 ALTER TABLE `users_items` DISABLE KEYS */;
INSERT INTO `users_items` VALUES (1,3,6,1,1),(2,4,4,1,1),(3,4,5,0,1),(4,2,6,1,1),(5,2,5,0,1),(6,2,4,0,1),(7,10,5,0,1),(8,10,4,0,1),(9,14,4,0,1),(10,14,5,0,1),(11,20,4,0,1),(12,20,5,0,1),(13,20,6,1,1),(14,2,11,0,1);
/*!40000 ALTER TABLE `users_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_mail`
--

DROP TABLE IF EXISTS `users_mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_mail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `title` varchar(25) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `gold` bigint(20) unsigned NOT NULL DEFAULT '0',
  `read` tinyint(1) NOT NULL DEFAULT '0',
  `retrieved` tinyint(1) NOT NULL DEFAULT '0',
  `sent` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_mail`
--

LOCK TABLES `users_mail` WRITE;
/*!40000 ALTER TABLE `users_mail` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_mail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_milestones`
--

DROP TABLE IF EXISTS `users_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_milestones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `milestone` int(11) NOT NULL,
  `achieved` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`milestone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_milestones`
--

LOCK TABLES `users_milestones` WRITE;
/*!40000 ALTER TABLE `users_milestones` DISABLE KEYS */;
INSERT INTO `users_milestones` VALUES (1,6,1,'2019-09-07 21:35:00'),(2,7,1,'2019-09-07 21:35:00');
/*!40000 ALTER TABLE `users_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_purchases`
--

DROP TABLE IF EXISTS `users_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `credits` int(11) NOT NULL,
  `reputation` int(11) NOT NULL,
  `transaction` varchar(50) NOT NULL,
  `claimed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction` (`transaction`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_purchases`
--

LOCK TABLES `users_purchases` WRITE;
/*!40000 ALTER TABLE `users_purchases` DISABLE KEYS */;
INSERT INTO `users_purchases` VALUES (1,2,100,55,'33X66852LA862514X',1);
/*!40000 ALTER TABLE `users_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_quests`
--

DROP TABLE IF EXISTS `users_quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_quests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `mon` int(11) NOT NULL,
  `req` int(11) NOT NULL,
  `cur` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_quests`
--

LOCK TABLES `users_quests` WRITE;
/*!40000 ALTER TABLE `users_quests` DISABLE KEYS */;
INSERT INTO `users_quests` VALUES (14,8,2,75,15),(42,4,4,50,24),(63,9,14,450,169),(66,7,20,600,394),(80,6,19,375,180),(81,14,1,25,24),(83,10,6,175,175),(92,17,3,125,120),(93,15,7,100,76),(104,19,8,225,72),(122,20,16,400,117),(130,2,10,300,274);
/*!40000 ALTER TABLE `users_quests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_redeems`
--

DROP TABLE IF EXISTS `users_redeems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_redeems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `redeem` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`redeem`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_redeems`
--

LOCK TABLES `users_redeems` WRITE;
/*!40000 ALTER TABLE `users_redeems` DISABLE KEYS */;
INSERT INTO `users_redeems` VALUES (1,3,1,'2019-09-07 21:35:00'),(2,2,1,'2019-09-07 21:35:00'),(3,12,1,'2019-09-07 21:35:00'),(4,15,1,'2019-09-07 21:35:00');
/*!40000 ALTER TABLE `users_redeems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_story`
--

DROP TABLE IF EXISTS `users_story`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_story` (
  `user` int(11) NOT NULL,
  `story` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  UNIQUE KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_story`
--

LOCK TABLES `users_story` WRITE;
/*!40000 ALTER TABLE `users_story` DISABLE KEYS */;
INSERT INTO `users_story` VALUES (2,2,167),(3,4,0),(4,2,0),(5,1,46),(6,4,0),(7,4,40),(8,2,0),(9,4,0),(10,2,0),(12,2,0),(14,1,124),(15,2,0),(18,2,0),(19,2,0),(20,4,0);
/*!40000 ALTER TABLE `users_story` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-28 23:03:13
