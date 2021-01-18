<template lang="html">

  <div class="chat">
    <h1>chat Component</h1>
    <ul style="height:300px;width:99%;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:auto;">
      <chat-msg v-for="m in messages" :key="m" :client="m.client" :msg="m.msg"/>
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
    for (let i = 0; i < 200; i++) {
      this.addMessage("Max", i.toString());
    }
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
      this.messages.push({"client":client, "msg":msg});
      if (this.messages.length >= this.messageLimit && this.messages.length !== 0) {
        this.messages.shift();
      }
    },
    sendMessage : function(client, msg) {
      if (this.onMessageSent) {
        return this.onMessageSent(client,msg);
      }
      /*if (this.onMessageSent(client, msg)) {
        return this.onMessageSent(client, msg);
      }*/
      return false;
    },

    _submit() {
      this.sendMessage(this.clientId, this.inputMessage);
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
}
</style>
