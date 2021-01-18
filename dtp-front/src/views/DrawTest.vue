<template>
  <div>
    <CanvasDraw :width="640" :height="480" :outputName="'example'"/>
  </div>
</template>
<script>
import CanvasDraw from '@/components/draw/CanvasDraw.vue';
export default {
  components: {CanvasDraw},
}
</script>
