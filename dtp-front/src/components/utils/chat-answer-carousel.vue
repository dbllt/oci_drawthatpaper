<template lang="html">
  <section class="chat-answer-carousel">
    <!-- if you don't want to use the buttons Flickity provides -->
    <button class="dir" style="float:left;" v-if="buttons" @click="previous()">
      ←
    </button>
    <button class="dir" style="float:right;" v-if="buttons" @click="next()">
      →
    </button>
    <br />
    <br />
    <flickity class="carousel" ref="flickity" :options="flickityOptions">
      <div class="carousel-cell">
        <Answer ref="answer"></Answer>
      </div>
      <div class="carousel-cell">
        <chat :message-limit="100" ref="chat"></chat>
      </div>
    </flickity>
  </section>
</template>

<script>
import Flickity from "vue-flickity";
import Chat from "@/components/chat/chat";
import Answer from "@/components/game/answer";

export default {
  name: "chat-answer-carousel",
  props: ["buttons"],
  components: { Flickity, Chat, Answer },
  data() {
    return {
      flickityOptions: {
        initialIndex: 0,
        prevNextButtons: false,
        pageDots: false,
        wrapAround: true,
      },
    };
  },
  methods: {
    next() {
      this.$refs.flickity.next();
    },
    previous() {
      this.$refs.flickity.previous();
    },
    startAnswer(){
      this.$refs.answer.start();
    },
    stopAnswer(){
      this.$refs.answer.stop();
    },
    onReceiveMsg(packet) {
      this.$refs.chat.addMessage(packet.username, packet.msg);
    },
  },
  created() {
    this.$connection.$on(this.$network_events.ReceiveMsg, this.onReceiveMsg);
  },
  beforeDestroy() {
    this.$connection.$off(this.$network_events.ReceiveMsg, this.onReceiveMsg);
  },
  mounted() {
    this.$refs.chat.onMessageSent = (client, msg) => {
      this.$connection.$emit(this.$network_actions.SendMsg, msg);
    };
  },
  computed: {
    _isCurrentPage(p) {
      if (p === this.$refs.flickity.selectedIndex) {
        return "background-color:black;";
      }
      return "background-color:grey;";
    },
  },
};
</script>

<style scoped lang="scss">
.chat-answer-carousel {
  outline: 8px ridge rgba(170, 50, 220, 0.2);
  border-radius: 2rem;
}
.carousel {
  background: none;
  width: 100%;
}

.carousel-cell {
  width: 90%;
  height: auto;
  margin-right: 5%;
  // #background: #8C8;
  border-radius: 5px;
  counter-increment: gallery-cell;
}

/* cell number */
.carousel-cell:before {
  // #display: block;
  //text-align: center;
  //content: counter(gallery-cell);
  line-height: 400px;
  font-size: 80px;
}

.dir {
  background-color: #6c6c6c;
  padding: 1px;
  text-align: center;
  text-decoration: none;
  border-radius: 25px;
  border: 3px solid #00000035;
  color: black;
  font-weight: bolder;
  display: inline-block;
  font-size: 16px;
  @media screen and (-ms-high-contrast: active) {
    border: 2px solid currentcolor;
  }
}
</style>
