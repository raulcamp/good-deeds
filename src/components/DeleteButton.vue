<template>
    <button class="delete-deed" v-on:click='deleteDeed' aria-label="Delete Deed" title="Delete">
      <i class="fa fa-trash hovered-button"></i>
      Delete Deed
    </button>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";

export default {
  name: "DeleteButton",
  props: {
    deed_id: {
      type: String,
      required: true,
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    deleteDeed : function () {
      axios.delete(`/api/deeds/${this.deed_id}`)
        .then(response => {
          eventBus.$emit("delete-deed-success", {
            message: response.data.message, 
            id: response.data.id,
            kudos: response.data.kudos,
          });
        })
        .catch(error => {
          eventBus.$emit("error-message", error.response.data.error);
        });
    },
  },
};
</script>

<style scoped>
button {
  margin-right: 8px;
}

.delete-deed:hover {
  background: red;
  color: whitesmoke
}
</style>
