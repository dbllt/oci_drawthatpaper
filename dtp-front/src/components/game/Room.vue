<template>
  <div>
    <h1>Draw That Paper</h1>

    <h2>{{ this.room.name }}</h2>
    <p>
      Use this code to join : <b>{{ this.room.id }}</b>
    </p>

    <button  v-if="amICreator" type="button" class="block" v-on:click="start">Start</button>
    <button type="button" class="block" v-on:click="back">Go Back</button>

    <div>
      <h4>Players :</h4>
      <p v-for="item in this.room.participants" :key="item.id">
        {{ item.username }}
      </p>
    </div>
    <chat
      :message-limit="100"
      :placeholder="'Enter message here'"
      :title="'Game Chat'"
      ref="chat"
    >
    </chat>
  </div>
</template>

<script>
import Chat from "@/components/chat/chat";
import authentication from "@/network/authentication"
export default {
  name: "Room",

  components: {
    Chat,
  },
  data() {
    return {
      room: this.$route.params.room,
      amICreator: false,
    };
  },
  methods: {
    start() {
      if (this.room.participants.length >= 2)
        this.$connection.$emit(this.$network_actions.StartGame);
    },
    back() {
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
    onParticipantsUpdated() {
      if (this.room) {
        this.$connection.$emit(this.$network_actions.GetOneRoom, this.room.id);
      }
    },
    onReceiveMsg(packet) {
      this.$refs.chat.addMessage(packet.username, packet.msg);
    },
    onGetOneRoom(data) {
      this.room = data;
      console.log(data);
      this.amICreator = authentication.isMe(data.creator.id);
    },
    displayError(err) {
      console.log(err);
    },
    onStartGame() {
      this.$router.push("/game/" + this.$route.params.room.id);
    },
  },
  created() {
    this.$connection.$on(
      this.$network_events.ParticipantsUpdated,
      this.onParticipantsUpdated
    );
    this.$connection.$on(this.$network_events.ReceiveMsg, this.onReceiveMsg);
    this.$connection.$on(
      this.$network_events.GetOneRoom.success,
      this.onGetOneRoom
    );
    this.$connection.$on(
      this.$network_events.GetOneRoom.error,
      this.displayError
    );
    this.$connection.$on(this.$network_events.StartGame, this.onStartGame);
  },
  beforeDestroy() {
    this.$connection.$off(
      this.$network_events.ParticipantsUpdated,
      this.onParticipantsUpdated
    );
    this.$connection.$off(this.$network_events.ReceiveMsg, this.onReceiveMsg);
    this.$connection.$off(
      this.$network_events.GetOneRoom.success,
      this.onGetOneRoom
    );
    this.$connection.$off(
      this.$network_events.GetOneRoom.error,
      this.displayError
    );
    this.$connection.$off(this.$network_events.StartGame, this.onStartGame);
  },
  mounted() {
    this.$refs.chat.onMessageSent = (client, msg) => {
      this.$connection.$emit(this.$network_actions.SendMsg, msg);
    };
  },
};
</script>
