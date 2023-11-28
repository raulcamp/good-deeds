<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to='/' class="navbar-brand text-info" aria-label="Go to home">GoodDeeds</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav ms-auto fs-5">
          <li class="nav-item">
            <router-link class="nav-link" :to="'/'" aria-label="Go to rewards page">
              Deeds
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="'/rewards'" aria-label="Go to rewards page">
              Rewards
            </router-link>
          </li>
          <li v-if="user.user_name" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="badge rounded-pill bg-info text-dark" v-b-tooltip.hover.bottom="'Kudos!'">
                <i class="fas fa-coins"></i>
                {{ user.user_kudos }}
              </span>
              {{ user.user_name }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link class="dropdown-item" :to="`/profile/${user.user_name}`" aria-label="Go to your profile page">
                  Profile
                </router-link>
              </li>
              <li><SignOut class="dropdown-item" v-if="user.user_name" v-bind:user="user" /></li>
            </ul>
          </li>
          <li v-else class="nav-item">
            <router-link to='/account' class="nav-link" aria-label="Go to sign up and sign out page">
              Sign Up/Sign In
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Vue from 'vue';
import SignOut from './SignOut.vue';
import { BTooltip } from 'bootstrap-vue'

Vue.component('Navbar', {
  components: { BTooltip },
  directives: { 'b-tooltip': BTooltip }
})

export default {
  name: "Navbar",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    SignOut,
  },
  methods: {
    goHome : function () {
        this.$router.push("/");
    },
  }
};
</script>

<style scoped>
.navbar {
  min-height: 10vh;
}

.navbar-brand {
  font-size: 2em;
  font-weight: 700;
}

.nav-item {
  font-size: 1.25em;
}
</style>