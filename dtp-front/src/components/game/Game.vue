<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <div>
      <CanvasDraw :width="480" :height="480" :brushSize="4" :outputName="'example'"/>
    </div>
    <carousel></carousel>
    <button  type="button" class="block" v-on:click="leave">Leave</button>
  </div>

</template>


<script>
import CanvasDraw from "@/components/draw/CanvasDraw";
import carousel from "@/components/utils/chat-answer-carousel";

export default {
  name: 'Game',
  components: {CanvasDraw,carousel},
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
