<template>
  <div>
    <h2>{{word}}</h2>
    <div v-if="picking">
      <h3 v-for="w in words" :key="w">{{w}}</h3>
    </div>
  </div>

</template>

<script>
export default {
  name: 'word-generator',
  components: {},
  props: [
    'picking'
  ],
  mounted () {
    this.scrollToBottom(0);
  },
  data: function () {
    return {
      word:"",
      words:[]
    }
  },
  method: {
    // eslint-disable-next-line no-unused-vars
    pick: function(count) {
      //io.receive
    }
  }
}
</script>

<style scoped>

</style>
