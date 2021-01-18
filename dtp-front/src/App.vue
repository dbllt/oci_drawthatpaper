<template>
  <div id="app">
    <component :is="currentComponent"></component>
  </div>
</template>




<script>
import MainMenu from "@/components/MainMenu";
import CreateGame from "@/components/CreateGame";
import JoinGame from "@/components/JoinGame";
import Game from "@/components/Game";
export default {
  name: 'app',
  data() {
    return {
      currentComponent: 'MainMenu'
    }
  },
  methods: {
    create: function () {
      this.$router.push('CreateGame')

      this.currentComponent= 'CreateGame'

    },
    join: function () {
      this.$router.push('JoinGame')
      this.currentComponent= 'JoinGame'
    },

    startGame: function (id) {
      this.$router.push('game_'+id)
      this.currentComponent= 'Game'
    },

    goHome: function () {
      this.$router.push('/')
      this.currentComponent= 'MainMenu'
    }
  },
  components: {
    MainMenu,
    CreateGame,
    JoinGame,
    Game
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>