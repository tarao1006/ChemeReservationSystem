package repository

import (
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/model"
)

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (ur *UserRepository) GetAll(db *sqlx.DB) ([]model.User, error) {
	users := []model.UserDTOWithType{}
	if err := db.Select(&users, `
		SELECT
			u.id, u.name, u.name_ruby, u.password_digest, u.email_address, ut.id as type_id, ut.name as type_name
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
		ORDER BY u.id`); err != nil {
		return nil, err
	}

	res := []model.User{}

	userIDs := []string{}
	mapTypes := map[string][]model.UserType{}
	mapUser := map[string]*model.User{}

	for _, user := range users {
		mapTypes[user.ID] = append(mapTypes[user.ID], model.UserType{
			ID:   user.TypeID,
			Name: user.TypeName,
		})
		if _, ok := mapUser[user.ID]; !ok {
			userIDs = append(userIDs, user.ID)
			mapUser[user.ID] = &model.User{
				ID:           user.ID,
				Name:         user.Name,
				NameRuby:     user.NameRuby,
				EmailAddress: user.EmailAddress,
				Types:        []model.UserType{},
			}
		}
	}

	for _, id := range userIDs {
		mapUser[id].Types = mapTypes[id]
	}

	for _, v := range mapUser {
		res = append(res, *v)
	}

	return res, nil
}

func (UserRepository) FindByID(db *sqlx.DB, id string) (*model.User, error) {
	users := []model.UserDTOWithType{}
	if err := db.Select(&users, `
		SELECT
			u.id, u.name, u.name_ruby, u.password_digest, u.email_address, ut.id as type_id, ut.name as type_name
		FROM
			user as u
		INNER JOIN
			user_group as ug
		ON
			ug.user_id = u.id
		INNER JOIN
			user_type as ut
		ON
			ug.user_type_id = ut.id
		WHERE u.id = ?
	`, id); err != nil {
		return nil, err
	}

	types := []model.UserType{}
	for _, user := range users {
		types = append(types, model.UserType{
			ID:   user.TypeID,
			Name: user.TypeName,
		})
	}

	return &model.User{
		ID:           users[0].ID,
		Name:         users[0].Name,
		NameRuby:     users[0].NameRuby,
		EmailAddress: users[0].EmailAddress,
		Types:        types,
	}, nil
}

func (UserRepository) FindDTOByID(db *sqlx.DB, id string) (*model.UserDTO, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address FROM user WHERE id = ?
	`, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}

func (UserRepository) FindDTOByEmailAddress(db *sqlx.DB, e string) (*model.UserDTO, error) {
	var user model.UserDTO
	if err := db.Get(&user, `
		SELECT id, name, name_ruby, password_digest, email_address FROM user WHERE email_address = ?
	`, e); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrUserNotFound
		}
		return nil, err
	}

	return &user, nil
}

func (UserRepository) CountUser(db *sqlx.DB, id string) (int, error) {
	var c int
	if err := db.Get(&c, `
		SELECT COUNT(*) FROM user WHERE id = ?
	`, id); err != nil {
		return 0, err
	}

	return c, nil
}

func (UserRepository) GetRememberMeTokenByID(db *sqlx.DB, id string) ([]byte, error) {
	var token []byte
	if err := db.Get(&token, `
		SELECT remember_me_token FROM user WHERE id = ?
	`, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrInvalidID
		}
		return nil, err
	}

	return token, nil
}

func (UserRepository) Create(db *sqlx.Tx, param *model.UserDTO) (result sql.Result, err error) {
	query := `INSERT INTO user (id, name, name_ruby, password_digest, email_address) VALUES (?, ?, ?, ?, ?)`
	return db.Exec(query, param.ID, param.Name, param.NameRuby, param.PasswordDigest, param.EmailAddress)
}

func (UserRepository) UpdateNameByID(db *sqlx.Tx, id string, n string) (result sql.Result, err error) {
	query := `UPDATE user SET name = ? WHERE id = ?`
	return db.Exec(query, n, id)
}

func (UserRepository) UpdateNameRubyByID(db *sqlx.Tx, id string, n string) (result sql.Result, err error) {
	query := `UPDATE user SET name_ruby = ? WHERE id = ?`
	return db.Exec(query, n, id)
}

func (UserRepository) UpdateEmailAddressByID(db *sqlx.Tx, id string, e string) (result sql.Result, err error) {
	query := `UPDATE user SET email_address = ? WHERE id = ?`
	return db.Exec(query, e, id)
}

func (UserRepository) UpdatePasswordDigestByID(db *sqlx.Tx, id string, p []byte) (result sql.Result, err error) {
	query := `UPDATE user SET password_digest = ? WHERE id = ?`
	return db.Exec(query, p, id)
}

func (UserRepository) Delete(db *sqlx.Tx, id string) (result sql.Result, err error) {
	query := `DELETE FROM user WHERE id = ?`
	return db.Exec(query, id)
}

func (UserRepository) AddGroup(db *sqlx.Tx, userID string, userTypeID int64) (result sql.Result, err error) {
	query := `INSERT INTO user_group (user_id, user_type_id) VALUES (?, ?)`
	return db.Exec(query, userID, userTypeID)
}

func (UserRepository) RemoveGroup(db *sqlx.Tx, userID string, userTypeID int64) (result sql.Result, err error) {
	query := `DELETE FROM user_group WHERE user_id = ? AND user_type_id = ?`
	return db.Exec(query, userID, userTypeID)
}

func (UserRepository) RemoveAllGroups(db *sqlx.Tx, userID string) (result sql.Result, err error) {
	query := `DELETE FROM user_group WHERE user_id = ?`
	return db.Exec(query, userID)
}
