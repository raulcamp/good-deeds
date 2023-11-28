<template>
  <section class="deed-details-update">
    <section class="deed-header">
      <div class="deed-title">
        <label for="title">Title:</label>
        <input v-model="newTitle" type="text" name="title">
      </div>
      <UpdateButton
        v-bind:deed="this.deed"
        v-bind:isEditing="this.isEditing"
      />
    </section>
    <div class="deed-location">
      <label for="autocomplete-location">Location:</label>
      <vue-google-autocomplete
        v-model="newLocation"
        id="autocomplete-location"
        placeholder=""
        v-on:placechanged="getAddressData"
      >
      </vue-google-autocomplete>
    </div>
    <div class="deed-date-time">
      <label for="datetime">Date & Time:</label>
      <input v-model="newDateTime" type="datetime-local" name="datetime">
    </div>
    <section class="deed-difficulty-kudos">
      <label for="difficulty">Difficulty:</label>
      <select v-model="newDifficulty" name="difficulty" class="difficulty-dropdown">
        <option value="low" selected>Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <p class="deed-kudos">
        <b>Kudos:</b> {{ computedKudos }} per helper
      </p>
      <div class="deed-estimated">
        <label for="hours">Estimated Hours:</label>
        <input v-model="newHours" type="number" min="1" name="hours">
      </div>
    </section>
    <div class="deed-description">
      <label for="description">Description:</label>
      <textarea v-model="newDescription" name="description"></textarea>
    </div>
    <div class="deed-helpers">
      <label for="helpers">Helpers Needed:</label>
      <input v-model="newHelpers" type="number" min="1" name="helpers">
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";
import { calculateKudos } from '../../models/deed-controller';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import UpdateButton from "./UpdateButton.vue";

export default {
  name: "UpdateDeed",
  props: {
    deed: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    }
  },
  components: {
    VueGoogleAutocomplete,
    UpdateButton,  
  },
  data() {
    return {
      newTitle: '',
      newLatitude : '',
      newLongitude: '',
      newLocation: '',
      newHelpers: 1,
      newDateTime: '',
      newDifficulty: 'low',
      newHours: 1,
      newDescription: '',
    };
  },
  computed: {
    computedKudos: function() {
      return calculateKudos(this.newDifficulty, this.newHours);
    },
    totalKudosCost: function() {
      return this.newHelpers * this.computedKudos;
    },
  },
  methods: {
    updateDeed : function () {
      const bodyContent = { 
        title: this.newTitle,
        latitude : this.newLatitude,
        longitude : this.newLongitude,
        location: this.newLocation,
        helperAmount: this.newHelpers,
        date: this.newDateTime,
        difficulty: this.newDifficulty,
        estimatedHours: this.newHours,
        description: this.newDescription,
        kudos: this.computedKudos,
        kudosCost: this.totalKudosCost,
      };
      axios.patch(`/api/deeds/${this.deed._id}`, bodyContent)
        .then(res => {
          // Handle success
          eventBus.$emit('edit-deed-details-success', {
            message: res.data.message,
            deed: res.data.deed,
            kudos: res.data.kudos,
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
    resetData: function() {
      this.newTitle = '';
      this.newLatitude = '';
      this.newLongitude = '';
      this.newLocation = '';
      this.newHelpers = 1;
      this.newDateTime = '';
      this.newDifficulty = 'low';
      this.newHours = 1;
      this.newDescription = '';
    },
    getAddressData: function (addressData, placeResultData) {
      this.newLocation = placeResultData.formatted_address;
      this.newLatitude = addressData.latitude;
      this.newLongitude = addressData.longitude;
    }
  },
  created: function() {
    // Initialize inputs to current data
    this.newTitle = this.deed.deed_title;
    this.newLatitude = this.deed.deed_latitude;
    this.newLongitude = this.deed.deed_longitude;
    this.newLocation = this.deed.deed_location;
    this.newHelpers = this.deed.deed_helpersNeeded;
    this.newDateTime = this.deed.deed_date;
    this.newDifficulty = this.deed.deed_difficulty;
    this.newHours = this.deed.deed_estimatedHours;
    this.newDescription = this.deed.deed_description;

    // Update Deed listener
    eventBus.$on('initiate-edit-deed-details', () => {
      this.updateDeed();
    });
  },
  beforeDestroy: function() {
    eventBus.$off('initiate-edit-deed-details', this.listener);
  },
};
</script>

<style scoped>
.deed-details-update > * {
  margin: 0 0 8px 0;
}

.deed-header {
  display: flex;
  justify-content: space-between;
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
  font-size: 18px;
  margin-right: 8px;
}

.deed-description {
  margin: 16px 0;
  text-align: start;
  align-items: center;
}

.difficulty-dropdown {
  margin-right: 16px;
}

label {
  font-size: 18px;
}

label[for='title'] {
  font-size: 1.5em;
}

input[name='title'] {
  font-size: 1.5em;
}

input, select {
  height: 1.5em;
  font-size: 18px;
}

.deed-title {
  display: flex;
  align-items: center;
}

input[id='autocomplete-location'] {
  width: 50%;
}

input[type='number'] {
  width: 48px;
}

input[name='title'], input[name='location'] {
  display: inline-block;
  flex-grow: 2;
}

textarea {
  display: block;
  width: 100%;
  height: 10vh;
}
</style>
