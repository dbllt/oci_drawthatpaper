<template>
  <div style="height:100%">
    <div class="w3-container w3-margin-top content">
      <div class="w3-center">
        <h1>Draw That Paper</h1>
        <h3>Game ID :</h3>
        <div class="w3-content" style="width:75%">
          <label>
            <input
              class="w3-input w3-round-large w3-border w3-margin-bottom"
              placeholder="Enter a game ID"
              v-model="gameId"
              v-on:keyup.enter="joinRoom"
            />
          </label>
        </div>
        <div
          class="w3-button w3-margin myButton w3-large w3-theme-yellow"
          v-on:click="joinRoom"
        >
          Join
        </div>
        <div v-if="loading">
          <spinner></spinner>
        </div>
        <div>
          <b v-if="error" class="error">{{ error }}</b>
        </div>
        <h3>Available rooms : <a href="#" v-on:click="getRooms">refresh</a></h3>
        <div v-if="roomsAvailable()">No room available at the moment</div>
        <div v-else class="roomList">
          <div v-for="item in this.rooms" :key="item.name">
            <template v-if="!item.started">
              <div
                class="w3-button w3-margin myButton w3-large w3-theme-yellow"
                v-on:click="joinSpecificRoom(item.id)"
              >
                Join
                <br />
                <div style="font-size: 18px;" class="text">
                  {{ item.name }}
                </div>
              </div>
            </template>
          </div>
        </div>
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
import spinner from "@/components/utils/spinner";

export default {
  name: "JoinGame",
  components: {
    spinner,
  },
  data() {
    return {
      gameId: "",
      rooms: [],
      roomToJoin: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    joinRoom() {
      this.loading = true;
      this.roomToJoin = this.gameId;
      this.$connection.$emit(
        this.$network_actions.JoinRoom,
        this.gameId.toString()
      );
      this.err = "";
    },
    roomsAvailable() {
      return this.rooms.filter((r) => !r.started).length == 0;
    },
    joinSpecificRoom(id) {
      this.roomToJoin = id;
      this.$connection.$emit(this.$network_actions.JoinRoom, id.toString());
    },
    back() {
      this.$router.push("/menu");
    },
    onJoinRoomSuccess(roomMsg) {
      this.loading = false;
      this.$router.push({
        name: "Room",
        params: { id: this.roomToJoin, room: roomMsg },
      });
    },
    onGetAllRoom(rooms) {
      this.rooms = rooms;
    },
    getRooms() {
      this.$connection.$emit(this.$network_actions.GetAllRooms);
    },
    onJoinRoomError(err) {
      this.loading = false;
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
      this.onJoinRoomSuccess
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
      this.onJoinRoomSuccess
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
