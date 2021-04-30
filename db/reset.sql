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
INSERT INTO `user_type` (`id`, `name`) VALUES (3, "教授C");
INSERT INTO `user_type` (`id`, `name`) VALUES (4, "教授D");
INSERT INTO `user_type` (`id`, `name`) VALUES (5, "学生A");
INSERT INTO `user_type` (`id`, `name`) VALUES (6, "学生B");
INSERT INTO `user_type` (`id`, `name`) VALUES (7, "学生C");
INSERT INTO `user_type` (`id`, `name`) VALUES (8, "学生D");

INSERT INTO `facility_type` (`id`, `name`) VALUES (1, "施設タイプA");
INSERT INTO `facility_type` (`id`, `name`) VALUES (2, "施設タイプB");
INSERT INTO `facility_type` (`id`, `name`) VALUES (3, "施設タイプC");
INSERT INTO `facility_type` (`id`, `name`) VALUES (4, "施設タイプD");

INSERT INTO `plan` (`id`, `name`) VALUES (1, "会議");
INSERT INTO `plan` (`id`, `name`) VALUES (2, "ゼミ");

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "professor001", "佐藤", "さとう", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "professor001@professor.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (1, "professor001", 1);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (2, "professor001", 2);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "professor002", "田中", "たなか", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "professor002@professor.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (3, "professor002", 3);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (4, "professor002", 4);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "professor003", "山本", "やまもと", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "professor003@professor.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (5, "professor003", 1);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (6, "professor003", 3);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "professor004", "本田", "ほんだ", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "professor004@professor.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (7, "professor004", 2);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (8, "professor004", 4);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "student001", "1講座", "1こうざ", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "student001@student.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (9, "student001", 5);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (10, "student001", 6);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "student002", "2講座", "2こうざ", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "student002@student.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (11, "student002", 7);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (12, "student002", 8);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "student003", "3講座", "3こうざ", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "student003@student.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (13, "student003", 5);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (14, "student003", 7);

INSERT INTO `user` (
  `id`, `name`, `name_ruby`, `password_digest`, `email_address`
) VALUES (
  "student004", "4講座", "4こうざ", "$2a$10$5w24MxjLIqzZHIbzXvzv9.qcMdfOHesZS7Gf25x2.FZWXLr/Q0/Gq", "student004@student.com"
);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (15, "student004", 6);
INSERT INTO `user_group` (`id`, `user_id`, `user_type_id`) VALUES (16, "student004", 8);

INSERT INTO `facility` (`id`, `name`) VALUES (1, "施設A");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (1, 1, 1);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (2, 1, 2);

INSERT INTO `facility` (`id`, `name`) VALUES (2, "施設B");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (3, 2, 2);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (4, 2, 3);

INSERT INTO `facility` (`id`, `name`) VALUES (3, "施設C");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (5, 3, 3);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (6, 3, 4);

INSERT INTO `facility` (`id`, `name`) VALUES (4, "施設D");
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (7, 4, 4);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (8, 4, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  1, "professor001", "2021-04-01 10:00:00", "2021-04-01 14:00:00", 1, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (1, 1, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (2, 1, "student001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (3, 1, "student002");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (1, 1, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  2, "professor002", "2021-04-04 13:00:00", "2021-04-04 19:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (4, 2, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (5, 2, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (6, 2, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (2, 2, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  3, "student003", "2021-04-08 17:00:00", "2021-04-08 20:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (7, 3, "student003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (8, 3, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (9, 3, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (10, 3, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (3, 3, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  4, "student004", "2021-04-05 09:00:00", "2021-04-05 11:00:00", 1, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (11, 4, "student004");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (12, 4, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (13, 4, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (14, 4, "student003");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (4, 4, 3);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  5, "professor002", "2021-04-05 13:00:00", "2021-04-05 17:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (15, 5, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (16, 5, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (17, 5, "professor003");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (5, 5, 4);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  6, "professor002", "2021-04-10 10:00:00", "2021-04-10 14:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (18, 6, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (19, 6, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (6, 6, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  7, "professor001", "2021-04-12 08:00:00", "2021-04-12 17:00:00", 1, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (20, 7, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (21, 7, "student003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (22, 7, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (7, 7, 2);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  8, "professor001", "2021-04-14 16:00:00", "2021-04-14 19:00:00", 1, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (23, 8, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (24, 8, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (25, 8, "student003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (26, 8, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (8, 8, 3);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  9, "professor003", "2021-04-17 13:00:00", "2021-04-04 15:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (27, 9, "professor003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (28, 9, "professor004");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (29, 9, "student001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (30, 9, "student002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (31, 9, "student003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (32, 9, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (9, 9, 1);

INSERT INTO `reservation` (
  `id`, `creator_id`, `start_at`, `end_at`, `plan_id`, `plan_memo`
) VALUES (
  10, "professor002", "2021-04-21 18:00:00", "2021-04-21 19:00:00", 2, ""
);
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (33, 10, "professor002");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (34, 10, "professor001");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (35, 10, "student003");
INSERT INTO `reservation_user` (`id`, `reservation_id`, `user_id`) VALUES (36, 10, "student004");
INSERT INTO `reservation_facility` (`id`, `reservation_id`, `facility_id`) VALUES (10, 10, 4);
