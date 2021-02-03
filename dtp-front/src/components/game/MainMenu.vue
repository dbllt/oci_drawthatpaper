<template>
  <div class="w3-container w3-center">
    <h1>Draw That Paper</h1>
    <template v-if="!creatingRoom">
      <div class="">
        <br>
        <br>
        <br>
        <br>
        <br>
        <div class="w3-button w3-margin myButton w3-large w3-theme-yellow" v-on:click="toggleCreateRoom">
          Create Game
        </div>
        <br>
        <br>
        <div class="w3-button w3-margin  myButton w3-large w3-theme-yellow " v-on:click="join">Join Game</div>
        <br>
        <br>
        <div class="w3-button w3-margin myButton w3-large w3-theme-red " v-on:click="logout">Log Out</div>
      </div>
    </template>
    <template v-else>
      <div class="w3-display-middle">
        <h3>Name of your game :</h3>
        <label>
          <input v-model="gameName" v-on:keyup.enter="validateName"/>
          <br/>
        </label>
        <div class="w3-button w3-margin myButton w3-large w3-theme-yellow " v-on:click="validateName">
          Create
        </div>
        <br/>
        <div class="w3-button w3-margin myButton w3-large w3-theme-red" v-on:click="toggleCreateRoom">
          Go Back
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "MainMenu",

  data() {
    return {
      creatingRoom: false,
      gameName: "",
    };
  },
  methods: {
    toggleCreateRoom() {
      this.creatingRoom = !this.creatingRoom;
    },
    validateName() {
      if (this.gameName)
        this.$connection.$emit(this.$network_actions.CreateRoom, {
          name: this.gameName,
        });
    },
    join() {
      this.$router.push("/join");
    },
    logout() {
      this.$connection.$emit(this.$network_actions.Logout);
    },
    onLogout() {
      this.$router.push("/");
    },
    roomCreated(roomMsg) {
      this.$router.push({
        name: "Room",
        params: {id: roomMsg.id, room: roomMsg},
      });
    },
    displayError(err) {
      console.log(err);
    },
  },
  created() {
    this.$connection.$on(
        this.$network_events.CreateRoom.success,
        this.roomCreated
    );
    this.$connection.$on(
        this.$network_events.CreateRoom.error,
        this.displayError
    );
    this.$connection.$on(this.$network_events.Logout, this.onLogout);
  },
  beforeDestroy() {
    this.$connection.$off(
        this.$network_events.CreateRoom.success,
        this.roomCreated
    );
    this.$connection.$off(
        this.$network_events.CreateRoom.error,
        this.displayError
    );
    this.$connection.$off(this.$network_events.Logout, this.onLogout);
  },
};
</script>

