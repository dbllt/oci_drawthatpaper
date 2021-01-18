<template>
<div></div> 
</template>

<script>
import {bus} from '@/main.js'

export default {
  name: "Connection",
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    chat: function(data) {
       bus.$emit(this.$network.ReceiveMsg, data);
    },
  },
  created: function () {
      bus.$on(this.$network.SendMsg, (msg)=>{
          this.$socket.client.emit("chat", msg);
      })
  },
};
</script>