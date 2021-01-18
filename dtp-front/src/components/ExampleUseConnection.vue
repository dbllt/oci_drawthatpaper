<template>
  <div>
    <Connection />
    <ul>
      <li v-for="m in msgs" :key="m.id">
        {{ m }}
      </li>
    </ul>
    <input v-model="message" /> <button v-on:click="clickButton()">Send</button>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import Connection from "@/components/network/Connection.vue";

export default {
  name: "ExampleUseConnection",
  components: {
    Connection,
  },
  props: {
    msg: String,
  },
  data: function() {
    return {
      message: '',
      msgs: [],
    };
  },
  methods: {
    clickButton: function() {
      console.log("sending");
      bus.$emit(this.$network.SendMsg, this.message);
    },
  },
  created: function() {
    bus.$on(this.$network.ReceiveMsg, (msg) => {
      this.msgs.push(msg);
    });
  },
};
</script>
