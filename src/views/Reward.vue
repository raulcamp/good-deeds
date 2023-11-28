<template>
  <div class="text-center">
    <Navbar v-bind:user="user"/>
    <Message/>
    <h1 class="rewards-title">Kudos Rewards</h1>
    <RewardList v-bind:user="user" />
  </div>
</template>

<script>
import Message from "../components/Message.vue";
import Navbar from "../components/Navbar.vue";
import RewardList from "../components/RewardList.vue";

export default {
  name: "Reward",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    Message,
    Navbar,
    RewardList,
  },
};
</script>

<style scoped>
.rewards-title {
  margin-top: 8px;
}
</style>
