<template lang="html">

  <div class="chat">
    <h1>chat Component</h1>
    <ul ref="box">
      <chat-msg v-for="(m, idx) in messages" :key="idx" :client="m.client" :msg="m.msg"/>
      <br>
    </ul>
    <section class="login">
      <input type="text" v-model="inputMessage" @keydown.enter="_submit()"/>
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
    this.scrollToBottom();
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
    // eslint-disable-next-line no-unused-vars
    clear() {
      this.messages.clear();
    },
    addMessage : function(client, msg) {
      if (msg.length === 0) {
        return ;
      }
      this.messages.push({"client":client, "msg":msg});
      if (this.messages.length >= this.messageLimit && this.messages.length !== 0) {
        this.messages.shift();
      }
    },
    sendMessage : function(client, msg) {
      if (msg.length === 0) {
        return false;
      }
      //this.addMessage(client, msg);
      return this.onMessageSent(client,msg);
    },

    scrollToBottom() {
      this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
    },

    _submit() {
      this.sendMessage(this.clientId, this.inputMessage);
      this.scrollToBottom();
      this.inputMessage = "";
    }

  },
  computed: {

  }
}


</script>

<style scoped lang="scss">
.chat {

}
ul {
  text-align: left;
  height:300px;
  width:99%;
  border: 1px solid #ccc;
  font:16px/26px Georgia, Garamond, Serif;
  overflow:auto;
  overflow-y:scroll;
}
</style>
