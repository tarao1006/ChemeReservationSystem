/* 対応する facility_type を取得 */
SELECT
  ft.id as id,
  ft.name as name
FROM
  `facility_group` as fg
INNER JOIN
  `facility_type` as ft
ON
  fg.facility_type_id = ft.id
WHERE
  fg.facility_id = 1;
