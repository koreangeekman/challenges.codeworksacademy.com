<template>
  <section class="row">
    <div class="col-12">
      <h4>
        Moderations:
      </h4>
    </div>

    <div class="col-12" v-if="moderations.length === 0 && moderators.length == 0">
      <p>
        You don't moderate any challenges
      </p>
    </div>

    <div class="col-12" v-else>
      <section class="row">
        <div class="col-12">
          <p class="fs-5">
            My Active Moderations:
          </p>
        </div>
        <div class="col-12" v-for="moderation in moderations" :key="moderation.id">
          <div v-if="moderation.status == 'active'">
            <ChallengeCard :challenge="moderation.challenge" /><i @click="removeModeration(challenge.id)"
              class="mdi mdi-delete text-danger selectable"></i>
          </div>
        </div>
      </section>

      <div class="col-12">
        <p class="fs-5">
          Pending:
        </p>
        <div v-for="moderation in moderations" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId != account.id && moderation.status == 'pending'" />
        </div>
      </div>

      <div class="col-12">
        <div class="fs-4">Challenge Moderators</div>
        <p class="text-secondary">Active</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId == account.id && moderation.status == 'active'" />
        </div>
        <p class="text-secondary">Pending</p>
        <div v-for="moderation in moderators" :key="moderation.id">
          <ModerationCard :moderationProp="moderation"
            v-if="moderation.originId == account.id && moderation.status == 'pending'" />
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { computed } from 'vue'
import { AppState } from '../AppState'
import ModerationCard from './ModerationCard.vue'
import ChallengeCard from './ChallengesPage/ChallengeCard.vue'

export default {
  setup() {


    return {
      account: computed(() => AppState.AccountState.account),
      myChallenges: computed(() => AppState.AccountState.challenges),
      moderations: computed(() => {
        let moderators = AppState.ChallengeState.moderators
        let filterModerators = moderators.filter((m) => m.challenge.creatorId != AppState.AccountState.account.id)
        return filterModerators
      }),
      moderators: computed(() => {
        let moderators = AppState.ChallengeState.moderators
        let filterModerators = moderators.filter((m) => m.accountId != AppState.AccountState.account.id)
        return filterModerators
      }),

    };
  },
  components: { ModerationCard, ChallengeCard }
}
</script>


<style lang="scss" scoped></style>