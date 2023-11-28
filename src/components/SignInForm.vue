<template>
  <form class="signin" id="sign-in" @submit.prevent="signIn">
    <h2 class="text-center">Sign-in</h2>
    <label for="sign-in-username">Username:</label>
    <input v-model="username" id="sign-in-username" name="username" required />
    <label for="sign-in-password">Password:</label>
    <input
      v-model="password"
      id="sign-in-password"
      name="password"
      type="password"
      required
    />
    <input type="submit" class="sign-in-btn" value="Sign In" />
  </form>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "SignIn",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  computed: {},
  methods: {
    signIn() {
      axios
        .post("/api/session", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          eventBus.$emit("login-success", response.data.user);
          this.$router.push("/");
        })
        .catch(err => {
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit('error-message', errorMessage)
        });
      this.username = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
.signin {
  display: flex;
  flex-direction: column;
  align-content: center;
  font-family: Arial, Helvetica, sans-serif;
  text-align: start;
  width: fit-content;
  margin: auto;
  margin-top: 16px;
}

label {
  font-size: 1.25em;
}

input {
  font-size: 1.25em;
  width: 30vw;
}

.sign-in-btn {
  margin-top: 8px;
  width: fit-content;
  align-self: center;
}
</style>
