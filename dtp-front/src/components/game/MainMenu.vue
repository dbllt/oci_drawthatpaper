<template>
  <div>
    <h1>Draw That Paper</h1>
      <button  type="button" class="block" v-on:click="create">Create Game</button>
      <button  type="button" class="block" v-on:click="join">Join Game</button>

  </div>

</template>


<script>
export default {
  name: 'MainMenu',

  data(){
    return {
    }
  },
  methods: {
    create: function () {
      let text = " "
      let chars = "abcdefghijklmnopqrstuvwxyz"

      for( let i=0; i < 5; i++ ) {
        text += chars.charAt(Math.floor(Math.random() * chars.length))
      }

      this.$connection.$emit(this.$network_actions.CreateRoom, {
            name:text
        });
    },
    join: function () {

      this.$router.push("/join");
    },
  },
  created: function() {
    this.$connection.$on(this.$network_events.CreateRoom.success, (roomMsg) => {
      this.$router.push({ name: 'Room', params: {id:roomMsg.id, room: roomMsg} })
    });
    this.$connection.$on(this.$network_events.CreateRoom.error, () => {
     console.log("something went wrong");
    });
  },
}
</script>


<style>
body {
  background-color: #2ab7ca;
}

h1 {
  color: #e6e6ea;
}
.block {
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 26px;
  cursor: pointer;

  margin: 5% auto;
  padding: 2% 10% 2% 10%;
  width: 30%;
  border-radius: 8px;

}


.block:hover {
  color: white;
}
</style>