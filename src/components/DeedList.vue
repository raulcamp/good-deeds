<template>
  <ul v-if="filteredDeeds.length > 0" class="deed-list">
    <Deed
      v-for="deed in filteredDeeds"
      v-bind:key="deed._id"
      v-bind:deed="deed"
      :user="user"
    />
  </ul>
  <h2 v-else class="no-deeds">No Deeds yet!</h2>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import Deed from './Deed.vue';

export default {
  name: 'DeedList',
  props: {
    user: {
      type: Object,
      required: true,
    },
    helperID: {
      type: String,
      required: false,
    },
    requesterID: {
      type: String,
      required: false,
    },
    forProfile: { //filled or unexpired only
      type: Boolean,
      default: false
    },
    forHome: { //open and unexpired only
      type: Boolean,
      default: false
    }
  },  
  components: {
    Deed,
  },
  data() {
    return {
      deeds: [],
      filteredDeeds: [],
      id : '',
    };
  },
  created: function() {
    this.getDeeds();
    eventBus.$on('deed-list-refresh', this.getDeeds);
    eventBus.$on('delete-deed-success', (res) => {
      this.deeds = this.deeds.filter(deed => deed._id != res.id);
      this.filteredDeeds = this.helperID || this.requesterID 
            ? this.filteredDeeds.filter(deed => deed._id != res.id)
            : this.filteredDeeds = this.filteredDeeds = [...this.deeds];
    });
    eventBus.$on('create-deed-success', (res) => {
      const deed = res.deed;
      this.deeds.unshift(deed);
      if (this.requesterID && deed.requester.id === this.requesterID) { 
        this.filteredDeeds.unshift(deed);
      }
      else if (this.helperID && deed.deed_helpers.includes(this.helperID)) {
        this.filteredDeeds.unshift(deed);
      }
      else {
        this.filteredDeeds = [...this.deeds];
      }
    });
    eventBus.$on('flip-deed-order', () => {
        this.deeds = this.deeds.reverse();
        this.filteredDeeds = this.filteredDeeds.reverse();
    }),
    eventBus.$on('sort-by-created', res => {
        this.getAllDeeds();
        const descending = res.isDescending;
        if (!descending) {
          this.filteredDeeds = this.filteredDeeds.reverse();
        }
    }),
    eventBus.$on('sort-by-date', res => {
        const descending = res.isDescending;
        this.filteredDeeds = this.filteredDeeds.sort((d1, d2) => {
          if (descending) {
            return d1.deed_date < d2.deed_date ? 1 : -1;
          }
          return d1.deed_date >= d2.deed_date ? -1 : 1;
        });   
    }),
    eventBus.$on('sort-by-kudos', res => {
        const descending = res.isDescending;
        this.filteredDeeds = this.filteredDeeds.sort((d1, d2) => {
          if (descending) {
            return d1.deed_kudos < d2.deed_kudos ? 1 : -1;
          }
          return d1.deed_kudos >= d2.deed_kudos ? -1 : 1;
        });
    }),
    eventBus.$on('selected-deed-success', (id) => {
      this.filteredDeeds = this.deeds.filter(deed => deed._id === id);
    });
    eventBus.$on('edit-deed-details-success', (res) => {
      this.deeds = this.deeds.map(deed => {
        if (deed._id === res.deed._id) {
          return res.deed; 
        }
        return deed;
      });
      this.filteredDeeds = this.filteredDeeds.map(deed => {
        if (deed._id === res.deed._id) {
          return res.deed; 
        }
        return deed;
      });
    });
  },
  destroyed: function() {
    eventBus.$off('deed-list-refresh', this.getDeeds);
  },
  methods: {
    getAllDeeds() {
      axios.get('/api/deeds/').then(res => {
        this.deeds = res.data.deeds.reverse();
        this.filteredDeeds = res.data.filteredDeeds.reverse();
      }).catch(err => {
        // Handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
    getDeedsByRequester() { 
      axios.get(`/api/deeds/?requester=${this.requesterID}&forProfile=${this.forProfile}`).then(res => {
        this.deeds = res.data.deeds.reverse();
        this.filteredDeeds = res.data.filteredDeeds.reverse();
      }).catch(err => {
        // Handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
    getDeedsByHelper() { 
      axios.get(`/api/deeds/?helper=${this.helperID}&forProfile=${this.forProfile}`).then(res => {
        this.deeds = res.data.deeds.reverse();
        this.filteredDeeds = res.data.filteredDeeds.reverse();
      }).catch(err => {
        // Handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
    getDeeds() {
      if (this.requesterID) {
        this.getDeedsByRequester();
      } else if (this.helperID) {
        this.getDeedsByHelper();
      } else {
        this.getAllDeeds();
      }
    }
  },
};
</script>

<style>
.deed-list {
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
