<template>
  <section v-if="profileUser.user_name" class="main text-center">
    <Navbar :user="user"/>
    <Message/>
    <div class="profile-header">
      <i class="fas fa-user-circle"></i>
      <h1 class="profile-username">{{ profileUser.user_name }}</h1>
    </div>
    <div class="profile-contact-info">
      <i class="fas fa-phone-square-alt me-2"></i>
      <p class="my-0 me-4">{{ profileUser.user_phoneNumber }}</p>
      <i class="fas fa-envelope me-2"></i>
      <a :href="`mailto:${profileUser.user_email}`" target="_blank">{{ profileUser.user_email }}</a>
    </div>
    <h2 class="mt-3 mb-5">Kudos: {{ profileUser.user_kudos }}</h2>
    <ProfileTabs v-bind:profileUser="profileUser" v-bind:user="user"/>
    <section v-if="view === 'Feedback'" class="mt-3">
      <b-tabs pills align="center">
        <b-tab title="Feedback Received" active>
          <FeedbackList v-bind:user="profileUser" v-bind:isReceived="true"/>
        </b-tab>
        <b-tab title="Feedback Given">
          <FeedbackList v-bind:user="profileUser" v-bind:isReceived="false"/>
        </b-tab>
      </b-tabs>
    </section>
    <section v-else-if="view === 'Deeds'" class="deeds-tab mt-3">
      <b-tabs pills align="center">
        <b-tab title="Deeds Created" active>
          <DeedList
            v-bind:user="profileUser" 
            v-bind:requesterID="profileUser._id" 
            v-bind:forProfile="true" 
          />
        </b-tab>
        <b-tab title="Deeds Offered Help">
          <DeedList
            v-bind:user="profileUser" 
            v-bind:helperID="profileUser._id" 
            v-bind:forProfile="true"
          />
        </b-tab>
      </b-tabs>
    </section>
    <UserRewardList  v-else-if="view === 'Rewards'" v-bind:user="profileUser" />
  </section>
  <section v-else> 
    <Navbar :user="user"/>
    <Message/>
      <h1> SORRY, we could not find that user! </h1>
  </section>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { eventBus } from "../main";

import DeedList from "../components/DeedList.vue";
import FeedbackList from "../components/FeedbackList.vue"
import UserRewardList from "../components/UserRewardList.vue"
import Message from "../components/Message.vue";
import Navbar from "../components/Navbar.vue";
import ProfileTabs from "../components/ProfileTabs.vue";
import { BTabs } from 'bootstrap-vue'
Vue.component('b-tabs', BTabs)

export default {
   name: 'Profile',
   props: {
     user : {
       type: Object,
       required: true,
     }, 
   },
    data() {
      return {
        view: 'Feedback',
        profileUser: new Object(),
      };
    },
   components: {
     FeedbackList,
     Navbar,
     DeedList,
     UserRewardList, 
     Message,
     ProfileTabs,
   },
   created: function() {
     this.loadUser();
      eventBus.$on('get-feedback-feed', () => {
        this.view = 'Feedback';
      });
      eventBus.$on('get-deeds-feed', () => {
        this.view = 'Deeds';
      });
      eventBus.$on('get-rewards-feed', () => {
        this.view = 'Rewards';
      });
   },
   methods: {
     loadUser: function() {
        axios.get(`/api/user/${this.$route.params.username}`).then(res => {
          this.profileUser = res.data;
        }).catch(() => {
          this.$router.push('/*');
        });
     },
    },
}
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.fa-user-circle {
  margin-right: 16px;
  font-size: 3rem;
}

.profile-username {
  margin: 0;
}

.profile-contact-info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  font-size: 1.5rem;
}

#pills-tab {
  display: flex;
  justify-content: center;
  margin: 16px 0;
  font-weight: 500;
}
</style>