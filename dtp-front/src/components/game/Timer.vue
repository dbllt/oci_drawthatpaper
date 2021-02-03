<template>
  <span>
    {{ this.formatTime() }}
  </span>
</template>
<script>
export default {
  name: "Timer",
  data: function() {
    return {
      time: 0,
      interval: null,
    };
  },
  unmounted() {
    this.stop();
  },
  methods: {
    formatTime() {
      function str_pad_left(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
      }
      let min = Math.floor(this.time / 60);
      let sec = this.time - min * 60;
      return str_pad_left(min, "0", 2) + ":" + str_pad_left(sec, "0", 2);
    },
    start() {
      this.stop();
      this.interval = window.setInterval(() => {
        this.time--;
      }, 1000);
    },
    stop() {
      if (this.interval != null) {
        window.clearInterval(this.interval);
        this.interval = null;
      }
    },
  },
};
</script>
