<template>
  <div class="container-fluid">
    <section class="row">
      <div class="col-12 d-flex flex-column">
        <div>
          <div class="text-center mt-3 mb-5">
            <ModSearchForm />
          </div>
        </div>
      </div>
      <div v-if="moderators" class="col-12 d-flex justify-content-evenly">
        <div class="col-4 flex-column">
          <h5 class="text-light text-center mb-5" style="white-space: nowrap;">Active Challenge Moderators</h5>
          <div v-for="moderator in moderators" :key="moderator.id">
            <div v-if="moderator.status == 'active' || moderator.status == 'CodeWorks'" class="text-light">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
        </div>
        <span class="col-1 vertical-line"></span>
        <div class="col-4 flex-column">
          <h5 class="text-light text-center mb-5">Awaiting Confirmation</h5>
          <div v-for="moderator in moderators" :key="moderator.id">
            <div v-if="moderator.status == 'pending'">
              <ChallengeModeratorCard :moderator="moderator" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        No Moderators
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue';
import ModSearchForm from '../components/Forms/ModSearchForm.vue';

import { AppState } from '../AppState';
import ChallengeModeratorCard from '../components/ChallengeModeratorCard.vue';

export default {
  setup() {

    return {
      moderators: computed(() => AppState.ChallengeState.moderators)
    };
  },
  components: { ModSearchForm, ChallengeModeratorCard }
}
</script>

<style scoped lang="scss">
.vertical-line {
  width: 5px;
  height: 100%;
  background-color: #77777733;
}
</style>