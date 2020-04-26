-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ReceiptDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ReceiptDB` ;

-- -----------------------------------------------------
-- Schema ReceiptDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ReceiptDB` DEFAULT CHARACTER SET utf8 ;
USE `ReceiptDB` ;

-- -----------------------------------------------------
-- Table `ReceiptDB`.`Receipt`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ReceiptDB`.`Receipt` ;

CREATE TABLE IF NOT EXISTS `ReceiptDB`.`Receipt` (
  `id` VARCHAR(45) NOT NULL,
  `ReceiptDate` DATETIME NOT NULL,
  `Store_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Store_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ReceiptDB`.`Item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ReceiptDB`.`Item` ;

CREATE TABLE IF NOT EXISTS `ReceiptDB`.`Item` (
  `ItemNumber` VARCHAR(45) NOT NULL,
  `ProductName` VARCHAR(255) NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  `Quantity` INT NOT NULL,
  `Warranty` TINYINT(1) NOT NULL DEFAULT 0,
  `WarrantyTime` INT NOT NULL DEFAULT 0,
  `Receipt_id` VARCHAR(45) NOT NULL,
  `Receipt_Store_id` INT NOT NULL,
  PRIMARY KEY (`Receipt_id`, `Receipt_Store_id`, `ItemNumber`),
  INDEX `fk_Item_Receipt_idx` (`Receipt_id` ASC, `Receipt_Store_id` ASC) VISIBLE,
  CONSTRAINT `fk_Item_Receipt`
    FOREIGN KEY (`Receipt_id` , `Receipt_Store_id`)
    REFERENCES `ReceiptDB`.`Receipt` (`id` , `Store_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
