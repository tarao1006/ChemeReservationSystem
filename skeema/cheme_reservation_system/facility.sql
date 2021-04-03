CREATE TABLE IF NOT EXISTS `facility` (
  `id` INT NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`)
);
