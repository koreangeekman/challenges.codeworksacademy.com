import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { Milestone } from "../models/Milestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class MilestonesService {

  async createMilestone(milestoneData) {
    const res = await api.post('api/milestones', milestoneData)
    logger.log(`[createMilestone]`, res.data)
    AppState.milestones.push(new Milestone(res.data))
  }
  async getMilestones() {
    const res = await api.get('api/milestones')
    logger.log('[getMilestones]', res.data)
    AppState.milestones = res.data.map(m => new Milestone(m))
    
    
  }
  async editMilestone(milestoneData) {
    const res = await api.put(`api/milestones/${milestoneData.id}`, milestoneData)
    logger.log('[editMilestone]', res.data)
    
  }
  async removeMilestone(milestoneId) {
    const res = await api.delete(`api/milestones/${milestoneId}`)
    const removeMilestone = AppState.milestones.findIndex(m => m.id == milestoneId)
    AppState.milestones.splice(removeMilestone)
  }

}

export const milestonesService = new MilestonesService()