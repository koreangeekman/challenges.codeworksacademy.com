import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .get('/challenges', this.getMyChallenges)
      .put('', this.updateAccount)
      .get('/participations', this.getMyParticipations)
      .get('/rank', this.calculateAccountRank)
  }

  async getUserAccount(req, res, next) {
    try {
      await accountService.calculateAccountRank(req.userInfo)
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }

  async updateAccount(req, res, next) {
    try {
      const accountData = req.body
      const accountInfo = req.userInfo
      const account = await accountService.updateAccount(accountInfo, accountData)
      return res.send(account)
    } catch (error) {
      next(error);
    }
  }

  async getMyChallenges(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const challenges = await challengesService.getChallengesCreatedBy(accountId, accountId)
      res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getMyParticipations(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const answers = await participantsService.getMyParticipations(accountId)

      res.send(answers)
    } catch (error) {
      next(error)
    }
  }
  async calculateAccountRank(req, res, next) {
    try {
      const user = req.userInfo
      const rank = await accountService.calculateAccountRank(user)
      return res.send(rank)
    } catch (error) {
      next(error);
    }
  }
}
