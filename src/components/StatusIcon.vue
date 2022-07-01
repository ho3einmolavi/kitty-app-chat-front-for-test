<template>
  <img :src="photoUrl" alt="photo" width="50" height="50"/>
</template>

<script>
import socket from "../socket";
export default {
  name: "StatusIcon",
  props: {
    photo: String,
  },

  computed: {
    photoUrl() {
      return `http://localhost:4000/api/${
        socket.auth.user_type === "breeder" ? "buyer" : "breeder"
      }/storage/download/temp/${this.photo}`;
    },
  },
};
</script>

<style scoped>
.icon {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  display: inline-block;
  background-color: #e38968;
  margin-right: 6px;
}

.icon.connected {
  background-color: #86bb71;
}
</style>
