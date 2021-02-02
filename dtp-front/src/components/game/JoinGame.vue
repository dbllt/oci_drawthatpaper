<template>
  <div>
    <h1>Draw That Paper</h1>
    <br />
    <h3>Game ID :</h3>
    <label>
      <input v-model="gameId" v-on:keyup.enter="joinRoom" />
      <button type="button" class="block" v-on:click="joinRoom">Join</button>
    </label>

    <h3>Available rooms :</h3>
    <div class="roomList">
      <div v-for="item in this.rooms" :key="item.name">
        <button
          type="button"
          class="block"
          v-on:click="joinSpecificRoom(item.id)"
        >
          Join
          <br>
          <div style="font-size: 18px;" class="text"> 
           {{ item.name }}
          </div>
        </button>
      </div>
    </div>

    <button type="button" class="block" v-on:click="back">Go Back</button>
  </div>
</template>

<script>
export default {
  name: "JoinGame",
  data() {
    return { gameId: "", rooms: [],roomToJoin:"" };
  },
  methods: {
    joinRoom() {
      this.roomToJoin=this.gameId
      this.$connection.$emit(
        this.$network_actions.JoinRoom,
        this.gameId.toString()
      );
    },
    joinSpecificRoom(id) {
      this.roomToJoin=id
      this.$connection.$emit(this.$network_actions.JoinRoom, id.toString());
    },
    back() {
      this.$router.push("/menu");
    },
    onJoinRoom(roomMsg) {
      this.$router.push({
        name: "Room",
        params: { id: this.roomToJoin, room: roomMsg },
      });
    },
    onGetAllRoom(rooms) {
      this.rooms = rooms;
    },
    displayError(err) {
      console.log(err);
    },
  },
  created() {
    this.$connection.$on(
      this.$network_events.JoinRoom.success,
      this.onJoinRoom
    );
    this.$connection.$on(
      this.$network_events.JoinRoom.error,
      this.displayError
    );

    // Emit get all rooms to get information for the component
    this.$connection.$emit(this.$network_actions.GetAllRooms);
    this.$connection.$on(
      this.$network_events.GetAllRooms.success,
      this.onGetAllRoom
    );

    this.$connection.$on(
      this.$network_events.GetAllRooms.error,
      this.displayError
    );
  },
  beforeDestroy() {
    this.$connection.$off(
      this.$network_events.JoinRoom.success,
      this.onJoinRoom
    );
    this.$connection.$off(
      this.$network_events.JoinRoom.error,
      this.displayError
    );

    this.$connection.$off(
      this.$network_events.GetAllRooms.success,
      this.onGetAllRoom
    );

    this.$connection.$off(
      this.$network_events.GetAllRooms.error,
      this.displayError
    );
  },
};
</script>
