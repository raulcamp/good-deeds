<template>
  <a v-on:click="signOut">Sign Out</a>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignOut",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    signOut() {
      axios
        .delete("/api/session")
        .then(() => {
          eventBus.$emit('signout-success');
        })
        .catch(() => {
          eventBus.$emit('signout-success');
      });
    },
  },
};
</script>

<style scoped>
.sign-out {
  padding: 4px;
  background: #c4c4c4;
  border: 1px solid #000000;
  box-sizing: border-box;
}

.sign-out:hover {
  background: #b0b0b0;
}
</style>
