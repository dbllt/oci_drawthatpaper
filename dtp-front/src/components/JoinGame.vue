<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <h3>Game ID :</h3>
    <input v-model="gameId" v-on:keyup.enter="validateId">
    <button  type="button" class="block" v-on:click="back">Go Back</button>

  </div>

</template>


<script>
export default {
  name: 'JoinGame',
  data : function(){
    return {gameId:""}
  },
  methods: {

    validateId: function () {
      this.$parent.startGame(this.gameId)
    },

    back: function () {

      this.$parent.goHome();
    }
  }
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