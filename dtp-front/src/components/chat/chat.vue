<template lang="html">
  <div class="chat">
    <h1>{{ title }}</h1>
    <div>
      <ul ref="box">
        <chat-msg
          v-for="(m, idx) in this.messages"
          :key="idx"
          :client="m.client"
          :msg="m.msg"
        />
        <br />
      </ul>
      <div style="float:left;">
        <p style="font-size:10px;">{{ inputMessage.length }} / 512</p>
      </div>
      <div style="float:right;">
        <button v-on:click="scrollToBottom()">\/</button>
      </div>
    </div>
    <br />
    <div class="w3-content" style="width:75%">
      <input
        placeholder="Send a message to the room"
        class="w3-input w3-round-large w3-border w3-margin-bottom"
        type="text"
        maxlength="512"
        v-model="inputMessage"
        @keydown.enter="_submit()"
      />
    </div>
    <div
      class="w3-button w3-margin-bottom myButton w3-large w3-theme-yellow"
      v-on:click="_submit()"
    >
      Send
    </div>
    <br />
  </div>
</template>

<script lang="js">
import ChatMsg from "./chat-msg.vue";

export default  {
  name: 'chat',
  components: {ChatMsg},
  props: [
    'messageLimit',
    'title'
  ],
  mounted () {
    this.scrollToBottom(0);
  },
  data: function () {
    return {
      inputMessage: "",
      // eslint-disable-next-line no-unused-vars
      onMessageSent: (client, msg) => Boolean,
      messages:[],
      clientId:""
    }
  },
  methods: {
    /**
     * Clear all messages from UI.
     */
    clear() {
      this.messages.clear();
    },
    /**
     * Add directly a message into UI.
     * Message length must be at least 1 to be added.
     * @param client the username that add the message.
     * @param msg the string message added to UI.
     */
    addMessage : function(client, msg) {
      if (msg.length === 0) {
        return ;
      }
      this.messages.push({"client":client, "msg":msg});
      if (this.messages.length >= this.messageLimit && this.messages.length !== 0) {
        this.messages.shift();
      }
    },
    /**
     * Try to sent a message to an handler by using
     * onMessageSent(client, msg) that decide the behaviour.
     * Message length must be at least 1 to be added.
     * @param client the username that add the message.
     * @param msg the string message sent.
     * @returns {BooleanConstructor|boolean}
     */
    sendMessage : function(client, msg) {
      if (msg.length === 0) {
        return false;
      }
      return this.onMessageSent(client,msg);
    },

    /**
     * Called internally to scroll to bottom of <ul ref="box">
     */
    scrollToBottom(ms=100) {
      window.setTimeout(()=>{this.$refs.box.scrollTop = this.$refs.box.scrollHeight;}, ms);
    },

    /**
     * SendMessage using text input value @inputMessage and current client id.
     * @private
     */
    _submit() {
      this.sendMessage(this.clientId, this.inputMessage);
      this.scrollToBottom();
      this.inputMessage = "";
    },
  },
  computed: {

  }
}
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0;
  text-align: left;
  height: 200px;
  width: 99%;
  border: 1px solid #ccc;
  background-color: #00000012;
  font: 16px/26px Georgia, Garamond, Serif;
  overflow: auto;
  overflow-y: scroll;
  scroll-behavior: smooth;
  list-style: none;
}
.login {
  display: inline-block;
}
</style>
