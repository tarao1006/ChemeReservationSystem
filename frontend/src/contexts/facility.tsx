import React, { createContext, useState } from "react"
import { Facility } from '@types'

interface IFacilityContext {
  facilities: Facility[]
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>
}

export const FacilityContext = createContext<IFacilityContext>({
  facilities: [],
  setFacilities: () => {}
})

export const FacilityProvider = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>([])

  return (
    <FacilityContext.Provider value={{ facilities, setFacilities }}>
      {children}
    </FacilityContext.Provider>
  )
}
