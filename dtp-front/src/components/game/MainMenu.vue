<template>
  <div>
    <h1>Draw That Paper</h1>
    <template v-if="!creatingRoom">
      <button type="button" class="block" v-on:click="createRoom">
        Create Game
      </button>
      <button type="button" class="block" v-on:click="join">Join Game</button>
    </template>
    <template v-else>
      <h3>Name of your game :</h3>
      <label>
        <input v-model="gameName" v-on:keyup.enter="validateName" />
      </label>
      <button type="button" class="block" v-on:click="validateName">Create</button>
    </template>
    <br />
    <button type="button" class="block" v-on:click="logout">Log Out</button>
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
    createRoom() {
      this.creatingRoom = true;

      // let text = " ";
      // let chars = "abcdefghijklmnopqrstuvwxyz";

      // for (let i = 0; i < 5; i++) {
      //   text += chars.charAt(Math.floor(Math.random() * chars.length));
      // }
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
        params: { id: roomMsg.id, room: roomMsg },
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

<style></style>
