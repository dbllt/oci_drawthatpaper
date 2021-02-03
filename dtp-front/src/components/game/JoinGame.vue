<template>

  <div class="w3-container w3-center">
    <h1>Draw That Paper</h1>
    <br/>
    <h3>Game ID :</h3>
    <label>
      <input v-model="gameId" v-on:keyup.enter="joinRoom"/>
    </label><br>

    <div class="w3-button w3-margin myButton w3-large w3-theme-yellow" v-on:click="joinRoom">Join</div>

    <h3>Available rooms : <a href="#" v-on:click="getRooms">refresh</a></h3>
    <b v-if="error" class="error">{{ error }}</b>
    <div class="roomList">
      <div v-for="item in this.rooms" :key="item.name">
        <template v-if="!item.started">
          <div class="w3-button w3-margin myButton w3-large w3-theme-yellow"
               v-on:click="joinSpecificRoom(item.id)">
            Join
            <br/>
            <div style="font-size: 18px;" class="text">
              {{ item.name }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="w3-button w3-margin myButton w3-large w3-theme-red" v-on:click="back">Go Back</div>
  </div>
</template>

<script>
export default {
  name: "JoinGame",
  data() {
    return {gameId: "", rooms: [], roomToJoin: "", error: ""};
  },
  methods: {
    joinRoom() {
      this.roomToJoin = this.gameId;
      this.$connection.$emit(
          this.$network_actions.JoinRoom,
          this.gameId.toString()
      );
      this.err = "";
    },
    joinSpecificRoom(id) {
      this.roomToJoin = id;
      this.$connection.$emit(this.$network_actions.JoinRoom, id.toString());
    },
    back() {
      this.$router.push("/menu");
    },
    onJoinRoom(roomMsg) {
      this.$router.push({
        name: "Room",
        params: {id: this.roomToJoin, room: roomMsg},
      });
    },
    onGetAllRoom(rooms) {
      this.rooms = rooms;
    },
    getRooms() {
      this.$connection.$emit(this.$network_actions.GetAllRooms);
    },
    onJoinRoomError(err) {
      this.displayError(err);
      this.error = err;
      this.getRooms();
    },
    displayError(err) {
      console.log(err);
      this.error = err;
    },
  },
  created() {
    this.$connection.$on(
        this.$network_events.JoinRoom.success,
        this.onJoinRoom
    );
    this.$connection.$on(
        this.$network_events.JoinRoom.error,
        this.onJoinRoomError
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
        this.onJoinRoomError
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
