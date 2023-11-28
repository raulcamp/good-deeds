<template>
  <li class="deed">
    <!-- access deed content using "deed" prop-->
    <DeedContent
      v-bind:deed="this.deed"
      v-bind:user="this.user"
      v-bind:isEditing="this.isEditing"
    />
    <section class="deed-actions">
      <section v-if="isRequester && hasHelpers && pastDeadline">
        <GiveFeedback
          v-if="!gaveFeedback"
          v-bind:deed="this.deed"
          v-bind:user="this.user"
        />
      </section>
      <section v-if="user.user_name">
        <section v-if="!isHelper && !isOwner && remainingHelpers > 0 && !pastDeadline">
          <button class="deed-actions-btn" v-on:click="offerHelp">
            Offer Help
          </button>
        </section>
        <section v-if="isHelper">
          <GiveFeedback
            v-if="pastDeadline && !gaveFeedback"
            v-bind:deed="this.deed"
            v-bind:user="this.user"
          />
          <button v-else-if="!pastDeadline" class="deed-actions-btn" v-on:click="unOfferHelp">
            Unoffer Help
          </button>
        </section>
      </section>
    </section>
  </li>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import GiveFeedback from "./GiveFeedback.vue";
import DeedContent from "./DeedContent.vue";

export default {
  name: "Deed",
  components: {
    GiveFeedback,
    DeedContent,
  },
  props: {
    deed: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      isFeedback: false,
      isFinished: false,
      isAccepted: false,
      helpMsg: "Offer Help",
    };
  },
  computed: {
    isRequester: function() {
      return this.user._id == this.deed.deed_requester._id;
    },
    hasHelpers: function() {
      return this.deed.deed_helpers.length > 0;
    },
    isHelper: function () {
      return (
        this.deed.deed_helpers.filter(
          (helper) => helper.user_name === this.user.user_name
        ).length > 0
      );
    },
    isOwner: function () {
      return this.deed.deed_requester._id === this.user._id;
    },
    remainingHelpers: function () {
      return this.deed.deed_helpersNeeded - this.deed.deed_helpers.length;
    },
    pastDeadline: function () {
      const currDate = new Date();
      const deedDate = new Date(this.deed.deed_date);
      return currDate.getTime() > deedDate.getTime();
    },
    gaveFeedback: function () {
      return this.deed.deed_givenFeedback.includes(this.user._id);
    },
  },
  methods: {
    unOfferHelp: function () {
      axios
        .patch(`/api/deeds/${this.deed._id}`, {
          removeHelper: this.user,
          removeSelf: true,
        })
        .then((res) => {
          // Handle success
          this.removeHelper(res.data.deed, this.user);
          eventBus.$emit('deed-list-refresh', {});
        })
        .catch((err) => {
          // Handle error
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit("error-message", errorMessage);
        });
    },
    completeDeed: function () {
      this.isFeedback = true;
      axios
        .patch(`/api/deeds/${this.deed._id}`, { status: "feedback" })
        .then((res) => {
          // Handle success
          eventBus.$emit("edit-deed-details-success", {
            message: res.data.message,
            deed: res.data.deed,
          });
        })
        .catch((err) => {
          // Handle error
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit("error-message", errorMessage);
        });
    },
    offerHelp: function () {
      axios
        .patch(`/api/deeds/${this.deed._id}`, { newHelper: this.user })
        .then((res) => {
          // Handle success
          eventBus.$emit("add-deed-helper-success", res.data.deed);
          this.deed.deed_helpers.push(this.user);
          this.isAccepted = true;
          this.helpMsg = this.isAccepted ? "Accepted" : "Offer Help";
        })
        .catch((err) => {
          let errorMessage = err.response.data.error;
          if (errorMessage === undefined) {
            errorMessage = err.response.data.message;
          }
          eventBus.$emit("error-message", errorMessage);
        });
    },
    removeHelper: function(deed, helperToRemove) {
      if (this.deed._id === deed._id) {
        this.deed.deed_helpers = this.deed.deed_helpers.filter(
          (helper) => helper._id !== helperToRemove._id
        );
      }
    }
  },
  created: function () {
    // this.isFeedback = this.deed.deed_status === "feedback";
    // this.isFinished = this.deed.deed_status === "finished";
    this.isAccepted =
      this.deed.deed_helpers.filter(
        (helper) => helper.user_name === this.user.user_name
      ).length > 0;

    eventBus.$on("toggle-edit-deed-details", (deed) => {
      if (this.deed._id === deed._id) {
        this.isEditing = true;
      }
    });
    eventBus.$on("delete-deed-success", (id) => {
      if (this.deed._id === id) {
        this.isEditing = false;
      }
    });
    eventBus.$on("edit-deed-details-success", (res) => {
      if (this.deed._id === res.deed._id) {
        this.isEditing = false;
      }
    });
    eventBus.$on("cancel-update-deed-details", (deed) => {
      if (this.deed._id === deed._id) {
        this.isEditing = false;
      }
    });
    eventBus.$on("finish-deed-success", () => {
      this.isFeedback = false;
      this.isFinished = true;
    });
    eventBus.$on("remove-deed-helper-success", (res) => {
      this.removeHelper(res.deed, res.helper);
    });
  },
};
</script>

<style scoped>
.deed {
  font-family: Arial, Helvetica, sans-serif;
  background: rgba(196, 196, 196, 0.5);
  border-radius: 8px;
  text-align: start;
  width: 100%;
  max-width: 40vw;
  margin: auto;
  margin-bottom: 16px;
  padding: 8px 16px;
  overflow: scroll;
}

.deed-actions-btn:hover {
  background: green;
  color: whitesmoke;
}
.deed-actions {
  display: flex;
}
.fa-minus-circle {
  cursor: pointer;
  font-size: 1.25em;
  color: rgba(255, 0, 0, 0.555);
  margin-right: 4px;
}

.fa-minus-circle:hover {
  color: rgba(255, 0, 0);
}
</style>
