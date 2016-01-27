-- --------------------------------------------------------
-- Host:                         192.168.1.52
-- Server version:               5.5.5-10.0.21-MariaDB - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             8.0.0.4396
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for telegramdb
USE `telegramdb`;


-- Dumping structure for table telegramdb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(10) NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `password` varchar(500) NOT NULL,
  `regionId` int(50) DEFAULT NULL,
  `panelType` varchar(10) NOT NULL,
  `picture` varchar(500) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `confirmed` enum('Y','N') DEFAULT 'N',
  `idGet` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf32;

-- Dumping data for table telegramdb.users: ~4 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
REPLACE INTO `users` (`ID`, `userName`, `phone`, `password`, `regionId`, `panelType`, `picture`, `email`, `confirmed`, `idGet`) VALUES
	(1, 'condor', '9109021477', 'condor', 79, '1', NULL, NULL, 'N', NULL),
	(52, 'salamsalam100', '9155204016', 'bahbah', 0, '', NULL, NULL, 'N', NULL),
	(53, 'ali.khabbaz', '9155204016', 'bahbah', 0, '', NULL, NULL, 'N', NULL),
	(62, 'aaaaaaaaaa', '9155204016', 'bahbah', 0, '', NULL, NULL, 'N', NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
