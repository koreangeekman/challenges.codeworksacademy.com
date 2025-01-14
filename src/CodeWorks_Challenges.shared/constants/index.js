import * as data from './data.json'

export const SUBMISSION_TYPES = data.SUBMISSION_TYPES
export const CATEGORY_TYPES = data.CATEGORY_TYPES
export const STATUS_TYPES = data.STATUS_TYPES
export const MILESTONE_BADGE = data.MILESTONE_BADGE

export const RANK_BADGE = Object.values(data.RANK_BADGE).map(badge => {
  return {
    ...badge,
    color: data.COLOR_FILLS[badge.color]
  }
})

export const PROFILE_TITLES = data.RANK_BADGE
export const TITLE_BGS = data.TITLE_BGS
export const COLOR_FILLS = data.COLOR_FILLS
export const PROFILE_FIELDS = data.PROFILE_FIELDS