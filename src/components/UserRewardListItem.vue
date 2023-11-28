<template>
  <li class="reward">
    <section class="reward-content">
      <h2 class="reward-title">
        {{ userReward.reward.reward_name }}
      </h2>
      <p class="reward-source">
        Sponsor: {{ userReward.reward.reward_source }}
      </p>
      <p class="reward-description">
        {{ userReward.reward.reward_description }}
      </p>
      <p class="reward-cost">
        <strong>Redeemed on:</strong> {{ formattedRedeemDateTime }}
      </p>
      <p class="reward-cost">
        <strong>Expires on:</strong> {{ formattedExpiryDateTime }}
      </p>
    </section>
  </li>
</template>

<script>
export default {
  name: "UserRewardListItem",
  props: {
    userReward: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedRedeemDateTime: function() {
      const redeemDateTime = new Date(this.userReward.redeem_date);
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(redeemDateTime);
    },
    formattedExpiryDateTime: function() {
      const expiryDateTime = new Date(this.userReward.expiry_date);
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'medium' }).format(expiryDateTime);
    },
  }
};
</script>

<style scoped>
.reward {
  font-family: Arial, Helvetica, sans-serif;
  background: rgba(196, 196, 196, 0.5);
  border-radius: 8px;
  text-align: start;
  width: 100%;
  max-width: 40vw;
  margin: auto;
  margin-bottom: 16px;
  padding: 8px 16px;
}

.reward-title {
  margin-bottom: 0;
}

.reward-source {
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
