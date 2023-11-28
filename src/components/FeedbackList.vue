<template>
  <ul v-if="feedbacks.length > 0" class="feedback-list">
    <Feedback
      v-for="feedback in feedbacks"
      v-bind:key="feedback._id"
      v-bind:feedback="feedback"
      :user="user"
    />
  </ul>
  <h2 v-else class="no-deeds">No feedback yet!</h2>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import Feedback from './Feedback.vue';

export default {
  name: 'FeedbackList',
  props: {
    user: {
      type: Object,
      required: true,
    },
    // Flag to toggle between received and given feedback
    isReceived: {
      type: Boolean,
      required: true,
      default: true,
    }
  },  
  components: {
    Feedback,
  },
  data() {
    return {
      feedbacks: [],
    };
  },
  created: function() {
    this.isReceived ? this.getFeedbackByReceiver() : this.getFeedbackGiven();
    eventBus.$on('feed-list-refresh', this.getFeedback);
  },
  destroyed: function() {
    eventBus.$off('feedback-list-refresh', this.getFeedback);
  },
  methods: {
    getFeedbackByReceiver() {
      axios.get(`/api/feedback/?to=${this.user.user_name}`).then(res => {
        this.feedbacks = res.data.reverse();
      }).catch(err => {
        // Handle error
        let errorMessage = err.res.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.res.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
    getFeedbackGiven() {
      axios.get(`/api/feedback/?from=${this.user.user_name}`).then(res => {
        this.feedbacks = res.data.reverse();
      }).catch(err => {
        // Handle error
        let errorMessage = err.res.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.res.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    }
  },
};
</script>

<style>
.feedback-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 16px;
  width: 100%;
}

.no-deeds {
  margin-top: 16px;
}
</style>
