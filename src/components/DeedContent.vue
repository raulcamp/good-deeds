<template>
  <UpdateDeed 
    v-if="isEditing && canEdit"
    v-bind:deed="this.deed"
    v-bind:isEditing="this.isEditing"
  />
  <section v-else class="deed-content">
    <section class="deed-header">
      <div class="deed-status-title">
        <span v-if="deed.deed_completed" class="deed-status badge rounded-pill bg-success">
          Completed
        </span>
        <span v-else-if="gaveFeedback" class="deed-status badge rounded-pill bg-warning text-dark">
          Pending
        </span>
        <h2 class="deed-title">
          {{ deed.deed_title }}
        </h2>
      </div>
      <div v-if="user._id === deed.deed_requester._id" class="deed-header-actions">
        <DeleteButton 
          v-if="canEdit && !isEditing" 
          v-bind:deed_id="this.deed._id"
        />
        <UpdateButton
          v-if="canEdit" 
          v-bind:deed="this.deed"
          v-bind:isEditing="this.isEditing"
        />
      </div>
    </section>
    <section class="deed-body">
      <div class="deed-users">
        <p class="deed-requester">
          <b>Requested By:</b> <router-link :to="`/profile/${deed.deed_requester.user_name}`" :aria-label="`Go to ${deed.deed_requester.user_name}'s profile`">
            {{ deed.deed_requester.user_name }}
          </router-link>
        </p>
        <p>
          <b class="d-inline-block">Helper(s):</b>
          <DeedHelpers
            v-bind:user="user"
            v-bind:deed="deed"
          />
        </p>
      </div>
      <div class="deed-details">
        <p class="deed-location">
          <b>Location:</b> {{ deed.deed_location }}
        </p>
        <p class="deed-date-time">
          <b>Date & Time:</b> {{ formattedDateTime }}
        </p>
        <div class="deed-difficulty-kudos">
          <!-- color of difficulty label depends on difficulty -->
          <label v-bind:class="difficultyTagClass" v-b-tooltip.hover.left="'Deed Difficulty'">
            {{ deed.deed_difficulty }}
          </label>
          <p class="deed-kudos">
            <b>Kudos:</b> {{ deed.deed_kudos }} per helper
          </p>
          <p class="deed-estimated">
            <b>Estimated Hours:</b> {{ deed.deed_estimatedHours }}
          </p>
        </div>
        <p class="deed-description">
          <b>Description:</b> {{ deed.deed_description }}
        </p>
        <p class="deed-helpers-remaining">
          <b>Helpers Remaining:</b> {{ remainingHelpers }}
        </p>
      </div>
    </section>
  </section>
</template>

<script>
import Vue from 'vue';
import DeleteButton from "./DeleteButton.vue";
import DeedHelpers from "./DeedHelpers.vue";
import UpdateButton from "./UpdateButton.vue";
import UpdateDeed from "./UpdateDeed.vue";
import { BTooltip } from 'bootstrap-vue'

Vue.component('DeedContent', {
  components: { BTooltip },
  directives: { 'b-tooltip': BTooltip }
})

export default {
  name: "DeedContent",
  components: {
    DeleteButton,
    DeedHelpers,
    UpdateButton,
    UpdateDeed,
  },
  props: {
    deed: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return { 
      helpers: [],
    };
  },
  computed: {
    formattedDateTime: function() {
      const deedDateTime = new Date(this.deed.deed_date);
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(deedDateTime);
    },
    remainingHelpers: function() {
      return this.deed.deed_helpersNeeded - this.deed.deed_helpers.length;
    },
    canEdit: function() {
      const isRequester = this.user._id === this.deed.deed_requester._id;
      const noHelpers = this.deed.deed_helpers.length === 0;
      return isRequester && noHelpers;
    },
    gaveFeedback: function () {
      return this.deed.deed_givenFeedback.includes(this.user._id);
    },
    difficultyColor: function() {
      const difficulty = this.deed.deed_difficulty
      if (difficulty === 'low') {
        return 'bg-success text-light';
      } else if (difficulty === 'medium') {
        return 'bg-warning text-dark'
      } else if (difficulty === 'high') {
        return 'bg-danger text-light';
      }
    },
    difficultyTagClass: function() {
      return 'deed-difficulty badge ' + this.difficultyColor;
    }
  }
};
</script>

<style scoped>
.deed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.deed-status-title {
  display: inline-flex;
  align-items: center;
}

.deed-status {
  font-size: 1em;
  margin-right: 8px;
}

.deed-title {
  color: #000000;
  margin: 0;
}

button:hover {
  background: green;
  color: whitesmoke;
}

.deed-users {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 16px 0;
}

.deed-users > *, .deed-details > * {
  font-size: 18px;
  margin: 0 0 8px 0;
}

.deed-requester {
  margin-right: 16px;
}

.deed-difficulty-kudos {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: fit-content;
}

.deed-estimated, .deed-kudos {
  margin: 0;
}

.deed-kudos {
  margin-right: 8px;
}

.deed-difficulty {
  border-radius: 8px;
  width: fit-content;
  height: fit-content;
  font-size: 1em;
}
</style>