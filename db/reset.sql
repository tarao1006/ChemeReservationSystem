SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE `facility_group`;
TRUNCATE `facility_type`;
TRUNCATE `facility`;
TRUNCATE `plan`;
TRUNCATE `reservation_facility`;
TRUNCATE `reservation_user`;
TRUNCATE `reservation`;
TRUNCATE `user_group`;
TRUNCATE `user_type`;
TRUNCATE `user`;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `user_type` (`id`, `name`) VALUES (1, "教授A");
INSERT INTO `user_type` (`id`, `name`) VALUES (2, "教授B");
INSERT INTO `user_type` (`id`, `name`) VALUES (3, "学生A");
INSERT INTO `user_type` (`id`, `name`) VALUES (4, "学生B");

INSERT INTO `facility_type` (`id`, `name`) VALUES (1, "施設タイプA");
INSERT INTO `facility_type` (`id`, `name`) VALUES (2, "施設タイプB");
INSERT INTO `facility_type` (`id`, `name`) VALUES (3, "施設タイプC");

INSERT INTO `plan` (`id`, `name`) VALUES (1, "会議");
INSERT INTO `plan` (`id`, `name`) VALUES (2, "ゼミ");

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "professor001", "test", "テスト", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "test@professor.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (1, "professor001", 1);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (2, "professor001", 2);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "student001", "test", "テスト", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "test@student.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (3, "student001", 3);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (4, "student001", 4);

INSERT INTO `facility` (`id`, `name`) VALUES (1, "施設A");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (1, 1, 1);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (2, 1, 2);

INSERT INTO `facility` (`id`, `name`) VALUES (2, "施設B");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (3, 2, 2);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (4, 2, 3);

INSERT INTO `facility` (`id`, `name`) VALUES (3, "施設C");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (5, 3, 3);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  1, "professor001", "2021-04-04 10:00:00", "2021-04-04 11:00:00", 1, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (1, 1, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (2, 1, "student001");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (1, 1, 1);
