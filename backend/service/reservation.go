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

func (rs *ReservationService) GetAllInRange(r *model.DateRange) ([]model.Reservation, error) {
	return rs.repo.GetAllInRange(rs.db, r)
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
	reservaton, err := rs.repo.FindDTOWithStructSliceByID(rs.db, id)
	if err != nil {
		return nil, err
	}

	if err := db.TXHandler(rs.db, func(tx *sqlx.Tx) error {
		if _, err := rs.repo.Update(tx, id, &model.ReservationDTO{
			CreatorID: r.CreatorID,
			StartAt:   r.StartAt,
			EndAt:     r.EndAt,
			PlanID:    r.PlanID,
			PlanMemo:  r.PlanMemo,
		}); err != nil {
			return err
		}

		var userIDAddSet = []string{}
		var userIDRemoveSet = []string{}
		var userIDIntersection = []string{}

		if len(r.UserIDs) != 0 && len(reservaton.UserIDs) != 0 {
			for _, u := range r.UserIDs {
				for _, v := range reservaton.UserIDs {
					if u == v {
						userIDIntersection = append(userIDIntersection, u)
					}
				}
			}
		}

		for _, u := range r.UserIDs {
			isSame := false
			for _, v := range userIDIntersection {
				if u == v {
					isSame = true
					break
				}
			}
			if !isSame {
				userIDAddSet = append(userIDAddSet, u)
			}
		}

		for _, u := range reservaton.UserIDs {
			isSame := false
			for _, v := range userIDIntersection {
				if u == v {
					isSame = true
					break
				}
			}
			if !isSame {
				userIDRemoveSet = append(userIDRemoveSet, u)
			}
		}

		var facilityIDAddSet = []int64{}
		var facilityIDRemoveSet = []int64{}
		var facilityIDIntersection = []int64{}

		if len(r.FacilityIDs) != 0 && len(reservaton.FacilityIDs) != 0 {
			for _, u := range r.FacilityIDs {
				for _, v := range reservaton.FacilityIDs {
					if u == v {
						facilityIDIntersection = append(facilityIDIntersection, u)
					}
				}
			}
		}

		for _, u := range r.FacilityIDs {
			isSame := false
			for _, v := range facilityIDIntersection {
				if u == v {
					isSame = true
					break
				}
			}
			if !isSame {
				facilityIDAddSet = append(facilityIDAddSet, u)
			}
		}

		for _, u := range reservaton.FacilityIDs {
			isSame := false
			for _, v := range facilityIDIntersection {
				if u == v {
					isSame = true
					break
				}
			}
			if !isSame {
				facilityIDRemoveSet = append(facilityIDRemoveSet, u)
			}
		}

		for _, userID := range userIDAddSet {
			if _, err := rs.repo.AddUser(tx, id, userID); err != nil {
				return err
			}
		}

		for _, userID := range userIDRemoveSet {
			if _, err := rs.repo.RemoveUser(tx, id, userID); err != nil {
				return err
			}
		}

		for _, facilityID := range facilityIDAddSet {
			if _, err := rs.repo.AddFacility(tx, id, facilityID); err != nil {
				return err
			}
		}

		for _, facilityID := range facilityIDRemoveSet {
			if _, err := rs.repo.RemoveFacility(tx, id, facilityID); err != nil {
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
