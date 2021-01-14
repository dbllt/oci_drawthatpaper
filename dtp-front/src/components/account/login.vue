<template lang="html">

  <section class="login">
    <h1>Login Component</h1>
    <input type="text" v-bind:value="username"/>
    <input type="text" v-bind:value="password"/>
    <button v-on:click="connect"></button>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'login',
    props: ['username', 'password'],
    mounted () {
      self.username = "TEST";
    },
    data () {
      return {

      }
    },
    methods: {
      connect(){

      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .login {

  }
</style>
