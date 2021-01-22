<template lang="html">

<<<<<<< HEAD
  <li class="chat-msg autofill">
    <p class="box" ref="text">{{client}}</p>
    {{msg}}
=======
  <li class="chat-msg">
    {{client}}:{{msg}}
>>>>>>> main
  </li>

</template>

<script lang="js">
<<<<<<< HEAD
=======

>>>>>>> main
  export default  {
    name: 'chat-msg',
    props: ['client', 'msg'],
    mounted () {
<<<<<<< HEAD
      this.$refs.text.style.background = this.getColor(this.client);
=======

>>>>>>> main
    },
    data () {
      return {

      }
    },
    methods: {
<<<<<<< HEAD
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
=======

>>>>>>> main
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .chat-msg {
<<<<<<< HEAD
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
  @media (min-width: 150px) {
    @media (max-width: 400px) {
      .autofill {
        font-size: 3vw;
      }
    }
=======
    list-style: none;
>>>>>>> main
  }
</style>
