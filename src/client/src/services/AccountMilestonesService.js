import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class AccountMilestonesService {

  async checkMilestonesByUserId(userId, checks) { //STUB Kyle -- this is a post because a get can't carry a payload and it creates one if it isn't already there~~
    const res = await api.post(`api/accountMilestones/${userId}`, checks)
    logger.log('[MY MILESTONE CHECK]', res.data)
    AppState.AccountState.milestones = res.data.map(m => new AccountMilestone(m))
    return res.data
  }
  async checkMyMilestones(checks) { //STUB Kyle -- this is a post because a get can't carry a payload and it creates one if it isn't already there~~
    const res = await api.post(`account/accountMilestones`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
    AppState.AccountState.milestones = res.data.map(m => new AccountMilestone(m))
    return res.data
  }

  async getAccountMilestonesByUserId(userId) {
    const res = await api.get(`api/accountMilestones/${userId}`)
    logger.log('[getAccountMilestones]', res.data)
    AppState.AccountState.milestones = res.data.map(m => new AccountMilestone(m))
    return res.data
  }

  async claimMilestone(accountMilestone) {
    const res = await api.put(`account/${accountMilestone.id}/accountMilestones`)
    logger.log('[claimMilestone]', res.data)
    const updateMilestone = AppState.AccountState.milestones.find(m => m.id == accountMilestone.id)
    logger.log('[APPSTATE MY MILESTONES]', AppState.AccountState.milestones, '[UPDATE MILESTONE]', updateMilestone)
    updateMilestone.claimed = true
  }
}

export const accountMilestonesService = new AccountMilestonesService()
