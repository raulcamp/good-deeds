<template>
    <ul class="nav nav-tabs nav-container">
    <li class="nav-item">
        <a :class="['nav-link', view==='Feedback' ? 'active' : '']" aria-current="page" v-on:click="getFeedback()">Feedback</a>
    </li>
    <li class="nav-item">
        <a :class="['nav-link', view==='Deeds' ? 'active' : '']" v-on:click="getDeeds()"> Deeds </a>
    </li>
    <li v-if="isUserProfile" class="nav-item">
        <a :class="['nav-link', view==='Rewards' ? 'active' : '']" v-on:click="getRewards()"> My Rewards </a>
    </li>
    </ul>
</template>

<script>
// import axios from 'axios';
import { eventBus } from "../main";

export default {
    name: "GiveFeedback",
    props: {
        user : {
            type: Object, 
            required: true,
        },
        profileUser : {
            type: Object, 
            required: true,
        },
    },
    created : function() {
       
    },
    computed: {
        isUserProfile: function() {
            return this.user._id == this.profileUser._id;
        }
    },
    data() {
        return {
            view: 'Feedback', 
        }
    },
    methods : {
        getFeedback() {
            eventBus.$emit('get-feedback-feed');
            this.view = 'Feedback';
        },
        getDeeds() {
             eventBus.$emit('get-deeds-feed');
             this.view = 'Deeds';
        },
        getRewards() {
             eventBus.$emit('get-rewards-feed');
             this.view = 'Rewards';
        },
    }
}
</script>

<style scoped>
    .nav-container {
        display: flex;
        justify-content: center;
        font-size: 1.5em;
    }
    .context-input {
        display: flex;
        flex-direction: column;
    }
    .mood {
        font-size: 200%;
    }
    .footer {
        display: flex;
        justify-content: space-between;
    }
    .fa-smile-fill {
        color: var(--light-green);
    }
    .fa-smile-beam:hover {
        color: var(--light-green);
    }
    .fa-meh-fill {
        color: var(--dark-yellow);
    }
    .fa-meh:hover {
        color: var(--dark-yellow);
    }
    .fa-frown-fill {
        color: var(--baby-blue);
    }
    .fa-frown:hover {
        color: var(--baby-blue);
    }
    textarea {
        resize: none;
    }
</style>
