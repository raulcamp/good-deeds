<template>
  <div>
    <b-button v-if="isRequester" @click="show=true" variant="secondary">Give Feedback to Complete</b-button>
    <b-button v-else-if="!isRequester" @click="show=true" variant="secondary">Give Feedback</b-button>
    <b-modal
      v-model="show"
      :title="this.getTitle()" 
    >
    <section class="mood-input">
      <label for="satisfaction"> Satisfaction: </label>
      <div id="satisfaction"> 
        <i :class="['far', 'fa-smile-beam', 'mood', this.happy ? 'fa-smile-fill' : '']" @click="toggleHappy()"></i>
        <i :class="['far','fa-meh', 'mood', this.meh ? 'fa-meh-fill' : '']" @click="toggleMeh()"></i>
        <i :class="['far', 'fa-frown', 'mood', this.frown ? 'fa-frown-fill' : '']" @click="toggleFrown()"></i>
      </div>
    </section>
    <form class="context-input">
        <label for="comments"> Comments: </label>
        <textarea id="comments" v-model="contextInput" required>
        </textarea>
    </form>

      <b-container fluid>
      </b-container>

      <template #modal-footer>
        <div class="w-100 footer">
          <b-button
            variant="danger"
            size="sm"
            class="float-right"
            @click="show=false"
          >
            Cancel
          </b-button>
          <b-button
            v-if="revieweeNumber < revieweeOrder.length - 1"
            variant="primary"
            size="sm"
            class="float-right"
            :disabled="isButtonDisabled"
            @click="getNextToReview()"
          >
            Next Helper
          </b-button>
          <b-button
            v-else
            variant="primary"
            size="sm"
            class="float-right"
            :disabled="isButtonDisabled"
            @click="completeDeed()"
          >
            Submit
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { eventBus } from "../main";
import { calculateKudos } from '../../models/deed-controller';

import Deed from "./Deed.vue";

export default {
    name: "GiveFeedback",
    components: {
        Deed,
    },
    props: {
        deed : { 
            type: Object, 
            required: true,
        },
        user : {
            type: Object, 
            required: true,
        },
    },
    created : function() {
        // feedback must be about requester
        if (this.deed.deed_helpers.map(helper => helper._id).includes(this.user._id)) {
            this.revieweeOrder = [this.deed.deed_requester];
        }
        // feedback must be about helpers
        else {
          this.revieweeOrder = this.deed.deed_helpers;
        }
        this.reviewee = this.revieweeOrder[this.revieweeNumber];
    },
    computed: {
      isButtonDisabled: function() {
        return this.contextInput.length === 0 || (!this.happy && !this.meh && !this.frowny);
      },
      isRequester: function() {
        return this.deed.deed_requester._id === this.user._id;
      },
      computedKudos: function() {
        return calculateKudos(this.deed.deed_difficulty, this.deed.deed_estimatedHours);
      },
      totalKudosCost: function() {
        return this.deed.deed_helpers.length * this.computedKudos;
      },
    },
    data() {
        return {
            reviewee: new Object(), 
            revieweeOrder: [],
            revieweeNumber: 0, 
            happy: false,
            meh: false,
            frown: false,
            contextInput: '',
            show: false,
        }
    },
    methods : {
      getTitle() {
          return `Giving feedback to ${this.reviewee.user_name}`;
      },
      getNextToReview() {
          this.revieweeNumber = this.revieweeNumber + 1
          this.reviewee = this.deed.deed_helpers[this.revieweeNumber];
      },
      getMood() {
        if (this.happy) {
          return "happy";
        } else if (this.meh) {
          return "meh";
        } else if (this.frown) {
          return "frown";
        }
      },
      toggleFrown() {
          this.frown = true;
          this.happy = false;
          this.meh = false;
      },
      toggleHappy() {
          this.frown = false;
          this.happy = true;
          this.meh = false;
      },
      toggleMeh() {
          this.frown = false;
          this.happy = false;
          this.meh = true;
      },
      completeDeed: function () {
        axios.post(`/api/feedback/`, {
            username: this.reviewee.user_name,
            review: this.contextInput,
            mood: this.getMood(),
            deed_id: this.deed._id
          })
          .then(res => {
            // Handle success
            eventBus.$emit('create-feedback-success', {
              message: res.data.message,
              feedback: res.data.feedback,
            });
            this.show = false;
            this.updateDeedFeedback();
          })
          .catch(err => {
            // Handle error
            let errorMessage = err.response.data.error;
            if (errorMessage === undefined) {
              errorMessage = err.response.data.message;
            }
            eventBus.$emit('error-message', errorMessage);
          });
      },
      updateDeedFeedback: function() {
        const bodyContent = {
          reviewee: this.user,
          completed: this.isRequester,
          kudosCost: this.isRequester ? this.totalKudosCost : undefined,
        };
        axios.patch(`/api/deeds/${this.deed._id}`, bodyContent)
          .then(res => {
            // Handle success
            eventBus.$emit('edit-deed-details-success', {
              message: res.data.message,
              deed: res.data.deed,
              kudos: res.data.kudos,
            });
            this.show = false;
          })
          .catch(err => {
            // Handle error
            let errorMessage = err.response.data.error;
            if (errorMessage === undefined) {
              errorMessage = err.response.data.message;
            }
            eventBus.$emit('error-message', errorMessage);
          });
      }
    }
}
</script>

<style scoped>
    .mood-input {
        display: flex;
        align-items: center;
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
