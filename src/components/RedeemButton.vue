<template>
  <button class="redeem-reward-btn" v-on:click="redeemReward">Redeem</button>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

export default {
  name: "RedeemButton",
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
  methods: {
    redeemReward: function () {
      axios
        .patch('/api/user/', {
          rewardID: this.reward._id,
        })
        .then((res) => {
          // Handle success
          eventBus.$emit("user-redeem-reward-success", res.data);
        })
        .catch((err) => {
          // Handle error
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit("error-message", errorMessage);
        });
    },
  }
};
</script>

<style scoped>
.redeem-reward-btn:hover {
  background: green;
  color: whitesmoke;
}
</style>
