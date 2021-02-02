<template>
  <div>
    <h1>Draw That Paper</h1>
    <h2>{{ this.gameState }}</h2>
    <div>
      <div class="wordToDraw">
        <div class="vertical-center">
          <template v-if="currentWord">
            <h3>Your word :</h3>
            <br />
            <h2>
              <b>{{ currentWord }}</b>
            </h2>
          </template>
          <br />
        </div>
      </div>
      <CanvasDraw
        v-bind:class="{ disabled: this.canvaDisabled }"
        class="canvas"
        :width="480"
        :height="480"
        :brushSize="4"
        :outputName="'example'"
      />
      <div class="scores">
        <h4>Scores :</h4>

        <table>
          <tr v-for="item in this.participants" :key="item.id">
            <th>{{ item.username }}</th>
            <th>{{ item.score }}</th>
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
    <carousel :buttons="true"></carousel>
    <button type="button" class="block" v-on:click="leave">Leave</button>
  </div>
</template>

<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import carousel from "@/components/utils/chat-answer-carousel";
import authentication from "@/network/authentication";

export default {
  name: "Game",
  components: { CanvasDraw, carousel },
  data: function() {
    return {
      currentWords: [],
      currentWord: "",
      gameState: "",
      participants: [],
      canvaDisabled: false,
    };
  },
  methods: {
    leave() {
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
    pickWord(word) {
      this.$connection.$emit(this.$network_actions.PickWord, word);
      this.currentWord = word;
      this.currentWords = [];
    },
    onPickWord(words) {
      this.currentWords = words;
    },
    onGameStateUpdate(data) {
      console.log(data);
      switch (data.state) {
        case this.$gameStates.Starting:
          this.gameState = "Starting";
          break;
        case this.$gameStates.NextPlayer:
          this.gameState = "NextPlayer";
          break;
        case this.$gameStates.Picking:
          this.canvaDisabled = true;
          this.currentWord = "";
          this.gameState = "Picking";
          break;
        case this.$gameStates.Drawing:
          if (authentication.isMe(data.drawing_user_id))
            this.canvaDisabled = false;
          this.gameState = "Drawing";
          break;
        case this.$gameStates.Ended:
          this.gameState = "Ended";

          break;
        case this.$gameStates.Terminating:
          this.gameState = "Terminating";
          this.leave();
          break;
      }
    },
    onParticipants(participants) {
      console.log("onParticipants", participants);
      this.participants = participants;
    },
    onRoundTime(roundTime) {
      console.log(roundTime);
    },
  },
  created() {
    this.$connection.$on(this.$network_events.PickWord, this.onPickWord);
    this.$connection.$on(
      this.$network_events.GameStateUpdate,
      this.onGameStateUpdate
    );
    this.$connection.$on(
      this.$network_events.Participants,
      this.onParticipants
    );
    this.$connection.$on(this.$network_events.GameScore, this.onGameScore);
    this.$connection.$on(this.$network_events.RoundTime, this.onRoundTime);
  },
  destroyed() {
    this.$connection.$off(this.$network_events.PickWord, this.onPickWord);
    this.$connection.$off(
      this.$network_events.GameStateUpdate,
      this.onGameStateUpdate
    );
    this.$connection.$off(
      this.$network_events.Participants,
      this.onParticipants
    );
    this.$connection.$off(this.$network_events.RoundTime, this.onRoundTime);
  },
};
</script>

<style>
.disabled {
  pointer-events: none;
}
</style>
