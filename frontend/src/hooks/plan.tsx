import { useContext } from 'react'
import { PlanContext, PlanSetContext } from '@contexts'
import { Plan } from '@types'
import { getAllPlans } from '@api'

export const usePlans = (): {
  plans: Plan[]
  initPlans: () => Promise<void>
} => {
  const plans = useContext(PlanContext)
  const setPlans = useContext(PlanSetContext)

  const initPlans = async () => {
    const p = await getAllPlans()
    setPlans(p)
  }

  return {
    plans,
    initPlans
  }
}