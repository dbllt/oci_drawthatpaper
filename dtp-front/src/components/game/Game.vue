<template>
  <div>
    <h1>Draw That Paper</h1>
    <h2>{{this.gameState}}</h2>
    <div>
      <div class="wordToDraw">
        <div class="vertical-center">
        <h3>Your word :</h3>
        <br>
        <h2><b>pouet</b></h2>
      </div>
        </div>
      <CanvasDraw v-bind:class="{ disabled: isDisabled }" class="canvas"
        :width="480"
        :height="480"
        :brushSize="4"
        :outputName="'example'"
      />
      <div class="scores">
        <h4>Scores :</h4>
        <table>
        <tr v-for="item in this.participants" :key="item.id">
          <th> {{ item.username }} </th>  <th>-1 </th>
        </tr>
      </table>
      </div>
      <div class="clearfix"></div>
    </div>
    <br />
    <div v-for="item in currentWords" :key="item">
      <h1>{{ item }}</h1>
      <button type="button" class="block" v-on:click="pickWord(item)">
        PickWord
      </button>
    </div>
    <carousel></carousel>
    <button type="button" class="block" v-on:click="leave">Leave</button>
  </div>
</template>

<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import carousel from "@/components/utils/chat-answer-carousel";

export default {
  name: "Game",
  components: { CanvasDraw, carousel },
  data: function() {
    return { currentWords: [], gameState:"" ,

      isDisabled: false,
    };
  },
  methods: {
    leave() {
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
    switchCanDraw(b){
      this.isDisabled = b;
    },
    pickWord(word) {
      this.$connection.$emit(this.$network_actions.PickWord, word);
      this.currentWords = [];
    },
    onPickWord(words) {
      this.currentWords = words;
    },
    onGameStateUpdate(state) {
      switch (state) {
          case this.$gameStates.Starting:
            this.gameState = "Starting"
            break
          case this.$gameStates.NextPlayer:
            this.gameState = "NextPlayer"
            break
          case this.$gameStates.Picking:
            this.switchCanDraw(false)
            this.gameState = "Picking"
            break
          case this.$gameStates.Drawing:
            this.gameState = "Drawing"
            break
          case this.$gameStates.Ended:
            this.gameState = "Ended"
            break
          case this.$gameStates.Terminating:
            this.gameState = "Terminating"
            break
      }
    },
  },
  created() {
    this.$connection.$on(this.$network_events.PickWord, this.onPickWord);
    this.$connection.$on(
      this.$network_events.GameStateUpdate,
      this.onGameStateUpdate
    );
  },
  destroyed() {
    this.$connection.$off(this.$network_events.PickWord, this.onPickWord);
    this.$connection.$off(
      this.$network_events.GameStateUpdate,
      this.onGameStateUpdate
    );
  },
};
</script>


<style>
.disabled{
  pointer-events: none;
}
</style>