<template>
  <div class="select-username">
    <form @submit.prevent="onSubmit">
      <input v-model="user_id" placeholder="Your username..." />
      <select v-model="user_type">
        <option value="breeder">breeder</option>
        <option value="buyer">buyer</option>
      </select>
      <button :disabled="!isValid">Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "SelectUsername",
  data() {
    return {
      user_id: "6288cf986dbc0775358e6990",
      user_type: "breeder",
    };
  },
  computed: {
    isValid() {
      return this.user_id.length > 2;
    },
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.user_id, this.user_type);
    },
  },
};
</script>

<style scoped>
.select-username {
  width: 300px;
  margin: 200px auto 0;
}
</style>
