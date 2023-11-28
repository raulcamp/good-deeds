<template>
  <section class="main text-center">
    <Navbar :user="user"/>
    <Message/>
    <SignInForm />
    <CreateUserForm />
  </section>
</template>

<script>
import Message from "../components/Message.vue";
import Navbar from "../components/Navbar.vue";
import SignInForm from "../components/SignInForm.vue"
import CreateUserForm from "../components/CreateUserForm.vue"

export default {
  name: "Account",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  components: {
    Message,
    Navbar,
    SignInForm,
    CreateUserForm
  },
};
</script>

<style scoped>
.create-deed-btn:hover {
  background: green;
  color: whitesmoke;
}
.log-in {
  font-family: Arial, Helvetica, sans-serif;
  text-align: start;
  width: fit-content;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>