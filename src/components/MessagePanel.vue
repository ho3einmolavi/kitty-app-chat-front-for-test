<template>
  <div>
    <div class="header">
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">
            Offer from {{ offer.buyer ? offer.buyer.full_name : "me" }}
          </h5>
          <p class="card-text">
            {{ offer.note }}
          </p>
          <a href="#" class="btn btn-primary">view application</a>
        </div>
      </div>
    </div>

    <ul class="messages">
      <li v-for="(message, index) in messages" :key="index" class="message">
        <div class="sender">
          {{ isSender(message) ? "(you)" : "other side" }}
        </div>
        {{ message.content }}
      </li>
    </ul>

    <form @submit.prevent="onSubmit" class="form">
      <textarea v-model="input" placeholder="Your message..." class="input" />
      <button :disabled="!isValid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
// import StatusIcon from "./StatusIcon";
import axios from "axios";
import socket from "../socket";

export default {
  name: "MessagePanel",

  props: {
    offer: Object,
  },
  data() {
    return {
      input: "",
      messages: [],
    };
  },

  created() {
    this.resetConnection();
    socket.on("message_received", (data) => {
      this.messages.push(data);
    });
  },

  methods: {
    getMessages() {
      this.messages = [];
      axios
        .get(`http://localhost:3000/api/messages/${this.offer._id}`)
        .then((response) => {
          console.log(response.data);
          this.messages = response.data.messages;
        });
    },
    onSubmit() {
      this.$emit("input", this.input);
      const user_type = socket.auth.user_type;
      this.messages.push({
        content: this.input,
        content_type: "text",
        sender: {
          id: socket.auth.user_id,
          type: user_type,
        },
        recipient: {
          id: this.offer[user_type === "breeder" ? "buyer" : "breeder"]._id,
          type: user_type === "breeder" ? "buyer" : "breeder",
        },
        offer_id: this.offer._id,
      });
      this.input = "";
    },
    isSender(message) {
      const user_type = socket.auth.user_type;
      return message.sender.type == user_type;
    },

    resetConnection(old_offer_id = null) {
      if (old_offer_id) {
        socket.emit("leave_chat", old_offer_id);
      }
      socket.emit("join_chat", this.offer._id);
      this.getMessages();
    },
  },

  watch: {
    offer(newValue, old) {
      if (newValue) {
        this.resetConnection(old._id);
      }
    },
  },

  computed: {
    isValid() {
      return this.input.length > 0;
    },
  },
};
</script>

<style scoped>
.header {
  line-height: 40px;
  padding: 10px 20px;
  border-bottom: 1px solid #dddddd;
}

.messages {
  margin: 0;
  padding: 20px;
}

.message {
  list-style: none;
}

.sender {
  font-weight: bold;
  margin-top: 5px;
}

.form {
  padding: 10px;
}

.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}

.send-button {
  vertical-align: top;
}
</style>
