<template>
  <div>
    <div class="user" @click="$emit('select', offer)" v-if="offer.buyer">
      {{ offer.status }}
      <div class="description">
        <div class="name">
          <!-- {{ user.username }} {{ user.self ? " (yourself)" : "" }} -->
          {{ offer.buyer.full_name }}
        </div>
        <div>
          {{ offer.last_message }}
        </div>
        <div class="status">
          <status-icon :photo="offer.buyer.photo" />
        </div>
      </div>
      <!-- <div v-if="user.hasNewMessages" class="new-messages">!</div> -->
    </div>
    <div class="user" @click="$emit('select', offer)" v-if="offer.breeder">
      {{ offer.status }}
      <div class="description">
        <div class="name">
          <!-- {{ user.username }} {{ user.self ? " (yourself)" : "" }} -->
          {{ offer.breeder.cattery_name }}
        </div>
        <div>
          {{ offer.last_message }}
        </div>
        <div class="status">
          <status-icon :photo="offer.breeder.images[0]" />
        </div>
      </div>
      <!-- <div v-if="user.hasNewMessages" class="new-messages">!</div> -->
    </div>
  </div>
</template>

<script>
import StatusIcon from "./StatusIcon";
export default {
  name: "Offer",
  components: { StatusIcon },
  props: {
    offer: Object,
    // selected: Boolean,
  },
  methods: {
    onClick() {
      // this.$emit("select");
    },
  },
  // computed: {
  //   status() {
  //     return this.user.connected ? "online" : "offline";
  //   },
  // },
};
</script>

<style scoped>
.selected {
  background-color: #1164a3;
}

.user {
  padding: 10px;
}

.description {
  display: inline-block;
}

.status {
  color: #92959e;
}

.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-top: 10px;
}
</style>
