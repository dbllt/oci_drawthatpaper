<template lang="html">

  <li class="chat-msg">
    {{client}}:{{msg}}
  </li>

</template>

<script lang="js">

  export default  {
    name: 'chat-msg',
    props: ['client', 'msg'],
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
  .chat-msg {
    list-style: none;
  }
</style>
