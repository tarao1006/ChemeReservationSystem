import React, { createContext, useEffect, useState } from "react"
import { Plan } from '@types'

interface IPlanContext {
  plans: Plan[]
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>
}

export const PlanContext = createContext<IPlanContext>({
  plans: [],
  setPlans: () => {}
})

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState<Plan[]>([])

  return (
    <PlanContext.Provider value={{ plans, setPlans }}>
      {children}
    </PlanContext.Provider>
  )
}
