<template>
  <div>
    <h1>Draw That Paper</h1>
    <br>
    <svg width="500" height="500">
      <rect width="500" height="500" style="fill:white;stroke-width:3;stroke:rgb(0,0,0)" />
    </svg>

    <button  type="button" class="block" v-on:click="leave">Leave</button>
  </div>

</template>


<script>
export default {
  name: 'Game',
  data : function(){
    return {}
  },
  methods: {

    leave: function () {
      this.$parent.goHome();
    }
  }
}
</script>
