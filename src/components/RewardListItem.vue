<template>
  <li class="reward">
    <section class="reward-content">
      <h2 class="reward-title">
        {{ reward.reward_name }}
      </h2>
      <p class="reward-source">
        Sponsor: {{ reward.reward_source }}
      </p>
      <p class="reward-description">
        {{ reward.reward_description }}
      </p>
      <p class="reward-cost">
        <strong>Cost:</strong> {{ reward.kudos_value }} Kudos
      </p>
    </section>
    <RedeemButton v-if="user.user_name" v-bind:user="user" v-bind:reward="reward" />
  </li>
</template>

<script>
import RedeemButton from "../components/RedeemButton.vue";

export default {
  name: "RewardListItem",
  props: {
    reward: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    RedeemButton,
  },
};
</script>

<style scoped>
.reward {
  font-family: Arial, Helvetica, sans-serif;
  background: rgba(196, 196, 196, 0.5);
  border-radius: 8px;
  text-align: start;
  width: 100%;
  max-width: 40vw;
  margin: auto;
  margin-bottom: 16px;
  padding: 8px 16px;
}

.reward-title {
  margin-bottom: 0;
}

.reward-source {
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
