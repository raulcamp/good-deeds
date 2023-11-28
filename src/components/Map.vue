<template>
  <div class="map-loading" v-if="this.isLoading">
    <div class="spinner-border loading" style="width: 3rem; height: 3rem;" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <strong class="loading-text">Loading Location...</strong>
  </div>
  <LMap class="map" v-else :zoom="zoom" :center="center">
    <LTileLayer :url="url" :attribution="attribution"></LTileLayer>
    <MapMarker v-for="deed in deeds" v-bind:key="deed._id" v-bind:deed="deed"/>
  </LMap>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

import L from 'leaflet';
import {LMap, LTileLayer} from 'vue2-leaflet';
import MapMarker from './MapMarker.vue';

export default {
  name: "Map",
  components: {
    LMap,
    LTileLayer,
    MapMarker
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      center: [42.3736, -71.1097],
      deeds : [],
      isLoading: true, //map is loading
    };
  },
  created: function() {
    this.getUserLocation();
    this.getDeeds();
    eventBus.$on('deed-list-refresh', this.getDeeds);
    eventBus.$on('delete-deed-success', (res) => {
      this.deeds = this.deeds.filter(deed => deed._id != res.id);
    });
    eventBus.$on('create-deed-success', (res) => {
      this.deeds.unshift(res.deed);
    });
    eventBus.$on('edit-deed-details-success', (res) => {
      this.deeds = this.deeds.map(deed => {
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
  methods : { 
    getMarkerLatLng(deed) { 
       const latitude = deed.deed_latitude;
       const longitude = deed.deed_longitude;
      //TODO: figure out how to handle no latitude and longitude given, defaulted location to cambridge MA
      return [latitude ? latitude :  42.3736, longitude ? longitude : -71.1097];
    },
    getDeeds() {
      axios.get('/api/deeds').then(r => {
        this.deeds = r.data.deeds;
      }).catch(err => {
        // Handle error
        let errorMessage = err.response.data.error;
        if (errorMessage === undefined) {
          errorMessage = err.response.data.message;
        }
        eventBus.$emit('error-message', errorMessage);
      });
    },
    getUserLocation() {
        navigator.geolocation.getCurrentPosition(
        pos => {
          const latLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
          this.center = [latLng.lat, latLng.lng];
          this.isLoading = false;
        },
        () => {
          // defaults to Cambridge, MA
          this.center = [42.3736, -71.1097];
          this.isLoading = false;
        },
        {
          timeout: 5000,
          maximumAge: 0,
          enableHighAccuracy: false
        }
      );

    }
  },
}
</script>
<style scoped>
.map, .map-loading {
  height: 90vh;
  width: 100%;
}

.map-loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  font-size: 1.5rem;
  margin-left: 16px;
}
</style>
