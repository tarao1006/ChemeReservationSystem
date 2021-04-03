CREATE TABLE IF NOT EXISTS `user_group` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(255) NOT NULL,
  `user_type_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`user_id`, `user_type_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  FOREIGN KEY (`user_type_id`) REFERENCES `user_type` (`id`)
);
