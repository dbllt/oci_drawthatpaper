<template lang="html">

  <li class="chat-msg">
    <p class="box" ref="text">{{client}}</p>
    {{msg}}
  </li>

</template>

<script lang="js">

  export default  {
    name: 'chat-msg',
    props: ['client', 'msg'],
    mounted () {
      this.$refs.text.style.background = this.getColor(this.client);
    },
    data () {
      return {

      }
    },
    methods: {
      getColor: function(hash) {
        //const letters = '23456789ABC';
        const letters = 'A3B4C56C7B8A9';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[(hash.charCodeAt(i%hash.length)%letters.length)];
          //color += letters[Math.floor(hash.get(i) * 16)];
        }
        return color;
      },
      getRandomColor: function() {
        const letters = '3456789ABC';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * letters.length)];
          //color += letters[Math.floor(hash.get(i) * 16)];
        }
        return color;
      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .chat-msg {
    padding:8px;
    list-style: none;
    overflow-wrap: anywhere;
  }
  .box {
    width: 300px;
    min-width:300px;
    margin: 10px auto;
    background: #00bfb6;
    padding: 5px;
    text-align: left;
    font-weight: 900;
    color: #fff;
    position:inherit;
    display: inline;
    border-radius: 25px;
    border: 2px solid #00000000;
  }
</style>
