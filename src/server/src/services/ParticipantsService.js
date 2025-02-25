import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"
import { PROFILE_FIELDS, STATUS_TYPES } from '../constants'
import { accountService } from "./AccountService.js"

const EXPERIENCE_SCALE = {
	1: 10,
	2: 50,
	3: 250,
	4: 500,
	5: 1000
}

class ParticipantsService {

	async getLeaderboards() {
		const accounts = await dbContext.Account.find().select(PROFILE_FIELDS).populate('badges')
		return accounts
	}

	async joinChallenge(newParticipant) {

		const challenge = await challengesService.getChallengeById(newParticipant.challengeId)

		if (challenge.status != STATUS_TYPES.PUBLISHED) {
			throw new BadRequest(`[CHALLENGE_STATUS::${challenge.status}] This challenge cannot be joined at this time.`)
		}

		newParticipant.requirements = challenge.requirements.map(r => {
			return {
				description: r,
				isCompleted: false
			}
		})
		const participant = await dbContext.ChallengeParticipants.create(newParticipant)

		return participant
	}

	async getParticipantById(participantId) {
		const participant = await dbContext.ChallengeParticipants.findById(participantId)
		if (!participant) {
			throw new BadRequest('Invalid participant ID.')
		}
		return participant
	}

	// I already know what the challenge is so no need to populate the challenge 
	async getParticipantsByChallengeId(challengeId) {
		const participants = await dbContext.ChallengeParticipants.find({ challengeId })
			.select('-requirements -submission -grade')
			.populate('profile', PROFILE_FIELDS)

		return participants
	}

	// I know who I am looking for so no need to populate the profile
	async getParticipationByUserId(userId) {
		const participation = await dbContext.ChallengeParticipants.find({ accountId: userId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		})
		return participation
	}

	// This method is used to give the experience of a challenge to a userId
	// Triggered by grading or autoGrade
	async awardExperience(participant) {
		let challenge = participant.challenge
		if (!challenge) {
			challenge = await challengesService.getChallengeById(participant.challengeId)
		}
		participant.xp += EXPERIENCE_SCALE[challenge.difficulty]
		await participant.save()
		await accountService.calculateAccountRank({ id: participant.accountId })
	}

	async leaveChallenge(participantId, userId) {
		const participantToRemove = await dbContext.ChallengeParticipants.findById(participantId)

		if (!participantToRemove) {
			throw new BadRequest("Invalid participant ID.")
		}

		if (userId != participantToRemove.accountId) {
			throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this participant's. You may not remove other participants.")
		}

		participantToRemove.status = 'left'

		await participantToRemove.remove()

		return participantToRemove
	}

	async removeParticipant(challengeId, userId, participant) {
		const challenge = await challengesService.getChallengeById(challengeId)

		const participantToRemove = await dbContext.ChallengeParticipants.findById(participant.id)

		if (!challenge) {
			throw new BadRequest('Invalid challenge ID.')
		}

		if (!participantToRemove) {
			throw new BadRequest('Invalid participant ID.')
		}

		if (userId != challenge.creatorId) {
			throw new Forbidden(`[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}. You may not remove participants from it.`)
		}

		await participantToRemove.remove()

		return participantToRemove
	}
}

export const participantsService = new ParticipantsService()