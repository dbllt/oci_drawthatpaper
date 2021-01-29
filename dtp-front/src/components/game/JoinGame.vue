<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <h3>Game ID :</h3>
    <label>
      <input v-model="gameId" v-on:keyup.enter="joinRoom">
    </label>

    <h3>Available rooms :</h3>
    <div class="roomList">
      <div v-for="item in this.rooms" :key="item.name">
        <button type="button" class="block" v-on:click=joinSpecificRoom(item.id)>Join Room {{ item.id }}</button>
      </div>
    </div>

    <button type="button" class="block" v-on:click="back">Go Back</button>
  </div>

</template>


<script>
export default {
  name: 'JoinGame',
  data: function () {
    return {gameId: "", rooms: []}
  },
  methods: {

    joinRoom: function () {
      this.$connection.$emit(this.$network_actions.JoinRoom, this.gameId.toString());
    },

    joinSpecificRoom: function (id) {
      this.$connection.$emit(this.$network_actions.JoinRoom, id.toString());
    },

    back: function () {

      this.$router.push('/menu')
    },

    listRooms: function () {
      this.$connection.$emit(this.$network_actions.GetAllRooms);
    }
  },
  created: function () {
    this.$connection.$on(this.$network_events.JoinRoom.success, (roomMsg) => {

      this.$router.push({name: 'Room', params: {id: this.gameId, room: roomMsg}})
    }),
        this.$connection.$on(this.$network_events.JoinRoom.error, (msg) => {

          console.log(msg);
        });
    this.listRooms();

    this.$connection.$on(this.$network_events.GetAllRooms.success, (rooms) => {
      this.rooms = rooms;
    });
    this.$connection.$on(this.$network_events.GetAllRooms.error, () => {
      console.log("something went wrong");
    });
  },
}
</script>

<style>
.roomList{

  border-style: solid;
  border-width: 1px;
  border-color:#fed766;
  min-height: 200px;
  height: 200px;
  overflow: scroll;
  overflow-x: hidden;
}
</style>
