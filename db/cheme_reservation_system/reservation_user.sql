CREATE TABLE `reservation_user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reservation_id` INT UNSIGNED NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`reservation_id`, `user_id`),
  FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
