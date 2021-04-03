CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `name_ruby` VARCHAR(255) NOT NULL,
  `password_digest` VARCHAR(255) NOT NULL,
  `email_address` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);
