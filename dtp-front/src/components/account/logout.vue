<template lang="html">

  <section class="logout">
    <h1>logout Component</h1>
    <button v-on:click="disconnect"></button>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'logout',
    props: [],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {
      disconnect() {

      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .logout {

  }
</style>
