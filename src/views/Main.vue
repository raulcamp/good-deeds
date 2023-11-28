<template>
  <section class="main text-center">
    <Navbar v-bind:user="user"/>
    <Message/>
    <div class="main-content">
      <Map class="map"/>
      <div class="view-deeds" v-if="!isCreating">
        <h2 class="deeds-title">Deeds</h2>
        <button v-if="user.user_name" aria-label="Create Deed" class="create-deed-btn" v-on:click="startCreate">
          <i class="fas fa-plus"></i>
          Create Deed
        </button>
        <section class="feed">
          <SortFeed />
          <DeedList v-bind:user="user" v-bind:forHome="true"/>
        </section>
      </div>
      <CreateDeedForm v-else-if="user.user_name" v-bind:user="user" />
    </div>
  </section>
</template>

<script>
import { eventBus } from "../main";
import CreateDeedForm from "../components/CreateDeedForm.vue";
import DeedList from "../components/DeedList.vue";
import Map from "../components/Map.vue";
import Message from "../components/Message.vue";
import Navbar from "../components/Navbar.vue";
import SortFeed from "../components/SortFeed.vue";

export default {
  name: "Main",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    CreateDeedForm, 
    DeedList,
    Map,
    Message,
    Navbar,
    SortFeed,
  },
  data() {
    return {
      isCreating: false,
    };
  },
  methods: {
    startCreate: function() {
      this.isCreating = true;
    }
  },
  created: function() {
    eventBus.$on('cancel-create-deed', () => {
      this.isCreating = false;
    });
    eventBus.$on('create-deed-success', () => {
      this.isCreating = false;
    });
    eventBus.$on('signout-success', () => {
      this.isCreating = false;
    });
  }
};
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.create-deed-btn {
  margin-top: 16px;
}

.create-deed-btn:hover {
  background: green;
  color: whitesmoke;
}

.main-content {
  display: flex;
}

.feed {
  display: flex;
  flex-direction: column;
}

.view-deeds {
  max-height: 90vh;
  min-width: 35vw;
  width: fit-content;
  overflow: scroll;
}

.deeds-title {
  margin-top: 8px;
}
</style>