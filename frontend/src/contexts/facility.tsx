import React, { createContext, useEffect, useState } from "react"
import { Facility } from '@types'

interface IFacilityContext {
  facilities: Facility[]
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>
  checked: number[]
  setChecked: React.Dispatch<React.SetStateAction<number[]>>
}

export const FacilityContext = createContext<IFacilityContext>({
  facilities: [],
  setFacilities: () => {},
  checked: [],
  setChecked: () => {}
})

export const FacilityProvider = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [checked, setChecked] = useState<number[]>([])

  return (
    <FacilityContext.Provider value={{ facilities, setFacilities, checked, setChecked }}>
      {children}
    </FacilityContext.Provider>
  )
}
