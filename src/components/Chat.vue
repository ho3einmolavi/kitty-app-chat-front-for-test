<template>
  <div class="container">
    <div class="left-panel">
      <div class="title" v-if="unread_offers_count">
        <h4
          v-for="(key, index) in Object.keys(unread_offers_count)"
          :key="index" 
          @click="getOffers(key)"
        >
          {{ key }} +{{ unread_offers_count[key].count }}
        </h4>
      </div>
      <div v-else>
        <h4
          v-for="(key, index) in ['pending', 'accepted', 'rejected']"
          :key="index"
          @click="getOffers(key)"
        >
          {{ key }}
        </h4>
      </div>
      <hr />
      <offer
        v-for="offer in offers"
        :key="offer._id"
        :offer="offer"
        @select="onSelectOffer(offer)"
      />
      <hr />
    </div>
    <message-panel
      v-if="selectedOffer"
      :offer="selectedOffer"
      @input="onMessage"
      class="right-panel"
    />
  </div>
</template>

<script>
import socket from "../socket";
import offer from "./Offer";
import MessagePanel from "./MessagePanel";
import axios from "axios";

export default {
  name: "Chat",
  components: { offer, MessagePanel },
  data() {
    return {
      selectedOffer: null,
      offers: [],
      unread_offers_count: null,
    };
  },
  methods: {
    onMessage(content) {
      if (this.selectedOffer) {
        const type = socket.auth.user_type;
        socket.emit("sendMessage", {
          content_type: "text",
          content,
          sender: {
            id: socket.auth.user_id,
            type,
          },
          recipient: {
            id: this.selectedOffer[type === "breeder" ? "buyer" : "breeder"]
              ._id,
            type: type === "breeder" ? "buyer" : "breeder",
          },
          offer_id: this.selectedOffer._id,
        });
        // this.selectedUser.messages.push({
        //   content,
        //   fromSelf: true,
        // });
      }
    },
    onSelectOffer(offer) {
      this.selectedOffer = offer;
      console.log(this.selectedOffer);
    },
    getOffers(type) {
      this.offers = [];
      if (type == "pending") {
        type = 0;
      } else if (type == "accepted") {
        type = 1;
      } else if (type == "rejected") {
        type = 2;
      }
      if (socket.auth.user_type === "buyer") {
        axios
          .get(`http://localhost:4000/api/buyer/cat/offers/by-status/${type}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                `${socket.auth.user_type}_token`
              )}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.offers = response.data.data.offers;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .get(`http://localhost:4000/api/breeder/offer/by-status/${type}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                `${socket.auth.user_type}_token`
              )}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.offers = response.data.data.offers;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  created() {
    socket.on("connect", () => {
      if (socket.auth.user_type === "breeder") {
        axios
          .get("http://localhost:4000/api/breeder/offer/by-status/0", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                `${socket.auth.user_type}_token`
              )}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.offers = response.data.data.offers;
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .get("http://localhost:4000/api/breeder/offer/unreed/count", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                `${socket.auth.user_type}_token`
              )}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.unread_offers_count = response.data.data.unread_offers;
            console.log(this.unread_offers_count);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .get(`http://localhost:4000/api/buyer/cat/offers/by-status/0`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem(
                `${socket.auth.user_type}_token`
              )}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            this.offers = response.data.data.offers;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    socket.on("disconnect", () => {
      // this.users.forEach((user) => {
      //   if (user.self) {
      //     user.connected = false;
      //   }
      // });
    });

    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };

    socket.on("chat_list", (users) => {
      users.forEach((user) => {
        // user.messages.forEach((message) => {
        //   message.fromSelf = message.from === socket.userID;
        // });
        // for (let i = 0; i < this.users.length; i++) {
        //   const existingUser = this.users[i];
        //   if (existingUser.userID === user.userID) {
        //     existingUser.connected = user.connected;
        //     existingUser.messages = user.messages;
        //     return;
        //   }
        // }
        // user.self = user.userID === socket.userID;
        // initReactiveProperties(user);
        // this.users.push(user);
        this.users.push({
          full_name: user.buyer_info.full_name,
        });
      });
      // put the current user first, and sort by username
      this.users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
    });

    socket.on("user connected", (user) => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      this.users.push(user);
    });

    socket.on("user disconnected", (id) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        if (user.userID === id) {
          user.connected = false;
          break;
        }
      }
    });

    socket.on("private message", ({ content, from, to }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            content,
            fromSelf,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  destroyed() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
  },
};
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
