package service

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
	"github.com/tarao1006/ChemeReservationSystem/db"
	"github.com/tarao1006/ChemeReservationSystem/model"
	"github.com/tarao1006/ChemeReservationSystem/repository"
)

type ReservationService struct {
	db   *sqlx.DB
	repo *repository.ReservationRepository
}

func NewReservationService() *ReservationService {
	return &ReservationService{
		db:   db.GetDB(),
		repo: repository.NewReservationRepository(),
	}
}

func (rs *ReservationService) GetAll() ([]model.Reservation, error) {
	return rs.repo.GetAll(rs.db)
}

func (rs *ReservationService) GetByID(id int64) (*model.Reservation, error) {
	return rs.repo.FindByID(rs.db, id)
}

func (rs *ReservationService) Create(r *model.ReservationAPI) (*model.Reservation, error) {
	var id int64

	if err := db.TXHandler(rs.db, func(tx *sqlx.Tx) error {
		var (
			res sql.Result
			err error
		)
		res, err = rs.repo.Create(tx, &model.ReservationDTO{
			CreatorID: r.CreatorID,
			StartAt:   r.StartAt,
			EndAt:     r.EndAt,
			PlanID:    r.PlanID,
			PlanMemo:  r.PlanMemo,
		})
		if err != nil {
			return err
		}
		id, err = res.LastInsertId()
		if err != nil {
			return err
		}

		for _, userID := range r.UserIDs {
			_, err = rs.repo.AddUser(tx, id, userID)
			if err != nil {
				return err
			}
		}

		for _, facilityID := range r.FacilityIDs {
			_, err = rs.repo.AddFacility(tx, id, facilityID)
			if err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	newR, err := rs.repo.FindByID(rs.db, id)
	if err != nil {
		return nil, err
	}

	return newR, nil
}

func (rs *ReservationService) UpdateByID(id int64, r *model.ReservationAPI) (*model.Reservation, error) {
	reservaton, err := rs.repo.FindByID(rs.db, id)
	if err != nil {
		return nil, err
	}

	if err := db.TXHandler(rs.db, func(tx *sqlx.Tx) error {
		var err error
		if !r.StartAt.IsZero() {
			_, err = rs.repo.UpdateStartAtByID(tx, id, r.StartAt)
			if err != nil {
				return err
			}
		}
		if !r.EndAt.IsZero() {
			_, err = rs.repo.UpdateEndAtByID(tx, id, r.EndAt)
			if err != nil {
				return err
			}
		}
		if r.PlanID != 0 {
			_, err = rs.repo.UpdatePlanIDByID(tx, id, r.PlanID)
			if err != nil {
				return err
			}
		}
		if r.UpdatePlanMemo || r.PlanMemo != "" {
			_, err = rs.repo.UpdatePlanMemoByID(tx, id, r.PlanMemo)
			if err != nil {
				return err
			}
		}
		if len(r.UserIDs) != 0 {
			for _, user := range reservaton.Attendees {
				_, err = rs.repo.RemoveUser(tx, id, user.ID)
				if err != nil {
					return err
				}
			}
			for _, userID := range r.UserIDs {
				_, err = rs.repo.AddUser(tx, id, userID)
				if err != nil {
					return err
				}
			}
		}
		if len(r.FacilityIDs) != 0 {
			for _, facility := range reservaton.Facilities {
				_, err = rs.repo.RemoveFacility(tx, id, facility.ID)
				if err != nil {
					return err
				}
			}
			for _, facilityID := range r.FacilityIDs {
				_, err = rs.repo.AddFacility(tx, id, facilityID)
				if err != nil {
					return err
				}
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	newR, err := rs.repo.FindByID(rs.db, id)
	if err != nil {
		return nil, err
	}
	return newR, nil
}

func (rs *ReservationService) DeleteByID(id int64) error {
	if err := db.TXHandler(rs.db, func(tx *sqlx.Tx) error {
		var err error
		_, err = rs.repo.RemoveAllUsers(tx, id)
		if err != nil {
			return err
		}
		_, err = rs.repo.RemoveAllFacilities(tx, id)
		if err != nil {
			return err
		}
		_, err = rs.repo.Delete(tx, id)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
