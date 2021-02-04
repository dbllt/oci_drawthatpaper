<template>
  <div style="height:100%">
    <div class="w3-container w3-margin-top content">
      <div class="w3-center">
        <h1>Draw That Paper</h1>
        <!-- When creating a game -->
        <template v-if="creatingRoom">
          <h3>Name of your game :</h3>
          <div class="w3-content" style="width:75%">
            <label>
              <input
                class="w3-input w3-round-large w3-border w3-margin-bottom"
                placeholder="Enter a name"
                v-model="gameName"
                v-on:keyup.enter="validateName"
              />
            </label>
          </div>
          <br />
          <div
            class="w3-button w3-margin myButton w3-large w3-theme-yellow "
            v-on:click="validateName"
          >
            Create
          </div>
        </template>

        <!-- Menu -->
        <template v-else>
          <br />
          <div
            class="w3-button w3-margin-bottom myButton big w3-large w3-theme-yellow"
            v-on:click="toggleCreateRoom"
          >
            Create Game
          </div>
          <br />
          <br />
          <div
            class="w3-button w3-margin-bottom myButton big w3-large w3-theme-yellow "
            v-on:click="join"
          >
            Join Game
          </div>
        </template>
      </div>
    </div>
    <!-- Back button part -->
    <div class="w3-center">
      <div
        v-if="creatingRoom"
        class="w3-button myButton w3-margin-bottom w3-theme-red w3-large"
        v-on:click="toggleCreateRoom"
      >
        Go Back
      </div>
      <div
        v-else
        class="w3-button myButton w3-margin-bottom w3-theme-red w3-large"
        v-on:click="logout"
      >
        Log Out
      </div>
    </div>
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
