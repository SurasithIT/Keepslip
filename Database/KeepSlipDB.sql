-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema KeepSlipDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `KeepSlipDB` ;

-- -----------------------------------------------------
-- Schema KeepSlipDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `KeepSlipDB` DEFAULT CHARACTER SET utf8 ;
USE `KeepSlipDB` ;

-- -----------------------------------------------------
-- Table `KeepSlipDB`.`Customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `KeepSlipDB`.`Customer` ;

CREATE TABLE IF NOT EXISTS `KeepSlipDB`.`Customer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Firstname` VARCHAR(255) NOT NULL,
  `Lastname` VARCHAR(255) NOT NULL,
  `PhoneNumber` VARCHAR(10) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE,
  UNIQUE INDEX `PhoneNumber_UNIQUE` (`PhoneNumber` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `KeepSlipDB`.`Store`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `KeepSlipDB`.`Store` ;

CREATE TABLE IF NOT EXISTS `KeepSlipDB`.`Store` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `NID` VARCHAR(13) NOT NULL,
  `BusinessName` VARCHAR(255) NOT NULL,
  `Branch_id` INT NOT NULL,
  `StoreName` VARCHAR(255) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `PostCode` VARCHAR(5) NOT NULL,
  `Username` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `KeepSlipDB`.`Receipt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `KeepSlipDB`.`Receipt` ;

CREATE TABLE IF NOT EXISTS `KeepSlipDB`.`Receipt` (
  `Customer_id` INT NOT NULL,
  `Store_id` INT NOT NULL,
  `Receipt_id` VARCHAR(45) NOT NULL,
  `KeepSlip_receipt_id` VARCHAR(255) NOT NULL,
  `Receipt_date` DATETIME NOT NULL,
  PRIMARY KEY (`KeepSlip_receipt_id`, `Customer_id`, `Store_id`),
  INDEX `fk_Customer_has_Store_Store1_idx` (`Store_id` ASC) VISIBLE,
  INDEX `fk_Customer_has_Store_Customer1_idx` (`Customer_id` ASC) VISIBLE,
  UNIQUE INDEX `KeepSlip_receipt_id_UNIQUE` (`KeepSlip_receipt_id` ASC) VISIBLE,
  CONSTRAINT `fk_Customer_has_Store_Customer1`
    FOREIGN KEY (`Customer_id`)
    REFERENCES `KeepSlipDB`.`Customer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Customer_has_Store_Store1`
    FOREIGN KEY (`Store_id`)
    REFERENCES `KeepSlipDB`.`Store` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
