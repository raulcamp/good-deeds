<template>
  <div class="feedback">
    <p class="deed-requester">
        <b>By:</b> <router-link :to="`/profile/${feedback.from_user.user_name }`" :aria-label="`Go to ${feedback.from_user.user_name}'s profile`">
        {{ feedback.from_user.user_name }}
        </router-link>
    </p>
    <div class="mood-feedback">
        <p> Level of Satisfaction: </p>
        <i class="far fa-smile-beam mood fa-smile-fill" v-if="feedback.mood === 'happy'"></i>
        <i class="far fa-meh mood fa-meh-fill" v-else-if="feedback.mood === 'meh'"></i>
        <i class="far fa-frown mood fa-frown-fill" v-else-if="feedback.mood === 'frown'"></i>
    </div>
    <div class="context-feedback">
        <p> Feedback: </p>
        <p> {{ feedback.review }} </p>
    </div>
    <div>
        <b-button @click="show=true" variant="secondary">Show Original Deed</b-button>
        <b-modal
        v-model="show"
        >
        <Deed :deed="feedback.deed" :user="user"/>
        <template #modal-footer>
            <div class="w-100 footer">
            </div>
        </template>
        </b-modal>
   </div>
  </div>
</template>

<script>
import Deed from "./Deed.vue";

export default {
    name: "Feedback",
    components: {
        Deed,
    },
    props: {
        feedback : {
            type: Object,
            required: true,
        },
        user : {
            type: Object, 
            required: true,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods : {
    }
}
</script>

<style scoped>
    .feedback {
        font-family: Arial, Helvetica, sans-serif;
        background: rgba(196, 196, 196, 0.5);
        border-radius: 8px;
        text-align: start;
        width: 30vw;
        margin: auto;
        margin-bottom: 16px;
        padding: 8px 16px;
        overflow: scroll;
    }
    .mood-feedback {
        display: flex;
        flex-direction: row;
        /* align-items: center; */
    }
    .context-feedback {
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
    .fa-meh-fill {
        color: var(--dark-yellow);
    }
    .fa-frown-fill {
        color: var(--baby-blue);
    }
</style>