<template>
  <div>
    <login v-if="!connected"></login>
    <register v-if="connected"></register>
  </div>
</template>
<script>
import Login from "@/components/account/login";
export default {
  components: {Login},
  props: ["connected"]
}
</script>
