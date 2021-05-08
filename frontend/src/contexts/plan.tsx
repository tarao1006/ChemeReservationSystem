import React, { createContext, SetStateAction, useEffect, useState, Dispatch } from "react"
import { Plan } from '@types'

export const PlanContext = createContext<Plan[]>([])

export const PlanSetContext = createContext<Dispatch<SetStateAction<Plan[]>>>(() => {})


export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>([])

  return (
    <PlanContext.Provider value={plans}>
      <PlanSetContext.Provider value={setPlans}>
        {children}
      </PlanSetContext.Provider>
    </PlanContext.Provider>
  )
}
