<template>
  <ul v-if="rewards.length > 0" class="reward-list">
    <RewardListItem
      v-for="reward in rewards"
      v-bind:key="reward._id"
      v-bind:reward="reward" 
      v-bind:user="user" 
    />
  </ul>
  <h2 v-else class="no-rewards text-center">No rewards yet!</h2>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";
import RewardListItem from "../components/RewardListItem.vue";

export default {
  name: "RewardList",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    RewardListItem,
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
      axios.get('/api/reward').then(res => {
        this.rewards = res.data.rewards;
      }).catch(err => {
        // Handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
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
