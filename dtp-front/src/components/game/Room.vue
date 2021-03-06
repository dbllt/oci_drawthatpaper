<template>
  <div style="height:100%">
    <div class="w3-container w3-margin-top content">
      <div v-show="connected" class="w3-center" style="height:100%">
        <h1>{{ this.room.name | capitalize }}</h1>
        <p>
          Use this code to join : <b>{{ this.room.id }}</b>
        </p>
        <div>
          <b> Players : </b>
          <span
            v-for="item in this.room.participants.slice(0, 3)"
            :key="item.id"
          >
            {{ item.username }},
          </span>
          <span
            v-if="this.room.participants.length > 3"
            v-on:mouseover="toggleParticipants"
            v-on:mouseleave="toggleParticipants"
          >
            ...
            <div v-if="showParticipants" class="over">
              <p v-for="item in this.room.participants" :key="item.id">
                {{ item.username }}
              </p>
            </div>
          </span>
        </div>
        <chat
          :message-limit="100"
          :placeholder="'Enter message here'"
          ref="chat"
        >
        </chat>
        <div
          v-if="amICreator"
          class="w3-button w3-margin myButton w3-large w3-theme-yellow"
          v-on:click="start"
        >
          Start
        </div>
      </div>
      <div v-show="!connected" class="w3-center">
        <spinner></spinner>
      </div>
    </div>
    <!-- Back button part -->
    <div class="w3-center">
      <div
        class="w3-button myButton w3-margin-bottom w3-theme-red w3-large"
        v-on:click="back"
      >
        Go Back
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "@/components/chat/chat";
import spinner from "@/components/utils/spinner";

import authentication from "@/network/authentication";
export default {
  name: "Room",

  components: {
    Chat,spinner
  },
  data() {
    return {
      room: this.$route.params.room,
      amICreator: false,
      connected: false,
      showParticipants: false,
    };
  },
  methods: {
    start() {
      if (this.room.participants.length >= 2)
        this.$connection.$emit(this.$network_actions.StartGame);
    },
    back() {
      console.log("going back");
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
    toggleParticipants() {
      console.log("toggling");
      this.showParticipants = !this.showParticipants;
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
    onConnectedToRoom(){
      this.connected = true
    }
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
    this.$connection.$on(this.$network_events.ConnectedToRoom, this.onConnectedToRoom);
    this.$connection.$on(this.$ui_events.BackButtonPressed, this.back);
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
    this.$connection.$off(this.$network_events.ConnectedToRoom, this.onConnectedToRoom);
    this.$connection.$off(this.$ui_events.BackButtonPressed, this.back);
  },
  mounted() {
    this.$refs.chat.onMessageSent = (client, msg) => {
      this.$connection.$emit(this.$network_actions.SendMsg, msg);
    };
  },
};
</script>
