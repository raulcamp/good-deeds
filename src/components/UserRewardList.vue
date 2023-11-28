<template>
  <ul v-if="rewards.length > 0" class="reward-list">
    <UserRewardListItem
      v-for="userReward in rewards"
      v-bind:key="userReward._id"
      v-bind:userReward="userReward" 
      v-bind:user="user" 
    />
  </ul>
  <h2 v-else class="no-rewards text-center">No rewards yet!</h2>
</template>

<script>
import UserRewardListItem from "../components/UserRewardListItem.vue";

export default {
  name: "UserRewardList",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    UserRewardListItem,
  },
  data() {
    return {
      rewards: [],
    };
  },
  created: function() {
    this.getRewards();
  },
  methods: {
    getRewards() {
        this.rewards = this.user.user_rewards;
    },
  },
};
</script>

<style scoped>
.reward-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin-top: 16px;
  padding: 16px;
  width: 100%;
}

.no-rewards {
  margin-top: 16px;
}
</style>
