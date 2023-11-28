<template>
  <button v-if="!this.isEditing" v-on:click="toggleEdit">
    <i class="fas fa-edit"></i>
    Edit Deed
  </button>
  <div class="confirm-update" v-else>
    <button class="confirm-update-btn" v-on:click="initiateUpdate">
      <i class="far fa-check-circle"></i>
      Update
    </button>
    <button class="cancel-update-btn" v-on:click="cancelUpdate">
      <i class="far fa-times-circle"></i>
      Cancel
    </button>
  </div>
</template>

<script>
import { eventBus } from "../main";

export default {
  name: "UpdateButton",
  props: {
    deed: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleEdit: function() {
      eventBus.$emit('toggle-edit-deed-details', this.deed);
    },
    initiateUpdate: function() {
      eventBus.$emit('initiate-edit-deed-details', this.deed);
    },
    cancelUpdate: function() {
      eventBus.$emit('cancel-update-deed-details', this.deed);
    }
  },
};
</script>

<style scoped>
.confirm-update {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.confirm-update-btn, .cancel-update-btn {
  width: fit-content;
  font-size: 16px;
}

.confirm-update-btn:hover {
  background: green;
  color: whitesmoke;
}

.cancel-update-btn {
  margin-left: 8px;
}

.cancel-update-btn:hover {
  background: red;
  color: whitesmoke;
}
</style>
