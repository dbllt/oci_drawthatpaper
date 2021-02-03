<template>
  <div>
    <h1>Draw That Paper</h1>
    <br />
    <div>
      <CanvasDraw
        :width="480"
        :height="480"
        :brushSize="4"
        :outputName="'example'"
      />
    </div>
    <br>
    <carousel></carousel>
    <Answer></Answer>
    <button  type="button" class="block" v-on:click="leave">Leave</button>
  </div>
</template>

<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import carousel from "@/components/utils/chat-answer-carousel";
import Answer from "@/components/game/answer";

export default {
  name: 'Game',
  components: {CanvasDraw,carousel,Ansgit wer},
  data(){return {name: "Game"};},
  methods: {
    leave() {
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
  },
};
</script>
