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
          <h3><Timer ref="timer" /></h3>
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
    <br>
    <carousel :buttons="true"></carousel>
    <Answer></Answer>
    <button  type="button" class="block" v-on:click="leave">Leave</button>
  </div>
</template>

<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import Timer from "@/components/game/Timer";
import carousel from "@/components/utils/chat-answer-carousel";
import Answer from "@/components/game/answer";
import authentication from "@/network/authentication";

export default {
  name: "Game",
  components: { CanvasDraw, Timer, carousel,Answer },
  data: function() {
    return {
      currentWords: [],
      currentWord: "",
      gameState: "",
      participants: [],
      canvaDisabled: false,
      startedOnce: false,
      roundTime: 0,
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
    startTimer(timeInMiliSec) {
      if (!this.startedOnce) {
        console.log("START TIMER");
        console.log("starting timer with ", this.roundTime);
        this.startedOnce = true;
        this.$refs.timer.time = timeInMiliSec / 1000;
        this.$refs.timer.start();
      }
    },
    stopTimer() {
      this.startedOnce = false;
      this.$refs.timer.stop();
    },
    onPickWord(words) {
      this.currentWords = words;
    },
    onGameStateUpdate(data) {
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
          this.stopTimer();
          this.gameState = "Picking";
          break;
        case this.$gameStates.Drawing:
          if (authentication.isMe(data.drawing_user_id))
            this.canvaDisabled = false;

          this.startTimer(this.roundTime);
          this.gameState = "Drawing";
          break;
        case this.$gameStates.Ended:
          this.gameState = "Ended";
          this.stopTimer();
          break;
        case this.$gameStates.Terminating:
          this.gameState = "Terminating";
          this.leave();
          break;
      }
    },
    onParticipants(participants) {
      this.participants = participants;
    },
    onRoundTime(roundTime) {
      this.roundTime = roundTime;
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
    this.$connection.$off(this.$network_events.GameScore, this.onGameScore);
    this.$connection.$off(this.$network_events.RoundTime, this.onRoundTime);
  },
};
</script>

<style>
.disabled {
  pointer-events: none;
}
</style>
