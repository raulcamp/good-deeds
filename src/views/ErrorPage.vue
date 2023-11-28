<template>
    <section>
        <Navbar :user="user"/>
        <h1 class="text-center"> Sorry, we could not find that page! </h1>
        <p class="text-center"> Try going to the
            <router-link to="/"> Home Page </router-link>
        </p>
    </section>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
    name: "ErrorPage",
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    components: { 
        Navbar,
    },
}
</script>