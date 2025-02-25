<template>
  <section class="bg-detail p-3 mx-3 rounded-3" v-if="challengeCreator">
    <div class="">
      <div class="col-lg-8" v-if="challenge">
        <h2>Grading</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 accordion accordion-flush">
        <h3 class="text-warning">Needs Grading</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'submitted' && challengeCreator">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || profile.name }}</span>
              </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 accordion accordion-flush">
        <h3 class="text-info">Started</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'started' && challengeCreator">
            <h2 class="accordion-header bg-dark text-light">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || profile.name }}</span>
              </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body bg-dark">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-12 accordion accordion-flush">
        <h3 class="text-success">Complete</h3>
        <div v-for="p in participants" :key="p.id" class="accordion-item">
          <div v-if="p.status === 'completed' && challengeCreator" class="bg-detail rounded-bottom">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + p.id" aria-expanded="false" :aria-controls="'collapse' + p.id">
                <span>{{ p.profile.nickname || profile.name }}</span>
              </button>
            </h2>
            <div :id="'collapse' + p.id" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body text-light">
                <GradeSubmissionForm :participant="p" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script>
import GradeSubmissionForm from '../components/Forms/GradeSubmissionForm.vue'
import { computed, ref, watchEffect } from 'vue'
import { AppState } from '../AppState'
import { StrDifficultyNum } from '../utils/StrDifficultyNum'
import { newChallengeParticipant } from '../utils/NewChallengeParticipant'

export default {
  components: {
    GradeSubmissionForm,
  },
  setup() {
    const filterBy = ref('')
    const editable = computed(() =>
      newChallengeParticipant({ state: AppState }, filterBy.value)
    )

    function isModeratorStatus() {
      const isMod = AppState.ChallengeState.moderators.find(m => m.accountId == AppState.AccountState.account.id)
      if (isMod) {
        if (isMod.status == false) {
          return 'pending'
        } else return 'approved'
      } else return 'null'
    }

    const participant = computed(() => {
      return AppState.ChallengeState.participants.find(p => p.accountId === AppState.AccountState.account.id)
    })

    watchEffect(() => {
      editable.value.status = participant.value?.status
    })

    return {
      filterBy,
      editable,
      participant,
      profile: computed(() => AppState.ProfileState.profile),
      user: computed(() => AppState.user),
      challenge: computed(() => AppState.ChallengeState.challenge),
      myModerations: computed(() => AppState.ChallengeState.moderators.filter(m => m.accountId === AppState.AccountState.account.id)),
      challengeCreator: computed(() => AppState.user.id === AppState.ChallengeState.challenge?.creatorId),
      isModeratorStatus,
      difficulty: computed(() => StrDifficultyNum(AppState.ChallengeState.challenge.difficulty)),
      participants: computed(() => AppState.ChallengeState.participants),
      isParticipant: computed(() => {
        return AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id)
      }),
      participantFilter: computed(() => {
        if (!filterBy.value) {
          return AppState.ChallengeState.participants
        } else {
          return AppState.ChallengeState.participants.filter(p => p.status === filterBy.value)
        }
      }),
    }
  }
}
</script>

<style scoped lang="scss">

.profile-picture-small {
  height: 60px;
  width: 60px;
}

.bg-detail{
    background-color: #1c2332;
    border: 1px solid #2d386b;
}

</style>