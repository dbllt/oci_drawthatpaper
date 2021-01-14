<template lang="html">

  <section class="login">
    <h1>Register Component</h1>
    <input type="text" v-bind:value="username"/>
    <input type="text" v-bind:value="password"/>
    <button v-on:click="registering"></button>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'register',
    props: ['username', 'password'],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {
      registering() {

      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .register {

  }
</style>
