<template>
    <LMarker
      :lat-lng="getMarkerLatLng()"
      v-on:click="handleMarkerClick()"
      :icon="getIcon()"
    />
</template>

<script>
import { eventBus } from "../main";
import {LMarker, LIcon} from 'vue2-leaflet';
import { icon } from "leaflet";

export default {
  name: "MapMarker",
  components: {
    LIcon,
    LMarker,
  },
  props : {
    deed: Object,
  },
  data () {
    return {
      selected : false, 
    };
  },
  created : function() {
    eventBus.$on('selected-deed-success', (id) => {
       if (id !== this.deed._id) {
           this.selected = false;
       }
    });
  },  
  methods : { 
    getMarkerLatLng() { 
       const latitude = this.deed.deed_latitude;
       const longitude = this.deed.deed_longitude;
      //TODO: figure out how to handle no latitude and longitude given, defaulted location to cambridge MA
      return [latitude ? latitude :  42.3736, longitude ? longitude : -71.1097];
    },
    handleMarkerClick() {
        this.selected = !this.selected;
        if (!this.selected) {
            eventBus.$emit('deed-list-refresh');
        } else {
            eventBus.$emit('selected-deed-success', this.deed._id);
        }
    },
    getIcon() {
        const difficulty = this.deed.deed_difficulty;
        let url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        if (difficulty === "medium") {
          url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png';
        }
        else if (difficulty === "high") { 
           url = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
        }
        return new icon({
        iconUrl: url,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: this.selected 
            ? [30, 45]
            : [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
        });
    }
  }
}
</script>

