<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <div>
      <CanvasDraw :width="256" :height="480" :brushSize="4" :outputName="'example'"/>
    </div>

    <button  type="button" class="block" v-on:click="leave">Leave</button>
  </div>

</template>


<script>
import CanvasDraw from "@/components/draw/CanvasDraw";

export default {
  name: 'Game',
  components: {CanvasDraw},
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
