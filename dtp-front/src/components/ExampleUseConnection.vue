<template>
  <div>
    <ul>
      <li v-for="m in msgs" :key="m.id">
        {{ m }}
      </li>
    </ul>
    <input v-model="message" />
    <button v-on:click="clickButton()">Send</button>
    <button v-on:click="register()">Register</button>
    <button v-on:click="login()">login</button>
    <button v-on:click="loginError()">login wrong password</button>
  </div>
</template>

<script>
export default {
  name: "ExampleUseConnection",
  props: {
    msg: String,
  },
  data: function() {
    return {
      message: "",
      msgs: [],
    };
  },
  methods: {
    clickButton: function() {
      console.log("sending");
      this.$connection.$emit(this.$network_actions.SendMsg, this.message);
    },
    register: function() {
      this.$connection.$emit(this.$network_actions.Register, {
        username: "John",
        email: "test@test.com",
        password: "something",
      });
    },
    loginError: function() {
      this.$connection.$emit(this.$network_actions.Login, {
        email: "test@test.com",
        password: "password",
      });
    },
    login: function() {
      this.$connection.$emit(this.$network_actions.Login, {
        email: "test@test.com",
        password: "something",
      });
    },
  },
  created: function() {
    this.$connection.$on(this.$network_events.ReceiveMsg, (msg) => {
      this.msgs.push(msg);
    });
    this.$connection.$on(this.$network_events.Register.success, (msg) => {
      this.msgs.push(msg);
    });
    this.$connection.$on(this.$network_events.Register.error, (msg) => {
      this.msgs.push("error "+msg);
    });
    this.$connection.$on(this.$network_events.Login.success, (msg) => {
      this.msgs.push(msg);
    });
    this.$connection.$on(this.$network_events.Login.error, (msg) => {
      this.msgs.push("error "+msg);
    });
  },
};
</script>
