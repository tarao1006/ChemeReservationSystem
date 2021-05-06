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
TRUNCATE `color`;
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

INSERT INTO `color` (`id`, `name`, `code`) VALUES (1, "ワイン", "#AD1457");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (2, "ミカン", "#F4511E");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (3, "レモン", "#E4C441");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (4, "バジル", "#0B8043");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (5, "ブルーベリー", "#3F51B5");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (6, "ブドウ", "#8E24AA");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (7, "ローズ", "#D81B60");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (8, "カボチャ", "#EF6C00");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (9, "アボカド", "#C0CA33");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (10, "ユーカリ", "#009688");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (11, "ラベンダー", "#7986CB");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (12, "ココア", "#795548");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (13, "トマト", "#D50000");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (14, "マンゴー", "#F09300");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (15, "ピスタチオ", "#7CB342");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (16, "ピーコーック", "#039BE5");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (17, "ライラック", "#B39DDB");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (18, "グラファイト", "#616161");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (19, "フラミンゴ", "#E67C73");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (20, "バナナ", "#F6BF26");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (21, "セージ", "#33B679");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (22, "コバルト", "#4285F4");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (23, "アメジスト", "#9E69AF");
INSERT INTO `color` (`id`, `name`, `code`) VALUES (24, "シラカバ", "#A79B8E");

INSERT INTO `facility` (`id`, `name`, `color_id`) VALUES (1, "施設A", 1);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (1, 1, 1);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (2, 1, 2);

INSERT INTO `facility` (`id`, `name`, `color_id`) VALUES (2, "施設B", 2);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (3, 2, 2);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (4, 2, 3);

INSERT INTO `facility` (`id`, `name`, `color_id`) VALUES (3, "施設C", 3);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (5, 3, 3);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (6, 3, 4);

INSERT INTO `facility` (`id`, `name`, `color_id`) VALUES (4, "施設D", 4);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (7, 4, 4);
INSERT INTO `facility_group` (`id`, `facility_id`, `facility_type_id`) VALUES (8, 4, 1);
