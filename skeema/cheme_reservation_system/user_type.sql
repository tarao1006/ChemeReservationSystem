CREATE TABLE IF NOT EXISTS `user_type` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`)
);
