import React, { createContext, useEffect, useState } from "react"
import { Facility } from '@types'

interface IFacilityContext {
  facilities: Facility[]
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>
  checked: boolean[]
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>
}

export const FacilityContext = createContext<IFacilityContext>({
  facilities: [],
  setFacilities: () => {},
  checked: [],
  setChecked: () => {}
})

export const FacilityProvider = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [checked, setChecked] = useState<boolean[]>([])

  return (
    <FacilityContext.Provider value={{ facilities, setFacilities, checked, setChecked }}>
      {children}
    </FacilityContext.Provider>
  )
}
