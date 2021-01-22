<template>
  <div>
    <ul>
      <li v-for="m in msgs" :key="m.id">
        {{ m }}
      </li>
    </ul>
    <input v-model="message" />
    <button v-on:click="clickButton()">Send</button>
    <!-- <button v-on:click="register()">Register</button>
    <button v-on:click="register2()">Register2</button>
    <button v-on:click="login()">login</button>
    <button v-on:click="login2()">login2</button> -->
    <button v-on:click="createRoom()">create room</button>
    <button v-on:click="joinRoom()">join room</button>
    <!-- <button v-on:click="loginError()">login wrong password</button> -->
    <!-- <button v-on:click="connectToChat()">Connect To Chat</button> -->
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
      this.$connection.$emit(this.$network_actions.SendMsg, this.message);
    },
    joinRoom: function() {
      this.$connection.$emit(this.$network_actions.JoinRoom, 1);
    },
    register: function() {
      this.$connection.$emit(this.$network_actions.Register, {
        username: "John",
        email: "test@test.com",
        password: "something",
      });
    },
    register2: function() {
      this.$connection.$emit(this.$network_actions.Register, {
        username: "Kylo",
        email: "testtest@test.com",
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
    login2: function() {
      this.$connection.$emit(this.$network_actions.Login, {
        email: "testtest@test.com",
        password: "something",
      });
    },
    connectToChat: function() {
      this.$connection.$emit(this.$network_actions.ConnectToChat);
    },
    createRoom: function() {
      this.$connection.$emit(this.$network_actions.CreateRoom, {
        name:"chat room 1"
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
      this.msgs.push("Logged in"+msg);
    });
    this.$connection.$on(this.$network_events.Login.error, (msg) => {
      this.msgs.push("error "+msg);
    });
    this.$connection.$on(this.$network_events.CreateRoom.success, (msg) => {
      this.msgs.push(msg);
    });
    this.$connection.$on(this.$network_events.CreateRoom.error, (msg) => {
      this.msgs.push("error "+msg);
    });
  },
};
</script>
