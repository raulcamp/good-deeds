<template>
  <div id="app">
    <router-view v-bind:user="user" :key="$route.path"></router-view>
  </div>
</template>

<script>
import { eventBus } from './main';
import axios from 'axios';

export default {
  name: "app",
  components: {},
  data() {
    return {
      user: {
        _id: '',
        user_name: '',
      },
    };
  },
  methods: {
    getUser: function() {
      axios
      .get('/api/session')
      .then(res => {
        this.user = res.data.user;
      })
      .catch((err) => {
        // handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
  },
  created: function() {
    this.getUser();
    eventBus.$on('login-success', (user) => {
      this.user = user;
    });
    eventBus.$on('signout-success', () => {
      this.user = { _id: '', user_name: '' };
    });
    eventBus.$on('create-deed-success', (data) => {
      this.user.user_kudos = data.kudos;
    });
    eventBus.$on('delete-deed-success', (data) => {
      this.user.user_kudos = data.kudos;
    });
    eventBus.$on('edit-deed-details-success', (data) => {
      if (data.kudos !== undefined) {
        this.user.user_kudos = data.kudos;
      }
    });
    eventBus.$on('user-redeem-reward-success', (data) => {
      if (data.kudos !== undefined) {
        this.user.user_kudos = data.kudos;
      }
      if (data.userReward !== undefined) {
        const rewardObj = {
          reward: data.userReward._id,
          redeemed: false,
          redeem_date: Date.now(),
          expiry_date: Date.now() + 7*24*60*60*1000,
        };
        this.user.user_rewards.push(rewardObj);
      }
    });
  },
};
</script>