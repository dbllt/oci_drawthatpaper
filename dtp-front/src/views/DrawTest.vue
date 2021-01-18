<template>
  <div>
    <CanvasDraw :width="256" :height="480" :brushSize="4" :outputName="'example'"/>
  </div>
</template>
<script>
import CanvasDraw from '@/components/draw/CanvasDraw.vue';
export default {
  components: {CanvasDraw},
}
</script>
