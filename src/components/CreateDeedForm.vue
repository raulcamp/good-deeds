<template>
  <form class="create-deed-form" v-on:submit.prevent="createDeed" method="POST">
    <h2>Create Deed</h2>
    <section class="create-deed-form-input">
      <label for="title">Title:</label>
      <input v-model="title" type="text" name="title">
    </section>
    <section class="create-deed-form-input">
      <label for="autocomplete-location">Street Address:</label>
      <vue-google-autocomplete
        v-model="location"
        id="autocomplete-location"
        placeholder=""
        v-on:placechanged="getAddressData"
      >
      </vue-google-autocomplete>
    </section>
    <section class="create-deed-form-input">
      <label for="helpers">Helpers Needed:</label>
      <input v-model="helpers" type="number" min="1" name="helpers">
    </section>
    <section class="create-deed-form-input">
      <label for="datetime">Date and Time:</label>
      <input v-model="datetime" type="datetime-local" name="datetime">
    </section>
    <section class="create-deed-form-input">
      <label for="difficulty">Difficulty:</label>
      <select v-model="difficulty" name="difficulty" class="difficulty-dropdown">
        <option value="low" selected>Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <label for="hours">Estimated Hours:</label>
      <input v-model="hours" type="number" min="1" name="hours">
      <p class="calculated-kudos">
        <strong>Kudos:</strong>
        {{ computedKudos }}
      </p>
    </section>
    <section class="create-deed-form-textbox">
      <label for="description">Description:</label>
      <textarea v-model="description" name="description"></textarea>
    </section>
    <section class="create-deed-form-actions">
      <button class="create-deed-btn" type="submit">Create Deed</button>
      <button class="create-deed-cancel-btn" v-on:click="cancelCreate">Cancel</button>
    </section>
  </form>
</template>

<script>
import { eventBus } from "../main";
import axios from 'axios';
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { calculateKudos } from '../../models/deed-controller';

export default {
  name: "CreateDeedForm",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    VueGoogleAutocomplete,  
  },
  data() {
    return {
      requester: this.user._id,
      title: '',
      location: '',
      helpers: 1,
      datetime: '',
      difficulty: 'low',
      hours: 1,
      description: '',
      latitude : '',
      longitude: '',
    };
  },
  computed: {
    computedKudos: function() {
      return calculateKudos(this.difficulty, this.hours);
    },
  },
  methods: {
    createDeed: function() {
      const bodyContent = { 
        requester: this.requester,
        title: this.title,
        latitude : this.latitude,
        longitude : this.longitude,
        location: this.location,
        helpersNeeded: this.helpers,
        date: this.datetime,
        difficulty: this.difficulty,
        estimatedHours: this.hours,
        description: this.description
      };
      axios.post('/api/deeds', bodyContent)
        .then((res) => {
          // Handle success
          eventBus.$emit('create-deed-success', {
            message: res.data.message,  
            deed: res.data.deed,
            kudos: res.data.kudos,
          });
          this.resetData();
        })
        .catch(err => {
          // Handle error
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit('error-message', errorMessage);
        })
    },
    cancelCreate: function() {
      eventBus.$emit('cancel-create-deed');
      this.resetData();
    },
    resetData: function() {
      this.title = '';
      this.location = '';
      this.helpers = 1;
      this.datetime = '';
      this.difficulty = 'low';
      this.hours =  1;
      this.description = '';
      this.latitude = '';
      this.longitude = '';
    },
    getAddressData: function (addressData, placeResultData) {
        this.location = placeResultData.formatted_address;
        this.latitude = addressData.latitude;
        this.longitude = addressData.longitude;
    }
  }
};
</script>

<style scoped>
.create-deed-form {
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-width: 35vw;
  margin: 16px auto;
}

.create-deed-form-input {
  display: flex;
  flex-direction: row;
  margin: 16px 0;
  text-align: start;
  align-items: center;
}

.calculated-kudos {
  margin: 0 0 0 16px;
}

.create-deed-form-textbox {
  margin: 16px 0;
  text-align: start;
  align-items: center;
}

.difficulty-dropdown {
  margin-right: 16px;
}

.create-deed-form-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.create-deed-btn {
  margin-right: 8px;
}

.create-deed-btn:hover {
  background: green;
  color: whitesmoke;
}

.create-deed-cancel-btn:hover {
  background: red;
  color: whitesmoke;
}

label, .calculated-kudos {
  font-size: 1.25em;
}

input, select {
  height: 1.5em;
  font-size: 1.25em;
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
