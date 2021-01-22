<template lang="html">

  <section class="chat-answer-carousel">
    <flickity class="carousel" ref="flickity" :options="flickityOptions">
      <div class="carousel-cell">
        <category-selection
            :default-tags="[]"
            :board-color="'#777777'"
            :input-color="'#999999'"
            :creation="true"
            :limit="6"
            :input-limit="20"
            :placeholder="'Give an answer!'"
        ></category-selection>
      </div>
      <div class="carousel-cell"><chat :message-limit="100" :title="'Game Chat'" ref="chat"></chat></div>
    </flickity>

    <!-- if you don't want to use the buttons Flickity provides -->
    <button v-if="buttons" @click="previous()">Custom Previous Button</button>
    <button v-if="buttons" @click="next()">Custom Next Button</button>
  </section>

</template>

<script lang="js">
  import CategorySelection from "@/components/config/category-selection";
  import Flickity from 'vue-flickity';
  import Chat from "@/components/chat/chat";

  export default  {

    name: 'chat-answer-carousel',
    props: ['buttons'],
    components: {Flickity, Chat, CategorySelection},

    mounted () {
      this.$refs.chat.clientId = "A0123456";
      this.$refs.chat.onMessageSent = (client,msg) => {
        //send to api
        //socket.send(client, msg);

        //send directly to ui
        this.$refs.chat.addMessage(client,msg);
      };
    },
    data () {
      return {
        flickityOptions: {
          initialIndex: 0,
          prevNextButtons: false,
          pageDots: false,
          wrapAround: true
        }
      }
    },
    methods: {
      next() {
        this.$refs.flickity.next();
      },

      previous() {
        this.$refs.flickity.previous();
      }
    },
    computed: {

    }
}


</script>

<style scoped lang="scss">
  .chat-answer-carousel {

  }
  .carousel {
    background: #EEE;
    width: 100%;
  }

  .carousel-cell {
    width: 90%;
    height: auto;
    margin-right: 5%;
    #background: #8C8;
    border-radius: 5px;
    counter-increment: gallery-cell;
  }

  /* cell number */
  .carousel-cell:before {
    #display: block;
    //text-align: center;
    //content: counter(gallery-cell);
    line-height: 400px;
    font-size: 80px;
    color: white;
  }

</style>
