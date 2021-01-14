<template lang="html">

  <section class="login">
    <h1>login Component</h1>
    <input type="text" v-bind:value="user"/>
    <input type="text" v-bind:value="password"/>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'login',
    props: ['user', 'password'],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .login {

  }
</style>
