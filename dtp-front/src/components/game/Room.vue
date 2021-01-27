<template>
  <div>
    <h1>Draw That Paper</h1>

    <h2>{{this.$route.params.room.id}}</h2>
    <p>Use this code to join</p>

    <button type="button" class="block" v-on:click="start">Start</button>
    <button type="button" class="block" v-on:click="back">Go Back</button>

    <ul>
    <li v-for="item in this.$route.params.room.participants" :key="item.name">
      {{ item.name }}
    </li>
    </ul>
    <chat :message-limit="100" :placeholder="'Enter message here'" :title="'Game Chat'" ref="chat">
    </chat>

  </div>

</template>


<script>

import Chat from "@/components/chat/chat";
export default {
  name: 'Room',

  components: {
    Chat
  },
  data(){
    return {
      gameId: -1,
    }
  },
  methods: {
    start: function () {

      this.$router.push('/game/'+this.gameId)
    },
    back: function () {
    console.log(this.$route.params.room.participants);
      this.$router.push('/menu')
    },
    participants: function(){

    }
  },
  mounted() {
    this.$refs.chat.clientId = "A0123456";
    this.$refs.chat.onMessageSent = (client,msg) => {
      //send to api
      //socket.send(client, msg);
      this.$connection.$emit(this.$network_actions.SendMsg, {"client":  client, "msg": msg})
      //send directly to ui
      //this.$refs.chat.addMessage(client,msg);
    };

    this.$connection.$on(this.$network_events.ReceiveMsg, (packet) => {
      this.$refs.chat.addMessage(packet.client, packet.msg);
    });
  }
}
</script>

