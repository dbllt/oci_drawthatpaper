<template>
  <div>
    <h1>Draw That Paper</h1>
    <br />
    <div>
      <div class="wordToDraw">
        <div class="vertical-center">
        <h3>Your word :</h3>
        <br>
        <h2><b>pouet</b></h2>
      </div>
        </div>
      <CanvasDraw class="canvas"
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
    <br>
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
    return {
      participants:[

        { id: '1',
          username:'dorian'},
        { id: '2',
          username:'allo'},
      ]
    };
  },
  methods: {
    leave() {
      this.$router.push("/menu");
      this.$connection.$emit(this.$network_actions.LeaveRoom);
    },
  },
};
</script>
