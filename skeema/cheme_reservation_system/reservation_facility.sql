CREATE TABLE `reservation_facility` (
  `id` INT NOT NULL,
  `reservation_id` INT NOT NULL,
  `facility_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`reservation_id`, `facility_id`),
  FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  FOREIGN KEY (`facility_id`) REFERENCES `facility` (`id`)
);
