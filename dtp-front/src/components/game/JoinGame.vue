<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <h3>Game ID :</h3>
    <input v-model="gameId" v-on:keyup.enter="joinRoom">
    <button  type="button" class="block" v-on:click="back">Go Back</button>

      <div v-for="item in this.rooms" :key="item.name">
        <button  type="button" class="block" v-on:click=joinSpecificRoom(item.id)>Join Room {{ item.name }}</button>
      </div>
  </div>

</template>


<script>
export default {
  name: 'JoinGame',
  data : function(){
    return {gameId:"",rooms:[]}
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

    listRooms: function(){
      this.$connection.$emit(this.$network_actions.GetAllRooms);
    }
  },
  created: function() {
    this.$connection.$on(this.$network_events.JoinRoom.success, (roomMsg) => {

      this.$router.push({ name: 'Room', params: {id:this.gameId, room: roomMsg} })
    }),
        this.$connection.$on(this.$network_events.JoinRoom.error, (msg) => {

      console.log(msg);
    });
    this.listRooms();

    this.$connection.$on(this.$network_events.GetAllRooms.success, (rooms) => {
      this.rooms=rooms;
    });
    this.$connection.$on(this.$network_events.GetAllRooms.error, () => {
      console.log("something went wrong");
    });
  },
}
</script>

<style>
input{
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 20px;

  margin: 5% auto;
  padding: 2% 5% 2% 5%;
  width: 30%;
  border-radius: 8px;

}
</style>