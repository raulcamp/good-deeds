<template>
  <span v-if="deed.deed_helpers.length === 0" class="ms-2">
    No helpers
  </span>
  <ul v-else class="deed-helpers">
    <li class="deed-helper mx-1" v-for="helper in deed.deed_helpers" v-bind:key="helper._id">
      <i v-if="isRequester && !pastDeadline" class="fas fa-minus-circle" v-on:click="removeHelper(helper)"></i>
      <router-link :to="`/profile/${helper.user_name}`" :aria-label="`Go to ${helper.user_name}'s profile`">
        {{ helper.user_name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

export default {
  name: "DeedHelpers",
  props: {
    user: {
      type: Object,
      required: true,
    },
    deed: {
      type: Object,
      required: true,
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    isRequester: function() {
      return this.user._id === this.deed.deed_requester._id;
    },
    pastDeadline: function () {
      const currDate = new Date();
      const deedDate = new Date(this.deed.deed_date);
      return currDate.getTime() > deedDate.getTime();
    }
  },
  methods: {
    removeHelper : function (helper) {
      axios.patch(`/api/deeds/${this.deed._id}`, { removeHelper: helper })
        .then(res => {
          // Handle success
          eventBus.$emit("remove-deed-helper-success", {
            message: res.data.message, 
            deed: res.data.deed,
            helper: helper,
          });
        })
        .catch(err => {
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
.deed-helpers {
  display: inline-flex;
  align-items: center;
  list-style: none;
  padding: 0;
}

.deed-helper {
  display: inline-flex;
  align-items: center;
}

.fa-minus-circle {
  cursor: pointer;
  font-size: 1.25em;
  color: rgba(255, 0, 0, 0.555);
  margin-right: 4px;
}

.fa-minus-circle:hover {
  color: rgba(255, 0, 0);
}
</style>
