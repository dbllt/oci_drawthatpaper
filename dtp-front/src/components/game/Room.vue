<template>
  <div>
    <h1>Draw That Paper</h1>

    <h2>{{this.$route.params.room.id}}</h2>
    <p>Use this code to join</p>

    <button type="button" class="block" v-on:click="start">Start</button>
    <button type="button" class="block" v-on:click="back">Go Back</button>

    <ul>
    <li v-for="item in this.$route.params.room.participants" :key="item.name">
      {{ item.name }}
    </li>
    </ul>

  </div>

</template>


<script>
export default {
  name: 'Room',
  data(){
    return {
      gameId: -1,
    }
  },
  methods: {
    start: function () {

      this.$router.push('/game/'+this.gameId)
    },
    back: function () {
    console.log(this.$route.params.room.participants);
      this.$router.push('/menu')
    },
    participants: function(){

    }
  }
}
</script>

