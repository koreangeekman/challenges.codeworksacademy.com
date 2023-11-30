import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"
import { PROFILE_FIELDS } from '../constants'

/**
 * @param {any} body
 */

function sanitizeBody(body) {
	const writable = {
		status: body.status,
		submission: body.submission,
		requirements: body.requirements,
	}
	return writable
}

class ParticipantsService {
	async getChallengeRewards(accountId) {
		const rewards = await dbContext.ChallengeParticipants.find({ accountId, status: 'completed' })
			.populate('challenge', 'name badgeImg')
			// .select('-submission')
		return rewards
	}

	async joinChallenge(newParticipant) {

		const challenge = await challengesService.getChallengeById(newParticipant.challengeId)

		if (challenge.status != 'published') {
			throw new BadRequest(`[CHALLENGE_STATUS::${challenge.status}] This challenge cannot be joined at this time.`)
		}
		// TODO - 🛑 Copy challenge requirements to participant - Note from Jake
		newParticipant.requirements = challenge.requirements.map(r => {return {
			description: r,
		}})
		const participant = await dbContext.ChallengeParticipants.create(newParticipant)

		return participant
	}

	async getParticipantById(participantId) {
		const participant = await dbContext.ChallengeParticipants.findById(participantId).populate({
			path: 'challenge',
			populate: { path: 'creator requirements participantCount' }
		}).populate('profile', 'name picture')
		return participant
	}

	async getParticipantsByChallengeId(challengeId) {
		const participants = await dbContext.ChallengeParticipants.find({ challengeId })
			.populate({
				path: 'challenge',
				populate: { path: 'creator requirements participantCount' }
			}).populate('profile', PROFILE_FIELDS)
			// .select('-submission')
		return participants
	}

	async getMyParticipations(accountId) {
		const participants = await dbContext.ChallengeParticipants.find({ accountId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		}).populate('profile', PROFILE_FIELDS)
		return participants
	}

	async updateChallengeParticipant(participantId, userId, newSubmission) {
		const update = sanitizeBody(newSubmission)
		// TODO [🚧 Kyle] moderator check
		const participant = await dbContext.ChallengeParticipants.findOneAndUpdate
		(
			{ _id: participantId },
			{ $set: update },
			{ runValidators: true, setDefaultsOnInsert: true, new: true }
		)
		if (!participant) {
			throw new BadRequest('Invalid participant ID.')
		}
		return participant
	}

	async gradeChallenge(submission, graderAccountId) {
		// TODO write this, ensure grader is creator or moderator
	}

	async acknowledgeReward(id, accountId) {
		// TODO write this
		const participant = await dbContext.ChallengeParticipants.findOne({ _id: id, accountId })
		if (!participant || participant.status != 'completed' || participant.claimedAt) {
			throw new BadRequest('Unable to claim badge')
		}
		participant.claimedAt = new Date()
		await participant.save()
		return participant
	}

	async leaveChallenge(participantId, userId) {
		const participantToRemove = await dbContext.ChallengeParticipants.findById(participantId)
		const participantStatus = participantToRemove.status

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

	async removeParticipant(challengeId, userId, newParticipant) {
		const challenge = await challengesService.getChallengeById(challengeId)

		const participantToRemove = await dbContext.ChallengeParticipants.findById(newParticipant.id)

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