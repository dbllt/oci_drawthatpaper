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
        ref="canva"
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
    <h4 v-if="currentWords.length">Pick a word:</h4>
    <div class="wordList" v-for="item in currentWords" :key="item">
      <button type="button"  class="wordButton" v-on:click="pickWord(item)">
        {{ item }}
      </button>
    </div>
    <div class="clearfix"></div>
    <br />
    <carousel ref="carousel" :buttons="true"></carousel>
    <button type="button" class="block" v-on:click="leave">Leave</button>
  </div>
</template>

<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import Timer from "@/components/game/Timer";
import carousel from "@/components/utils/chat-answer-carousel";
import authentication from "@/network/authentication";

export default {
  name: "Game",
  components: { CanvasDraw, Timer, carousel },
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
        this.$refs.canva.clear();
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
          this.$refs.carousel.stopAnswer();
          this.gameState = "Picking";
          break;
        case this.$gameStates.Drawing:
          if (authentication.isMe(data.drawing_user_id))
            this.canvaDisabled = false;

          this.startTimer(this.roundTime);
          this.$refs.carousel.startAnswer();
          this.gameState = "Drawing";
          break;
        case this.$gameStates.Ended:
          this.gameState = "Ended";
          this.stopTimer();
          this.$refs.carousel.stopAnswer();
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

