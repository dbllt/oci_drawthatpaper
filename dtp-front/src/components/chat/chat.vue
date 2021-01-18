<template lang="html">

  <div class="chat">
    <h1>chat Component</h1>
    <div>
      <ul ref="box">
        <chat-msg v-for="(m, idx) in this.messages" :key="idx" :client="m.client" :msg="m.msg"/>
        <br>
      </ul>
      <div style="float:left;">
        <p>{{inputMessage.length}} / 512</p>
      </div>
      <div style="float:right;">
        <button v-on:click="scrollToBottom()">\/</button>
      </div>
    </div>
    <section class="login">
      <input type="text" maxlength="512" v-model="inputMessage" @keydown.enter="_submit()"/>
      <button v-on:click="_submit()">Send</button>
    </section>
  </div>

</template>

<script lang="js">
import ChatMsg from "./chat-msg.vue";

export default  {
  name: 'chat',
  components: {ChatMsg},
  props: [
    'messageLimit',
  ],
  mounted () {
    this.scrollToBottom(0);
  },
  data () {
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
.chat {

}
ul {
  margin: 0;
  padding: 0;
  text-align: left;
  height:300px;
  width:99%;
  border: 1px solid #ccc;
  font:16px/26px Georgia, Garamond, Serif;
  overflow:auto;
  overflow-y:scroll;
  scroll-behavior: smooth;
  list-style: none;
}
</style>
