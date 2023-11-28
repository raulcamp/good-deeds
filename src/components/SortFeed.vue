<template>
<section class="sort-feed">
    <!-- <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown button
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item"  :active="sortByCreated" v-on:click="createSort()">
            Created
        </a>
        <a class="dropdown-item"  :active="sortByDate" v-on:click="dateSort()">
            Date
        </a>
        <a class="dropdown-item"  :active="!sortByDate && !sortByCreated" v-on:click="kudosSort()">
            Kudos
        </a>
    </div> 
    </div> -->
    <section class="feed-dropdown">
        <label for="feed-filters" class="small-font"> Sort By: </label>
        <select @change="toggleDropdown" name="feed-filters" id="feed-filters" v-model="selected">
            <option value="created"> Created </option>
            <option value="date"> Date </option>
            <option value="kudos"> Kudos </option>
        </select>
    </section>
    <!-- <b-dropdown id="dropdown-1" text="Sort By" class="m-md-2">
        <b-dropdown-item 
            :active="sortByCreated" 
            v-on:click="createSort()"
        >
            Created
        </b-dropdown-item>
        <b-dropdown-item 
            :active="this.sortByDate"
            v-on:click="dateSort()">
            Date
        </b-dropdown-item>
        <b-dropdown-item 
            :active="!sortByDate && !sortByCreated"
            v-on:click="kudosSort()">
            Kudos
        </b-dropdown-item>
    </b-dropdown> -->
    <div class="arrows ms-2">
        <i :class="['fas', 'fa-arrow-up', !isDescending ? 'fa-arrow-fill' : '']" 
            v-on:click="getAscendingOrder()" 
            aria-label="Order feed by ascending order"
            title="Ascending Order">
        </i>
        <i :class="['fas', 'fa-arrow-down', isDescending ? 'fa-arrow-fill' : '']" 
            v-on:click="getDescendingOrder()" 
            aria-label="Order feed by descending order"
            title="Descending Order">
        </i>
    </div>
</section>
</template>

<script>
// import axios from 'axios';
import { eventBus } from "../main";

import DeedList from "../components/DeedList.vue";
import Message from "../components/Message.vue";
import Navbar from "../components/Navbar.vue";

export default {
   name: 'SortFeed',
   data() {
      return {
          selected: 'created',
          isDescending: true,
      };
    },
   components: {
     Navbar,
     DeedList, 
     Message
   },
   created: function() {
        // reset when update
        eventBus.$on('edit-deed-details-success', () => {
            this.selected = 'created';
            this.isDescending = true;
        });
   },
   methods: {
       createSort() {
           eventBus.$emit('sort-by-created', {
               isDescending: this.isDescending,
           });
        },   
        dateSort() {
           eventBus.$emit('sort-by-date', {
               isDescending: this.isDescending,
           });
       },  
       kudosSort() {
           eventBus.$emit('sort-by-kudos', {
               isDescending: this.isDescending,
           });
       }, 
       getDescendingOrder() {
           if (!this.isDescending) {
                this.isDescending = true;
                eventBus.$emit('flip-deed-order');
           } 
       },
       getAscendingOrder() {
            if (this.isDescending) {
                this.isDescending = false;
                eventBus.$emit('flip-deed-order');
           } 
       },
       toggleDropdown() {
           if(this.selected === "created") {
               this.createSort();
           }
           else if (this.selected === "date") {
               this.dateSort();
           }
           else {
               this.kudosSort();
           }
       },
    },
}
</script>

<style scoped>
.feed-dropdown { 
  display: inline-block;
}

.sort-feed {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  margin-left: 16px;
}

.arrows {
  display: flex;
  flex-direction: column;
}

.fa-arrow-fill {
    color:rgb(36, 210, 42);
}
</style>