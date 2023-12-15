import { AppState } from "../AppState"
import { Profile } from "../models/Profile"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class ProfilesService {
  async getProfiles(name) {
    const res = await api.get(`api/profiles/?name=${name}`)
    logger.log('[RETRIEVED PROFILES]', res.data)
    AppState.profiles = res.data.map(p => new Profile(p))
  }
  async getProfile(profileId) {
    const res = await api.get(`api/profiles/${profileId}`)

    logger.log('[GOT PROFILE BY ID]', res.data)

    AppState.activeProfile = new Profile(res.data)
  }

  clearProfile() {
    AppState.activeProfile = null
    AppState.challenges = []
    AppState.moderations = []
    AppState.participants = []
  }

}

export const profilesService = new ProfilesService()