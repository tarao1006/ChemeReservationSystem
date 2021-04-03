CREATE TABLE IF NOT EXISTS `facility_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `facility_id` INT NOT NULL,
  `facility_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`facility_id`, `facility_type_id`),
  FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`),
  FOREIGN KEY (`facility_type_id`) REFERENCES `facility_type` (`id`)
);
