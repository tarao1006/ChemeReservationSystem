CREATE TABLE `reservation_facility` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reservation_id` INT UNSIGNED NOT NULL,
  `facility_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`reservation_id`, `facility_id`),
  FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
);
