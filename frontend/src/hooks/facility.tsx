import { useContext } from 'react'
import { FacilitiesContext, FacilitiesDispatchContext } from '@contexts'
import { Facility } from '@types'
import { getAllFacilities } from '@api'
import { actions } from '../reducer/facility'

export const useFacilities = (): {
  facilities: Facility[]
  checked: number[]
  initFacilities: () => Promise<void>
  addCheck: (id: number) => void
  deleteCheck: (id: number) => void
} => {
  const { facilities, checked } = useContext(FacilitiesContext)
  const dispatch = useContext(FacilitiesDispatchContext)

  const initFacilities = async () => {
    const f = await getAllFacilities()
    dispatch(actions.initFacilityAction(f))
  }

  const addCheck = (id: number) => {
    dispatch(actions.addCheckAction(id))
  }

  const deleteCheck = (id: number) => {
    dispatch(actions.deleteCheckAction(id))
  }

  return {
    facilities,
    checked,
    initFacilities,
    addCheck,
    deleteCheck
  }
}
