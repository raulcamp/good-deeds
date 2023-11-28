<template>
  <form class="signup" id="create-user" @submit.prevent="createUser">
    <h2 class="text-center">Sign-up</h2>
    <label for="create-user-username">Username:</label>
    <input v-model="username" id="create-user-username" name="username" required />
    <label for="username">Phone Number:</label>
    <input
      v-model="phoneNumber"
      id="phoneNumber"
      name="phoneNumber"
      type="tel"
      placeholder="1234567890"
      required
    />
    <label for="email">Email:</label>
    <input
      v-model="email"
      id="email"
      name="email"
      placeholder="name@example.com"
      required
    />
    <label for="create-user-password">Password:</label>
    <input
      v-model="password"
      id="create-user-password"
      name="password"
      type="password"
      required
    />
    <input type="submit" class="sign-up-btn" value="Sign Up" />
  </form>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "CreateUserForm",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      phoneNumber: "",
      email: "",
    };
  },
  computed: {},
  methods: {
    createUser() {
      axios
        .post("/api/user/", {
          username: this.username,
          password: this.password,
          phoneNumber: this.phoneNumber,
          email: this.email,
        })
        .then((response) => {
          eventBus.$emit("login-success", response.data.user);
          this.$router.push('/');
        })
        .catch(err => {
          // Handle error
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit('error-message', errorMessage)
        });
        this.resetData();
    },
    resetData() {
      this.username = "";
      this.password = "";
      this.phoneNumber = "";
      this.email = "";
    }
  },
};
</script>

<style scoped>
.signup {
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

.sign-up-btn {
  margin-top: 8px;
  width: fit-content;
  align-self: center;
}
</style>
