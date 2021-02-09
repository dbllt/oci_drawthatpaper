<template lang="html">
  <section class="answerSec">

    <input
      class="input-ans"
      v-model="answer"
      placeholder="Answer here!"
      v-on:keyup.enter="checkAnswer"
      :disabled="!gameStarted"
      maxlength="32"
    />
    <button type="button" v-on:click="checkAnswer">OK</button>
    <p v-if="firstAnswer" style="font-size: 10px; margin: 0;">
      <b class="answer-good" v-if="valid"
      >You found the word ! It was {{ word }}</b
      >
      <b class="answer-bad" v-if="!valid">Wrong Answer !</b>

    </p>
    <p v-else style="font-size: 10px; margin: 0;">
        Enter your answers :
    </p>
    <ul id="attemptsList" class="attempts-list container">
      <li
        v-for="item in attempts.slice().reverse()"
        v-bind:key="item"
        class="attempts-list-item container2"

      >
        <b class="button">
        {{ item }}
        </b>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "Answer",
  data: function() {
    return {
      word: "",
      answer: "",
      attempts: [],
      valid: false,
      firstAnswer: false,
      gameStarted: false,
    };
  },
  methods: {
    checkAnswer: function() {
      if (this.answer !== "") {
        this.$connection.$emit(
          this.$network_actions.SendWordForValidation,
          this.answer
        );
      }
    },
    start() {
      this.gameStarted = true;
    },
    stop() {
      this.gameStarted = false;
      this.word = "";
      this.answer = "";
      this.attempts = [];
      this.firstAnswer = false;
      this.valid = false;
    },
    onReceiveGoodAnswer(data) {
      this.firstAnswer = true;
      console.log("rcv", data);
      //   alert("mot trouvé");

      if (data.validity) {
        //alert("Correct!");
        this.word = data.word;
        this.valid = true;
        this.gameStarted = false;
      } else {
        //alert("PaS cOrReCt");
        this.attempts.push(this.answer);
        this.answer = "";
      }
    },
  },
  created() {
    this.$connection.$on(
      this.$network_events.ReceiveGoodAnswer,
      this.onReceiveGoodAnswer
    );
  },
  destroyed() {
    this.$connection.$off(
      this.$network_events.ReceiveGoodAnswer,
      this.onReceiveGoodAnswer
    );
  },
};
</script>

<style scoped lang="scss">
.input-ans {
  /*height: 5px;*/
}

.attempts-list {
  overflow: auto;
  height: 200px;
  border: 2px solid #dce4ec;
  border-radius: 5px;
  list-style-type: none;
  display: inline-block;
  background-color: transparent;
}

@media (min-width: 0px) {
  @media (max-width: 400px) {
    .attempts-list {
      height: 100px;
    }
  }
}
.container {
  width: 70%;
  display: inline-block;
  background-color: aliceblue; /* Green */
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  border: 3px solid #00000045;
}

.container2 {
  display: inline-block;
  background-color: transparent; /* Green */
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
}

.button {
  display: inline-block;
  background-color: #EF5558;
  color: white;
  padding: 3px 5px;
  text-align: center;
  text-decoration: none;
  font-size: 14px;
  border-radius: 10px;
  border: 3px solid #00000045;
}

.answer-bad {
  color: red;
}
.answer-good {
  color: green;
}
</style>
