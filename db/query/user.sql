/* 対応する user_type を取得 */
SELECT
  ut.id as id,
  ut.name as name
FROM
  `user_group` as ug
INNER JOIN
  `user_type` as ut
ON
  ug.user_type_id = ut.id
WHERE
  ug.user_id = "professor001";

INSERT INTO
  user (`id`, `name`, `name_ruby`, `password_digest`, `email_address`)
VALUES
  ("student01", "田中", "たなか", "$2a$10$JxZ6lZbYqebq5o.oHTtrLeSEXNKOBp6ZcaIrquOD/KkXcp.1XZSm.", "tanaka@sample.com");
