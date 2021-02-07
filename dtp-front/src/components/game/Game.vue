<template>
  <div class="w3-container w3-center vertical-center fit" :style="fitMiddle">
    <div >
      <!--h1>Draw That Paper</h1-->
      <!--h2>{{ this.gameState }}</h2-->
      <div>
        <div>
          <div class="vertical-center">
            <p v-if="currentWord.length !== 0">
              Your word : <b>{{ currentWord }}</b>
              <button class="w3-theme-red w3-button myButton small floating" v-on:click="leave">Exit</button>
            </p>
            <div v-else>
              <p>
                <button class="w3-theme-red w3-button myButton small floating" v-on:click="leave">Exit</button>
              </p>
              <br>
            </div>
          </div>
        </div>
        <div class="parent">
          <CanvasDraw
              v-on:mouseenter="changeOpacity(0.5)"
              v-on:mouseleave="changeOpacity(1)"
            v-bind:class="{ disabled: this.canvaDisabled }"
            ref="canva"
            class="canvas vertical-center"
            :width="480"
            :height="480"
            :brushSize="4"
            :outputName="'example'"
          />
          <h3 class="childright invert"><Timer ref="timer" /></h3>

          <div class="scores child invert">
            <table>
              <tr>
                <th>
                  <h3>Scores:</h3>
                </th>
              </tr>
              <tr v-for="item in this.participants" :key="item.id">
                <th><p>{{ item.username }}</p></th>
                <th><p>{{ item.score }}</p></th>
              </tr>
            </table>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="overlay" v-if="currentWords.length === 0 && this.gameState === 'Picking'">
        <h2 class="overlay-title">Wait picker...</h2>
        <div class="w3-button myButton w3-margin  w3-large w3-theme-red" v-on:click="leave">Leave</div>
      </div>

      <div class="overlay" v-if="currentWords.length !== 0 && this.gameState === 'Picking'">
        <div class="centered">
          <h4 v-if="currentWords.length" class="overlay-title">Pick a word:</h4>
          <div class="wordList" v-for="item in currentWords" :key="item">
            <div class="w3-button myButton w3-margin  w3-large w3-theme-yellow" v-on:click="pickWord(item)">
              {{ item }}
            </div>
          </div>
          <div class="w3-button myButton w3-margin  w3-large w3-theme-red" v-on:click="leave">Leave</div>
        </div>
      </div>

      <div class="overlay" v-if="this.gameState === 'Ended'">
        <div class="centered">
          <h2 class="overlay-title">Game is over :)</h2>
          <div class="scores centered">
              <ul v-for="item in this.participants" :key="item.id">
                <li>{{ item.username }}: {{ item.score }}</li>
              </ul>
          </div>
          <div class="w3-button myButton w3-margin  w3-large w3-theme-red" v-on:click="leave">Leave</div>
        </div>
      </div>

      <div>
        <carousel ref="carousel" :buttons="false"></carousel>
      </div>
    </div>
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
      activeModal: true,
      currentWords: [],
      currentWord: "",
      gameState: "",
      participants: [],
      canvaDisabled: false,
      startedOnce: false,
      roundTime: 0,

      opacity: 1.0
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
          if (this.gameState === 'Picking') {
            break;
          }
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
    changeOpacity(opacity) {
      console.log("OPACITY CHANGED");
      this.opacity = opacity;
    }
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
  computed: {
    fitMiddle() {
      let ratio = 100.0 * Math.min(window.width, window.innerHeight / 2) / window.width;
      return "width: " + (ratio) + "%;"
    }
  }
};
</script>

<style scoped>
.fit {
  width:50%;
}
.overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
.overlay-title {
  color: aliceblue;
}
.invert {
  font-size: 20px;
  -webkit-text-stroke: 1px #EEFFFFFF;
}

p,
h3 {
  font-weight: bolder;
  margin: 0;
}
p {
  font-size:15px;
}
html {
  background: #fff;
}
/*
.opacityOnHover {
  opacity: 1;
}

.opacityOnHover:hover {
  opacity: 0.5;
}
*/
.child {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 10px;
  pointer-events: none;
}

.childright {
  position: absolute;
  top: 0;
  right: 0;
  padding-right:10px;
  pointer-events: none;
}
.centered {
  width:100%;
  margin: auto;
}
.parent {
  position: relative;
  height: 50%;
}
.parent:hover > div.child {
  opacity: 0.6;
}
.parent:hover > div.childright {
  opacity: 0.6;
}
.scores {
  font-size: 10px;
  background-color: #55000000;
}

.vertical-center {
  width:100%;
  /*margin-left:auto;
  margin-right:auto;*/
}

.floating {
  width: fit-content;
  float: right;
}

</style>
