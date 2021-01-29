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
    roomCreated(roomMsg) {
      this.$router.push({ name: 'Room', params: {id:roomMsg.id, room: roomMsg} })
    },
    displayError(err) {
      console.log(err)
    }
  },
  created: function() {
    this.$connection.$on(this.$network_events.CreateRoom.success, this.roomCreated)
    this.$connection.$on(this.$network_events.CreateRoom.error, this. displayError)
  },
  beforeDestroy(){
    console.log("before destroy")
    this.$connection.$off(this.$network_events.CreateRoom.success, this.roomCreated)
    this.$connection.$off(this.$network_events.CreateRoom.error, this. displayError)
  }
}
</script>


<style>
</style>
