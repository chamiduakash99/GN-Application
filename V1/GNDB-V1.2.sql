-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: gndb
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
  KEY `fk_employee_gender_idx` (`gender_id`),
  KEY `fk_employee_designation1_idx` (`designation_id`),
  KEY `fk_employee_empstatus1_idx` (`empstatus_id`),
  KEY `fk_employee_emptype1_idx` (`emptype_id`),
  CONSTRAINT `fk_employee_designation1` FOREIGN KEY (`designation_id`) REFERENCES `designation` (`id`),
  CONSTRAINT `fk_employee_empstatus1` FOREIGN KEY (`empstatus_id`) REFERENCES `empstatus` (`id`),
  CONSTRAINT `fk_employee_emptype1` FOREIGN KEY (`emptype_id`) REFERENCES `emptype` (`id`),
  CONSTRAINT `fk_employee_gender` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`)
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
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'Employee'),(2,'User'),(3,'Privilege'),(4,'Operation'),(5,'Item');
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
  `name` varchar(45) NOT NULL,
  `module_id` int NOT NULL,
  `opetype_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  KEY `opetype_id` (`opetype_id`),
  CONSTRAINT `operation_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `operation_ibfk_2` FOREIGN KEY (`opetype_id`) REFERENCES `opetype` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
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
  `name` varchar(45) NOT NULL,
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
  `authority` varchar(45) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  KEY `operation_id` (`operation_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `privilege_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `privilege_ibfk_2` FOREIGN KEY (`operation_id`) REFERENCES `operation` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `privilege_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
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
  KEY `fk_street_streettype1_idx` (`streettype_id`),
  KEY `fk_street_streetmatierial1_idx` (`streetmatierial_id`),
  CONSTRAINT `fk_street_streetmatierial1` FOREIGN KEY (`streetmatierial_id`) REFERENCES `streetmatierial` (`id`),
  CONSTRAINT `fk_street_streetstatus1` FOREIGN KEY (`streetstatus_id`) REFERENCES `streetstatus` (`id`),
  CONSTRAINT `fk_street_streettype1` FOREIGN KEY (`streettype_id`) REFERENCES `streettype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `street`
--

LOCK TABLES `street` WRITE;
/*!40000 ALTER TABLE `street` DISABLE KEYS */;
INSERT INTO `street` VALUES (1,'ST001','Kaliyammahara Main Road',NULL,7.034512,79.965842,7.042318,79.972634,2.80,8.00,1,1,1),(2,'ST002','Niwanthidiya Temple Road',NULL,7.037216,79.968145,7.040678,79.970852,1.10,5.50,1,2,2),(3,'ST003','School Lane Niwanthidiya',NULL,7.038541,79.969223,7.039842,79.970564,0.45,3.50,2,4,5),(4,'ST004','Kaliyammahara South By Road',NULL,7.033422,79.967513,7.035982,79.969832,0.90,4.00,3,3,3),(5,'ST005','Niwanthidiya Tank Access Road',NULL,7.041286,79.971512,7.043652,79.973862,1.25,5.00,1,2,1),(6,'ST006','Samagi Mawatha',NULL,7.039172,79.970232,7.041182,79.971945,0.70,4.50,4,3,2),(7,'ST007','Lake View Lane',NULL,7.042462,79.972873,7.043211,79.973485,0.30,2.50,1,4,5),(8,'ST008','Wattegedara Road',NULL,7.035892,79.966432,7.040172,79.970872,1.80,6.50,1,1,1),(9,'ST009','Kaliyammahara North Footpath',NULL,7.043162,79.973154,7.044012,79.973945,0.25,1.20,3,5,4),(10,'ST010','Vidyaloka Road',NULL,7.038832,79.969854,7.041324,79.971624,1.10,4.80,2,2,2),(11,'ST011','Kaliyammahara East Main Road',NULL,7.036214,79.966842,7.043892,79.972615,2.60,7.80,1,1,1),(12,'ST012','Niwanthidiya West Main Road',NULL,7.039324,79.968122,7.045214,79.974251,2.10,7.20,2,1,2),(13,'ST013','Post Office Sub Road',NULL,7.037682,79.967982,7.040212,79.970843,0.95,5.00,3,2,3),(14,'ST014','Temple Access Lane',NULL,7.040935,79.971152,7.042154,79.972382,0.40,3.20,4,4,5),(15,'ST015','School Junction By Road',NULL,7.035721,79.967421,7.037321,79.969812,0.85,4.00,5,3,4),(16,'ST016','Samagi Garden Lane',NULL,7.038942,79.970162,7.040182,79.971732,0.55,3.10,1,4,5),(17,'ST017','Kaliyammahara Housing Scheme Road',NULL,7.037312,79.968845,7.039942,79.971542,1.35,5.60,2,2,2),(18,'ST018','Welikadawatte By Road',NULL,7.034682,79.966451,7.036982,79.968942,0.90,4.50,3,3,3),(19,'ST019','Niwanthidiya South Footpath',NULL,7.042362,79.972893,7.043152,79.973562,0.25,1.30,4,5,4),(20,'ST020','Vidyaloka Lane',NULL,7.038812,79.969932,7.040432,79.971422,0.60,3.00,5,4,2),(21,'ST021','Kaliyammahara Industrial Road',NULL,7.033982,79.965842,7.039412,79.970812,1.90,6.50,2,1,1),(22,'ST022','Tank Access By Road',NULL,7.041762,79.972512,7.043692,79.974162,0.80,4.20,1,3,2),(23,'ST023','Railway Parallel Road',NULL,7.035812,79.967312,7.041112,79.972212,2.10,6.80,3,1,1),(24,'ST024','Cemetery Footpath',NULL,7.042712,79.973482,7.043652,79.974215,0.20,1.00,5,5,4),(25,'ST025','Community Hall Sub Road',NULL,7.038562,79.969521,7.040781,79.971341,0.75,4.80,4,2,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
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
INSERT INTO `streetstatus` VALUES (1,'Good Condition'),(2,'Under Maintenance'),(3,'Under Construction'),(4,'Closed'),(5,'Not Accessible'),(6,'Abandoned');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streettype`
--

LOCK TABLES `streettype` WRITE;
/*!40000 ALTER TABLE `streettype` DISABLE KEYS */;
INSERT INTO `streettype` VALUES (1,'Main Road'),(2,'Sub Road/Secondary Road'),(3,'BBy Road/Lane'),(4,'Private Road'),(5,'Footpath'),(6,'Estate Road');
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
  KEY `fk_user_employee1_idx` (`employee_id`),
  KEY `fk_user_usetype1_idx` (`usetype_id`),
  CONSTRAINT `fk_user_employee1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  CONSTRAINT `fk_user_usestatus1` FOREIGN KEY (`usestatus_id`) REFERENCES `usestatus` (`id`),
  CONSTRAINT `fk_user_usetype1` FOREIGN KEY (`usetype_id`) REFERENCES `usetype` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
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
  KEY `fk_user_has_role_role1_idx` (`role_id`),
  KEY `fk_user_has_role_user1_idx` (`user_id`),
  CONSTRAINT `fk_user_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `fk_user_has_role_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
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
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
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

-- Dump completed on 2025-10-26 10:58:39
