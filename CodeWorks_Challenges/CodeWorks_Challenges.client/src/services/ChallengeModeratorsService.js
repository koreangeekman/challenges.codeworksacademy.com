import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { ChallengeModerator } from "../models/ChallengeModerator"
class ChallengeModeratorsService {

  async createModeration(moderatorData) {
    const res = await api.post('api/moderators', moderatorData)
    logger.log('[New moderation]:', res.data)
    AppState.moderators.push(new ChallengeModerator(res.data))
  }

  async createOwnedChallengeModeration(moderatorData) {
    const res = await api.post('api/moderators/account', moderatorData)
    logger.log('[New moderation]:', res.data)
    AppState.moderators.push(new ChallengeModerator(res.data))
  }

  async getModerationsByProfileId(userId) {
    const res = await api.get(`api/moderators/${userId}/profiles`)
    logger.log('[GETTING PROFILE MODERATIONS]', res.data)
    AppState.moderations = res.data.map(m => new ChallengeModerator(m))
  }

  async getModeratorsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/moderators`)
    AppState.moderators = res.data.map(m => new ChallengeModerator(m))
    logger.log('[Moderators in this challenge]:', AppState.moderators)
  }

  async getModerationsByChallengeCreatorId(userId) {
    const res = await api.get(`api/moderators/challenges/${userId}`)
    logger.log('[MODERATIONS BY CHALLENGEID]', res.data)
    AppState.moderators = res.data.map(m => new ChallengeModerator(m))
  }

  async approveModeration(moderationId) {
    const res = await api.put(`api/moderators/${moderationId}`)
    logger.log('[Approved moderation]:', res.data)
    let moderatorToEdit = AppState.moderators.find(m => m.id == res.data.id)
    if (moderatorToEdit)
      moderatorToEdit.status = true
    let myModeratorToEdit = AppState.moderations.find(m => m.id == res.data.id)
    if (myModeratorToEdit)
      myModeratorToEdit.status = true
  }

  async removeModeration(moderationId) {
    const res = await api.delete(`api/moderators/${moderationId}`)
    logger.log('Deleted [moderation]:', res.data)
    // Remove moderation from challenge render
    let moderatorToRemove = AppState.moderators.findIndex(m => m.id == moderationId)
    if (moderatorToRemove != -1) {
      AppState.moderators.splice(moderatorToRemove, 1)
    }    // Remove moderation from account data render
    let myModerationToRemove = AppState.moderations.findIndex(m => m.id == moderationId)
    // logger.log('[MY MOD REMOVAL]', moderationId, myModerationToRemove, AppState.myModerations)
    if (myModerationToRemove != -1) {
      AppState.moderations.splice(myModerationToRemove, 1)
    }
  }
}

export const challengeModeratorsService = new ChallengeModeratorsService()