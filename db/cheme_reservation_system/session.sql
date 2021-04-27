CREATE TABLE IF NOT EXISTS `session` (
  `user_id` VARCHAR(255) NOT NULL,
  `id` VARCHAR(255) NOT NULL,
  `expire_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
