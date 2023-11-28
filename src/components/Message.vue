<template>
    <div v-if="success" class="alert alert-success alert-dismissible fade show"  role="alert">
      <i class="fas fa-check-circle"></i>
      {{ success }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" v-on:click="clearMessage" aria-label="Close"></button>
    </div>
    <div v-else-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" v-on:click="clearMessage" aria-label="Close"></button>
    </div>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: 'Message',
  data() {
    return {
      success: "",
      error: "",
    };
  },
  created: function() {
    eventBus.$on('delete-deed-success', (res) => {
        this.success = res.message;
        this.error = "";
    });
    eventBus.$on('create-deed-success', (res) => {
        this.success = res.message; 
        this.error = "";
    });
    eventBus.$on('edit-deed-details-success', (res) => {
        this.success = res.message; 
        this.error = "";
    });
    eventBus.$on('user-redeem-reward-success', (res) => {
        this.success = res.message; 
        this.error = "";
    });
    eventBus.$on('error-message', (error) => { 
        this.success = "";
        this.error = error;
    });
  },
  methods: { 
    clearMessage : function() { 
      this.success = "";
      this.error = "";
    }
  }
};
</script>

<style>
</style>
