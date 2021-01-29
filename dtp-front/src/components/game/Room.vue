<template>
  <div>
    <h1>Draw That Paper</h1>

    <h2>{{this.room.id}}</h2>
    <p>Use this code to join</p>

    <button type="button" class="block" v-on:click="start">Start</button>
    <button type="button" class="block" v-on:click="back">Go Back</button>

    <div>
      <h4>Players :</h4>
    <p v-for="item in this.room.participants" :key="item.id">
      {{ item.username }}
    </p>
    </div>
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
      room: this.$route.params.room,
    }
  },
  methods: {
    start: function () {

      this.$router.push('/game/'+this.$route.params.room.id)
    },
    back: function () {
      this.$router.push('/menu')
    },
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
    this.$connection.$on(this.$network_events.NewUserInRoom, () => {
      if (this.room) {
        this.$connection.$emit(
            this.$network_actions.GetOneRoom,
            this.room.id
        );
      }
    });
    this.$connection.$on(this.$network_events.GetOneRoom.success, (msg) => {
      this.room = msg;
    });
    this.$connection.$on(this.$network_events.GetOneRoom.error, (msg) => {
      console.log("error " + msg);
    });
  }
}
</script>

