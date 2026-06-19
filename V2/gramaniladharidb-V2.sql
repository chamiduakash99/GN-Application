-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: gramaniladharidb
-- ------------------------------------------------------
-- Server version	8.0.25

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
-- Table structure for table `citizen`
--

DROP TABLE IF EXISTS `citizen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citizen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `nic` char(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citizen`
--

LOCK TABLES `citizen` WRITE;
/*!40000 ALTER TABLE `citizen` DISABLE KEYS */;
/*!40000 ALTER TABLE `citizen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designation`
--

DROP TABLE IF EXISTS `designation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designation`
--

LOCK TABLES `designation` WRITE;
/*!40000 ALTER TABLE `designation` DISABLE KEYS */;
INSERT INTO `designation` VALUES (1,'Manager'),(2,'Accountant'),(3,'Cashier'),(4,'Store-Keeper');
/*!40000 ALTER TABLE `designation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `district`
--

DROP TABLE IF EXISTS `district`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `district` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `province_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_district_province1_idx` (`province_id`),
  CONSTRAINT `fk_district_province1` FOREIGN KEY (`province_id`) REFERENCES `province` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `district`
--

LOCK TABLES `district` WRITE;
/*!40000 ALTER TABLE `district` DISABLE KEYS */;
INSERT INTO `district` VALUES (1,'Colombo',9),(2,'Gampaha',9),(3,'Kalutara',9);
/*!40000 ALTER TABLE `district` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `division`
--

DROP TABLE IF EXISTS `division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `division` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `district_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_division_district1_idx` (`district_id`),
  CONSTRAINT `fk_division_district1` FOREIGN KEY (`district_id`) REFERENCES `district` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `division`
--

LOCK TABLES `division` WRITE;
/*!40000 ALTER TABLE `division` DISABLE KEYS */;
INSERT INTO `division` VALUES (1,'Colombo',1),(2,'Dehiwala',1),(3,'Homagama',1),(4,'Kaduwela',1),(5,'Kesbewa',1),(6,'Kolonnawa',1),(7,'Kotte',1),(8,'Maharagama',1),(9,'Moratuwa',1),(10,'Padukka',1),(11,'Ratmalana',1),(12,'Seethawaka',1),(13,'Thimbirigasyaya',1);
/*!40000 ALTER TABLE `division` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` char(4) DEFAULT NULL,
  `fullname` varchar(150) DEFAULT NULL,
  `callingname` varchar(45) DEFAULT NULL,
  `photo` longblob,
  `gender_id` int NOT NULL,
  `dobirth` date DEFAULT NULL,
  `nic` char(12) DEFAULT NULL,
  `address` text,
  `mobile` char(10) DEFAULT NULL,
  `land` char(10) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `emptype_id` int NOT NULL,
  `designation_id` int NOT NULL,
  `doassignment` date DEFAULT NULL,
  `description` text,
  `empstatus_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_designation_idx` (`designation_id`),
  KEY `fk_employee_gender1_idx` (`gender_id`),
  KEY `fk_employee_empstatus1_idx` (`empstatus_id`),
  KEY `fk_employee_emptype1_idx` (`emptype_id`),
  CONSTRAINT `fk_employee_designation` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`id`),
  CONSTRAINT `fk_employee_empstatus1` FOREIGN KEY (`empstatus_id`) REFERENCES `empstatus` (`id`),
  CONSTRAINT `fk_employee_emptype1` FOREIGN KEY (`emptype_id`) REFERENCES `emptype` (`id`),
  CONSTRAINT `fk_employee_gender1` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'2101','Ashan Pathum Dissanayake','Ashan',_binary '?',1,'2001-08-24','200123401982','Dambulla Road, Sigiriya','0770610861','0665714150','ashan.d@harvest.lk',1,2,'2024-03-12','BIT UG',1),(2,'2102','Dileesha Rukmal Ekanayake','Rukmal',_binary '?',1,'2000-03-23','200078451125','Kandy Road, Kegalle','0770121848','0657845114','rukmal.d@harvest.lk',2,1,'2024-03-12','BIT UG',1);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empstatus`
--

DROP TABLE IF EXISTS `empstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empstatus`
--

LOCK TABLES `empstatus` WRITE;
/*!40000 ALTER TABLE `empstatus` DISABLE KEYS */;
INSERT INTO `empstatus` VALUES (1,'Assigned'),(2,'Unassigned'),(3,'Suspended'),(4,'Resignation'),(5,'Retired');
/*!40000 ALTER TABLE `empstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emptype`
--

DROP TABLE IF EXISTS `emptype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emptype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emptype`
--

LOCK TABLES `emptype` WRITE;
/*!40000 ALTER TABLE `emptype` DISABLE KEYS */;
INSERT INTO `emptype` VALUES (1,'Permanent'),(2,'Contract'),(3,'Probation');
/*!40000 ALTER TABLE `emptype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fencetype`
--

DROP TABLE IF EXISTS `fencetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fencetype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fencetype`
--

LOCK TABLES `fencetype` WRITE;
/*!40000 ALTER TABLE `fencetype` DISABLE KEYS */;
INSERT INTO `fencetype` VALUES (1,'Brick Walls'),(2,'Concrete Walls'),(3,'Wire Mesh'),(4,'Hedge'),(5,'Wooden Fence'),(6,'Stone rock Fence'),(7,'Barbed Wire Fence'),(8,'Bamboo Fence'),(9,'Metal fence'),(10,'Electric Fence');
/*!40000 ALTER TABLE `fencetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender`
--

DROP TABLE IF EXISTS `gender`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender`
--

LOCK TABLES `gender` WRITE;
/*!40000 ALTER TABLE `gender` DISABLE KEYS */;
INSERT INTO `gender` VALUES (1,'Male'),(2,'Female'),(3,'Other');
/*!40000 ALTER TABLE `gender` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gnd`
--

DROP TABLE IF EXISTS `gnd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gnd` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `division_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gnd_division1_idx` (`division_id`),
  CONSTRAINT `fk_gnd_division1` FOREIGN KEY (`division_id`) REFERENCES `division` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gnd`
--

LOCK TABLES `gnd` WRITE;
/*!40000 ALTER TABLE `gnd` DISABLE KEYS */;
INSERT INTO `gnd` VALUES (1,'Pepiliyana West',5),(2,'Pepiliyana East',5),(3,'Divulpitiya East',5),(4,'Divulpitiya West',5),(5,'Bellanvila',5),(6,'Boralesgamuwa West A',5),(7,'Boralesgamuwa West C',5),(8,'Rattanapitiya',5),(9,'Egodawatta',5),(10,'Boralesgamuwa East A',5),(11,'Boralesgamuwa West B',5),(12,'Werahera North',5),(13,'Boralesgamuwa East B',5),(14,'Neelammahara',5),(15,'Katuwawala North',5),(16,'Vishwakalawa',5),(17,'Werahera South',5),(18,'Katuwawala South',5),(19,'Niwanthidiya',5),(20,'Erewwala West',5),(21,'Erewwala North',5),(22,'Erewwala East',5),(23,'Rathmaldeniya',5),(24,'Mahalwarawa',5),(25,'Bangalawatta',5),(26,'Pelenwatta East',5),(27,'Pelenwatta North',5),(28,'Pelenwatta West',5),(29,'Paligedara',5),(30,'Kaliyammahara',5),(31,'Bokundara',5),(32,'Thumbovila South',5),(33,'Thumbovila North',5),(34,'Wewala West',5),(35,'Wewala East',5),(36,'Thumbovila West',5),(37,'Mampe North',5),(38,'Makuludoowa',5),(39,'Gorakapitiya',5),(40,'Nampamunuwa',5),(41,'Mavittara North',5),(42,'Mampe East',5),(43,'Bodhirajapura',5),(44,'Mampe West',5),(45,'Mampe South',5),(46,'Kolamunna',5),(47,'Suwarapola East',5),(48,'Suwarapola West',5),(49,'Hedigama',5),(50,'Batakettara North',5),(51,'Kesbewa North',5),(52,'Kesbewa East',5),(53,'Mavittara South',5),(54,'Honnanthara North',5),(55,'Honnanthara South',5),(56,'Makandana East',5),(57,'Kesbewa South',5),(58,'Batakettara South',5),(59,'Madapatha',5),(60,'Delthara West',5),(61,'Delthara East',5),(62,'Dampe',5),(63,'Makandana West',5),(64,'Nivungama',5),(65,'Halpita',5),(66,'Horathuduwa',5),(67,'Morenda',5),(68,'Batuwandara North',5),(69,'Batuwandara South',5),(70,'Jamburaliya',5),(71,'Polhena',5),(72,'Regidel Watta',5),(73,'Kahapola',5);
/*!40000 ALTER TABLE `gnd` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `land`
--

DROP TABLE IF EXISTS `land`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `land` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street_id` int NOT NULL,
  `latitude` decimal(8,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `size` double DEFAULT NULL,
  `landtype_id` int NOT NULL,
  `citizen_id` int DEFAULT NULL,
  `image` mediumblob,
  `deed` mediumblob,
  `fencetype_id` int NOT NULL,
  `remarks` text,
  PRIMARY KEY (`id`),
  KEY `fk_land_landtype1_idx` (`landtype_id`),
  KEY `fk_land_street1_idx` (`street_id`),
  KEY `fk_land_citizen1_idx` (`citizen_id`),
  KEY `fk_land_fencetype1_idx` (`fencetype_id`),
  CONSTRAINT `fk_land_citizen1` FOREIGN KEY (`citizen_id`) REFERENCES `citizen` (`id`),
  CONSTRAINT `fk_land_fencetype1` FOREIGN KEY (`fencetype_id`) REFERENCES `fencetype` (`id`),
  CONSTRAINT `fk_land_landtype1` FOREIGN KEY (`landtype_id`) REFERENCES `landtype` (`id`),
  CONSTRAINT `fk_land_street1` FOREIGN KEY (`street_id`) REFERENCES `street` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `land`
--

LOCK TABLES `land` WRITE;
/*!40000 ALTER TABLE `land` DISABLE KEYS */;
INSERT INTO `land` VALUES (1,1,6.815000,79.928500,0.062,1,NULL,NULL,NULL,1,'Residential plot on Rathna Mawatha'),(2,2,6.820000,79.930000,0.074,3,NULL,NULL,NULL,3,'Agricultural land on Temple Road'),(3,3,6.826000,79.929000,0.037,1,NULL,NULL,NULL,2,'Residential land along Arewwala-Bokundara Road'),(4,4,6.826200,79.929200,0.124,4,NULL,NULL,NULL,6,'Forest reserve - government owned'),(5,5,6.821200,79.927800,0.247,4,NULL,NULL,NULL,8,'Wetland near Kaliyammahara West Sub Road'),(6,6,6.824500,79.930000,0.049,2,NULL,NULL,NULL,4,'Commercial plot on Mendis Mawatha'),(7,7,6.826500,79.931000,0.086,1,NULL,NULL,NULL,5,'Private residential plot on Samagi Mawatha'),(8,8,6.828000,79.931500,0.297,3,NULL,NULL,NULL,7,'Agricultural land on Sri Saddharma Mawatha'),(9,9,6.825500,79.929500,0.198,4,NULL,NULL,NULL,9,'Estate land - coconut plantation on Kithul Kele Road'),(10,10,6.826400,79.929500,0.111,1,NULL,NULL,NULL,10,'Residential land on Sirisena Road'),(11,11,6.823000,79.928800,0.025,2,NULL,NULL,NULL,2,'Small commercial plot on Sunethra Lane'),(12,12,6.821800,79.928500,0.148,4,NULL,NULL,NULL,1,'Forest patch on Lake View Road'),(13,13,6.824500,79.929800,0.136,4,NULL,NULL,NULL,3,'Government wetland on Post Office Lane'),(14,14,6.819800,79.926100,0.074,1,NULL,NULL,NULL,9,'Residential plot near Tank Access Footpath'),(15,15,6.820800,79.927200,0.037,2,NULL,NULL,NULL,10,'Business land along Ananda Mw Kaliyammahara'),(16,1,6.815500,79.928700,0.099,3,NULL,NULL,NULL,3,'Agricultural plot on Rathna Mawatha'),(17,2,6.820500,79.930200,0.062,1,NULL,NULL,NULL,2,'Residential plot on Temple Road'),(18,3,6.826500,79.929200,0.148,4,NULL,NULL,NULL,6,'Government forest land'),(19,4,6.826300,79.929500,0.198,4,NULL,NULL,NULL,8,'Wetland near 4th Lane Niwanthidiya'),(20,5,6.821500,79.928000,0.049,2,NULL,NULL,NULL,4,'Small commercial plot'),(21,6,6.824800,79.930200,0.124,1,NULL,NULL,NULL,5,'Residential plot on Mendis Mawatha'),(22,7,6.826700,79.931200,0.086,3,NULL,NULL,NULL,7,'Agricultural land on Samagi Mawatha'),(23,8,6.828200,79.931700,0.247,4,NULL,NULL,NULL,9,'Estate land on Sri Saddharma Mawatha'),(24,9,6.825800,79.929700,0.111,1,NULL,NULL,NULL,10,'Residential land on Kithul Kele Road'),(25,10,6.826600,79.929700,0.148,4,NULL,NULL,NULL,1,'Forest patch on Sirisena Road'),(26,11,6.823200,79.928900,0.037,2,NULL,NULL,NULL,2,'Commercial land on Sunethra Lane'),(27,12,6.822000,79.928700,0.086,1,NULL,NULL,NULL,3,'Residential land on Lake View Road'),(28,13,6.824800,79.930000,0.124,3,NULL,NULL,NULL,4,'Agricultural land on Post Office Lane'),(29,14,6.820000,79.926200,0.074,1,NULL,NULL,NULL,5,'Residential land near Tank Access Footpath'),(30,15,6.821000,79.927300,0.049,2,NULL,NULL,NULL,6,'Business land along Ananda Mw Kaliyammahara');
/*!40000 ALTER TABLE `land` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landfeature`
--

DROP TABLE IF EXISTS `landfeature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landfeature` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landfeature`
--

LOCK TABLES `landfeature` WRITE;
/*!40000 ALTER TABLE `landfeature` DISABLE KEYS */;
INSERT INTO `landfeature` VALUES (1,'Private Residential Land'),(2,'Private Agricultural Land'),(3,'Government Land'),(4,'Forest'),(5,'Wetland'),(6,'Coastal Land'),(7,'Estate Land'),(8,'Historical Land'),(9,'Commercial Land'),(10,'Park Land'),(11,'Religious Land'),(12,'Public Utility Land');
/*!40000 ALTER TABLE `landfeature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landfeaturedetails`
--

DROP TABLE IF EXISTS `landfeaturedetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landfeaturedetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `landfeature_id` int NOT NULL,
  `land_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_landfeature_has_land_land1_idx` (`land_id`),
  KEY `fk_landfeature_has_land_landfeature1_idx` (`landfeature_id`),
  CONSTRAINT `fk_landfeature_has_land_land1` FOREIGN KEY (`land_id`) REFERENCES `land` (`id`),
  CONSTRAINT `fk_landfeature_has_land_landfeature1` FOREIGN KEY (`landfeature_id`) REFERENCES `landfeature` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landfeaturedetails`
--

LOCK TABLES `landfeaturedetails` WRITE;
/*!40000 ALTER TABLE `landfeaturedetails` DISABLE KEYS */;
INSERT INTO `landfeaturedetails` VALUES (1,1,1),(2,2,2),(3,1,3),(4,4,4),(5,5,5),(6,9,6),(7,1,7),(8,2,8),(9,7,9),(10,1,10),(11,9,11),(12,4,12),(13,5,13),(14,1,14),(15,9,15),(16,3,16),(17,1,17),(18,4,18),(19,5,19),(20,9,20),(21,1,21),(22,2,22),(23,7,23),(24,1,24),(25,4,25),(26,9,26),(27,1,27),(28,3,28),(29,1,29),(30,2,30);
/*!40000 ALTER TABLE `landfeaturedetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landtype`
--

DROP TABLE IF EXISTS `landtype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landtype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landtype`
--

LOCK TABLES `landtype` WRITE;
/*!40000 ALTER TABLE `landtype` DISABLE KEYS */;
INSERT INTO `landtype` VALUES (1,'Resident'),(2,'Business'),(3,'Agricultural'),(4,'Spare');
/*!40000 ALTER TABLE `landtype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'Employee'),(2,'User'),(3,'Privilege'),(4,'Operation'),(5,'Item'),(6,'Street');
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation`
--

DROP TABLE IF EXISTS `operation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `module_id` int DEFAULT NULL,
  `opetype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_operation_opetype1_idx` (`opetype_id`),
  KEY `fk_operation_module1_idx` (`module_id`),
  CONSTRAINT `fk_operation_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_operation_opetype1` FOREIGN KEY (`opetype_id`) REFERENCES `opetype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation`
--

LOCK TABLES `operation` WRITE;
/*!40000 ALTER TABLE `operation` DISABLE KEYS */;
INSERT INTO `operation` VALUES (1,'Insert',1,1),(2,'Select',1,1),(3,'Update',1,1),(4,'Delete',1,1),(5,'Insert',2,1),(6,'Select',2,1),(7,'Update',2,1),(8,'Delete',2,1),(9,'Insert',3,1),(10,'Select',3,1),(11,'Update',3,1),(12,'Delete',3,1),(13,'Insert',4,1),(14,'Select',4,1),(15,'Update',4,1),(16,'Delete',4,1);
/*!40000 ALTER TABLE `operation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opetype`
--

DROP TABLE IF EXISTS `opetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opetype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opetype`
--

LOCK TABLES `opetype` WRITE;
/*!40000 ALTER TABLE `opetype` DISABLE KEYS */;
INSERT INTO `opetype` VALUES (1,'Default'),(2,'Specific');
/*!40000 ALTER TABLE `opetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `privilege`
--

DROP TABLE IF EXISTS `privilege`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `privilege` (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_id` int NOT NULL,
  `operation_id` int NOT NULL,
  `authority` varchar(45) DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_privilege_operation1_idx` (`operation_id`),
  KEY `fk_privilege_module1_idx` (`module_id`),
  KEY `fk_privilege_role1_idx` (`role_id`),
  CONSTRAINT `fk_privilege_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`),
  CONSTRAINT `fk_privilege_operation1` FOREIGN KEY (`operation_id`) REFERENCES `operation` (`id`),
  CONSTRAINT `fk_privilege_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `privilege`
--

LOCK TABLES `privilege` WRITE;
/*!40000 ALTER TABLE `privilege` DISABLE KEYS */;
INSERT INTO `privilege` VALUES (1,1,1,'Employee-Insert',2),(2,1,2,'Employee-Select',2),(3,1,3,'Employee-Update',2),(4,1,4,'Employee-Delete',2),(5,2,1,'User-Insert',1),(6,2,8,'user-delete',1),(7,2,3,'User-Update',1),(8,2,4,'User-Delete',1),(9,3,1,'Privilege-Insert',1),(10,3,2,'Privilege-Select',1),(11,3,3,'Privilege-Update',1),(12,3,4,'Privilege-Delete',1),(13,4,1,'Operation-Insert',1),(14,4,2,'Operation-Select',1),(15,4,3,'Operation-Update',1),(16,4,4,'Operation-Delete',1),(17,5,1,'Item-Insert',3),(18,5,2,'Item-Select',3),(19,5,3,'Item-Update',3),(20,5,4,'Item-Delete',3),(21,1,3,'employee-update',1);
/*!40000 ALTER TABLE `privilege` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `province`
--

DROP TABLE IF EXISTS `province`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `province` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `province`
--

LOCK TABLES `province` WRITE;
/*!40000 ALTER TABLE `province` DISABLE KEYS */;
INSERT INTO `province` VALUES (1,'Central Province'),(2,'Eastern Province'),(3,'Northern Province'),(4,'North Central Province'),(5,'North Western Province'),(6,'Sabaragamuwa Province'),(7,'Southern Province'),(8,'Uva Province'),(9,'Western Province');
/*!40000 ALTER TABLE `province` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin'),(2,'HR Manager'),(3,'Inventry Manager');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `street`
--

DROP TABLE IF EXISTS `street`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `street` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gnd_id` int NOT NULL,
  `codename` varchar(45) DEFAULT NULL,
  `fullname` varchar(150) DEFAULT NULL,
  `mapimage` mediumblob,
  `startlatitude` decimal(8,6) DEFAULT NULL,
  `startlongitude` decimal(9,6) DEFAULT NULL,
  `endlatitude` decimal(8,6) DEFAULT NULL,
  `endlongitude` decimal(9,6) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `streetstatus_id` int NOT NULL,
  `streettype_id` int NOT NULL,
  `streetmatierial_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_street_streetstatus1_idx` (`streetstatus_id`),
  KEY `fk_street_streetmatierial1_idx` (`streetmatierial_id`),
  KEY `fk_street_streettype1_idx` (`streettype_id`),
  KEY `fk_street_gnd1_idx` (`gnd_id`),
  CONSTRAINT `fk_street_gnd1` FOREIGN KEY (`gnd_id`) REFERENCES `gnd` (`id`),
  CONSTRAINT `fk_street_streetmatierial1` FOREIGN KEY (`streetmatierial_id`) REFERENCES `streetmatierial` (`id`),
  CONSTRAINT `fk_street_streetstatus1` FOREIGN KEY (`streetstatus_id`) REFERENCES `streetstatus` (`id`),
  CONSTRAINT `fk_street_streettype1` FOREIGN KEY (`streettype_id`) REFERENCES `streettype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `street`
--

LOCK TABLES `street` WRITE;
/*!40000 ALTER TABLE `street` DISABLE KEYS */;
INSERT INTO `street` VALUES (1,19,'ST001','Rathna Mawatha',NULL,6.814771,79.928228,6.826086,79.930388,1.25,5.00,1,2,1),(2,31,'ST002','Temple Road',NULL,6.819800,79.929200,6.823500,79.931700,0.75,4.50,2,3,2),(3,19,'ST003','Arewwala-Bokundara Road',NULL,6.825750,79.928680,6.829500,79.932200,0.45,6.50,1,1,1),(4,19,'ST004','4th Lane Niwanthidiya',NULL,6.825900,79.928900,6.826400,79.929400,0.12,3.00,3,3,3),(5,30,'ST005','Kaliyammahara West Sub Road',NULL,6.820900,79.927100,6.821700,79.928400,0.20,2.50,1,4,5),(6,23,'ST006','Mendis Mawatha',NULL,6.823200,79.929700,6.824600,79.931000,0.35,4.00,4,2,2),(7,45,'ST007','Samagi Mawatha',NULL,6.826100,79.930800,6.827300,79.932100,0.30,3.50,1,3,4),(8,32,'ST008','Sri Saddharma Mawatha',NULL,6.827500,79.930900,6.828700,79.932200,0.28,3.00,2,2,1),(9,23,'ST009','Kithul Kele Road',NULL,6.824200,79.927800,6.826800,79.930000,0.52,5.50,1,1,2),(10,12,'ST010','Sirisena Road',NULL,6.825100,79.928400,6.826600,79.930000,0.42,4.00,7,3,3),(11,31,'ST011','Sunethra Lane',NULL,6.822200,79.928100,6.823400,79.929400,0.30,3.00,5,5,4),(12,30,'ST012','Lake View Road',NULL,6.821100,79.927900,6.822300,79.929100,0.35,3.20,3,2,1),(13,31,'ST013','Post Office Lane',NULL,6.823900,79.929000,6.824700,79.930400,0.25,2.80,1,4,5),(14,4,'ST014','Tank Access Footpath',NULL,6.819500,79.925800,6.820100,79.926400,0.08,1.50,5,5,4),(15,13,'ST015','Ananda Mw Kaliyammahara',NULL,6.820200,79.926600,6.821800,79.927800,0.20,2.50,2,4,5),(16,23,'ST016','Niwanthidiya Main Street',NULL,6.823800,79.929900,6.825200,79.931400,0.40,5.50,1,1,2),(17,13,'ST017','Kalinga Mawatha',NULL,6.826700,79.931500,6.828400,79.933000,0.38,4.20,3,2,3),(18,34,'ST018','Lake Cross Lane',NULL,6.822800,79.928700,6.823900,79.929900,0.27,2.80,6,3,3),(19,30,'ST019','Kaliyammahara East Footpath',NULL,6.819000,79.926200,6.820000,79.927100,0.10,1.20,4,5,4),(20,5,'ST020','Old Depot Road',NULL,6.824400,79.928600,6.825900,79.930200,0.33,4.00,7,6,1);
/*!40000 ALTER TABLE `street` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streetmatierial`
--

DROP TABLE IF EXISTS `streetmatierial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streetmatierial` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streetmatierial`
--

LOCK TABLES `streetmatierial` WRITE;
/*!40000 ALTER TABLE `streetmatierial` DISABLE KEYS */;
INSERT INTO `streetmatierial` VALUES (1,'Asphalt'),(2,'Concrete'),(3,'Gravel'),(4,'Soil'),(5,'Interlock Blocks');
/*!40000 ALTER TABLE `streetmatierial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streetstatus`
--

DROP TABLE IF EXISTS `streetstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streetstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streetstatus`
--

LOCK TABLES `streetstatus` WRITE;
/*!40000 ALTER TABLE `streetstatus` DISABLE KEYS */;
INSERT INTO `streetstatus` VALUES (1,'Good Condition'),(2,'Under Maintenance'),(3,'Under Construction'),(4,'Closed'),(5,'Not Accessible'),(6,'Abandoned'),(7,'Bad Condition');
/*!40000 ALTER TABLE `streetstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streettype`
--

DROP TABLE IF EXISTS `streettype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streettype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streettype`
--

LOCK TABLES `streettype` WRITE;
/*!40000 ALTER TABLE `streettype` DISABLE KEYS */;
INSERT INTO `streettype` VALUES (1,'Main Road'),(2,'Sub Road/Secondary Road'),(3,'By Road/Lane'),(4,'Private Road'),(5,'Footpath'),(6,'Estate Road');
/*!40000 ALTER TABLE `streettype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `docreated` date DEFAULT NULL,
  `tocreated` time DEFAULT NULL,
  `description` text,
  `usestatus_id` int NOT NULL,
  `usetype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_usestatus1_idx` (`usestatus_id`),
  KEY `fk_user_usetype1_idx` (`usetype_id`),
  KEY `fk_user_employee1_idx` (`employee_id`),
  CONSTRAINT `fk_user_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_user_usestatus1` FOREIGN KEY (`usestatus_id`) REFERENCES `usestatus` (`id`),
  CONSTRAINT `fk_user_usetype1` FOREIGN KEY (`usetype_id`) REFERENCES `usetype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'ashan.d','$2a$10$NLzY2MtzLozonzqYmSQAJeHMzOyav9ryFUUWF.hBoQAhioSLKUqem','$2a$10$O8zD7FhUl94AF9KRMQWr0.LNGUhqpkDuSdJBxGG9ZsF1ma8vFQYM2','2024-03-12','09:31:16',NULL,1,1),(3,1,'test','$2a$10$7KsVkgldzNdsgmVvCZzdyuG1I4m8Lbj6MtJUc6Q/EbbcwmjKtkUKK','$2a$10$FPon921rL2vOmXaqWQPtCucnVqSvxTOmEKK4Ge86vstKwBv/0kJDK','2024-03-25','03:01:38',NULL,1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrole`
--

DROP TABLE IF EXISTS `userrole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userrole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userrole_user1_idx` (`user_id`),
  KEY `fk_userrole_role1_idx` (`role_id`),
  CONSTRAINT `fk_userrole_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_userrole_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrole`
--

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;
INSERT INTO `userrole` VALUES (1,1,1),(4,3,1);
/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usestatus`
--

DROP TABLE IF EXISTS `usestatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usestatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usestatus`
--

LOCK TABLES `usestatus` WRITE;
/*!40000 ALTER TABLE `usestatus` DISABLE KEYS */;
INSERT INTO `usestatus` VALUES (1,'Active'),(2,'Inactive'),(3,'Blocked');
/*!40000 ALTER TABLE `usestatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usetype`
--

DROP TABLE IF EXISTS `usetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usetype` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usetype`
--

LOCK TABLES `usetype` WRITE;
/*!40000 ALTER TABLE `usetype` DISABLE KEYS */;
INSERT INTO `usetype` VALUES (1,'Privileged'),(2,'Guest');
/*!40000 ALTER TABLE `usetype` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-17 13:09:13
