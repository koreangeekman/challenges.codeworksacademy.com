import { api } from './AxiosService'
import { AppState } from "../AppState"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { logger } from './../utils/Logger';

class ParticipantsService {

  async getParticipantById(participantId) {
    const res = await api.get(`api/participants/${participantId}`)
    logger.log('[GETTING PARTICIPANT BY ID]', res.data)
    AppState.activeParticipant = res.data
  }

  async joinChallenge(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    logger.log('New participant:', res.data)
    AppState.participants.push(new ChallengeParticipant(res.data))
  }

  async updateChallengeParticipant(participantId, newSubmission) {
    const res = await api.put(`api/participants/${participantId}`, newSubmission)
    logger.log('Participant Updated ⏩', res.data)
    AppState.activeParticipant = res.data
    return res.data
  }

  async gradeChallengeParticipant(newGrade) {
    const res = await api.put(`api/moderators/${newGrade.participantId}/grade`, newGrade)
    logger.log('Participant Updated ⏩', res.data)
    AppState.activeParticipant = res.data
    return res.data
  }

  async leaveChallenge(participantId) {
    const res = await api.delete(`api/participants/${participantId}`)
    logger.log('Deleted participant:', res.data)
    let participantToRemove = AppState.participants.findIndex(p => p.id === participantId)
    AppState.participants.splice(participantToRemove, 1)
    return res.data
  }

  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.participants = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[Participants in this challenge]:', AppState.participants)
  }

  async getParticipationsByUserId(userId){
    const res = await api.get(`api/profiles/${userId}/participants`)

    logger.log('[GETTING PARTICIPATIONS BY USER ID', res.data)

    AppState.participants = res.data.map(p => new ChallengeParticipant(p))
  }
}

export const participantsService = new ParticipantsService()