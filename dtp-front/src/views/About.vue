<template>
  <div>
    <login v-if="!connected"></login>
    <register v-if="!connected"></register>
    <logout v-if="connected"></logout>
  </div>
</template>
<script>
import Login from "@/components/account/login";
import Logout from "@/components/account/logout";
import Register from "@/components/account/register";
export default {
  components: {Register, Logout, Login},
  props: ["connected"],
  mounted() {
    self.connected = false;
  }
}
</script>
