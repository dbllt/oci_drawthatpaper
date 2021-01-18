<template>
  <div>
    <h1>Draw That Paper</h1>

    <h2>{{gameId}}</h2>
    <p>Use this code to join</p>


    <button  type="button" class="block" v-on:click="start">Start</button>
    <button  type="button" class="block" v-on:click="back">Go Back</button>
  </div>

</template>


<script>
export default {
  name: 'CreateGame',
  data(){
    return {
      gameId: -1,
    }
  },
  methods: {
    generateId: function(){
      this.gameId= -1;
    },
    start: function () {

      this.$parent.startGame(this.gameId);
    },
    back: function () {

      this.$parent.goHome();
    }
  }
}
</script>

