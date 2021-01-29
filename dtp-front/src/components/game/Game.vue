<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <div>
      <CanvasDraw :width="256" :height="480" :brushSize="4" :outputName="'example'"/>
    </div>
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
  components: {CanvasDraw,carousel,Answer},
  data : function(){
    return {}
  },
  methods: {

    leave: function () {
      this.$router.push('/menu')
    }
  }
}
</script>
