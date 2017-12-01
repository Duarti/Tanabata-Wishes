-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema tanabata_wishes
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `tanabata_wishes` ;

-- -----------------------------------------------------
-- Schema tanabata_wishes
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `tanabata_wishes` DEFAULT CHARACTER SET utf8 ;
USE `tanabata_wishes` ;

-- -----------------------------------------------------
-- Table `tanabata_wishes`.`desejo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tanabata_wishes`.`desejo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `texto` TEXT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `tanabata_wishes`.`palavra`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tanabata_wishes`.`palavra` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `palavra` VARCHAR(255) NOT NULL,
  `quantidade` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `palavra_UNIQUE` (`palavra` ASC))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
