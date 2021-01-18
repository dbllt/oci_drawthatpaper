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

      this.$router.push("/create");
    },
    join: function () {

      this.$router.push("/join");
    },

  }
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