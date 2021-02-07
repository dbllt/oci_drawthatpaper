<template>
  <div class="canvas-draw">
    <div class="canvas-wrapper" ref="canvasWrapper">
      <div class="draw-area">
        <canvas id="canvas" ref="canvas" :width="width" :height="height"></canvas>
        <canvas id="cursor" ref="cursor" :width="width" :height="height"></canvas>
      </div>
    </div>
    <div>
      <ul class="tools">
        <li class="tooltip" id="tool-pencil" :class="{ active: selectedToolIdx === 0 }" @click="changeTool(0)">
            <img  src="@/assets/edit.svg"/>
            <span class="tooltiptext tooltip-bottom">Pen</span>
        </li>
        <li class="tooltip" id="tool-eraser" :class="{ active: selectedToolIdx === 1 }" @click="changeTool(1)">
            <img src="@/assets/eraser.svg"/>
            <span class="tooltiptext tooltip-bottom">Eraser</span>
        </li>
        <li class="tooltip" id="tool-color-palette" @click="showColorPalette()">
            <img src="@/assets/color-palette.svg"/>
            <span class="tooltiptext tooltip-bottom">Change color</span>
        </li>
        <li class="tooltip" id="tool-download" @click="download()">
            <img src="@/assets/download.svg"/>
            <span class="tooltiptext tooltip-bottom">Download drawing</span>
        </li>
        <li class="tooltip" id="tool-clear" @click="clear()">
          <img src="@/assets/clear.svg"/>
          <span class="tooltiptext tooltip-bottom">Clear drawing</span>
        </li>
      </ul>
      <input type="range" min="1" max="16" v-model.number="brushSize" />
    </div>
  </div>
</template>

<script>
const DrawCmd = {
  LINE: 0,
  LINE_ERASE: 1,
  CLEAR: 2,
};
export default {
  name: 'CanvasDraw',
  props: {
    brushSize: {
      type: Number,
      default: 12,
    },
    width: {
      type: Number,
      default: 640,
    },
    height: {
      type: Number,
      default: 480,
    },
    outputName: {
      type: String,
      default: 'canvas',
    },
  },
  data() {
    return {
      canvasContext: null,
      cursorContext: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      tools: [
        {
          name: 'Pencil',
          color: '#000000',
        },
        {
          name: 'Eraser',
        },
      ],
      selectedToolIdx: 0,
    };
  },
  mounted() {
    this.setCanvas();
    this.bindEvents();
  },
  methods: {
    setCanvas() {
      this.canvasContext = this.$refs.canvas.getContext('2d');
      this.canvasContext.lineJoin = 'round';
      this.canvasContext.lineCap = 'round';
      this.canvasContext.lineWidth = this.brushSize;
      this.canvasContext.strokeStyle = this.tools[this.selectedToolIdx].color;

      this.cursorContext = this.$refs.cursor.getContext('2d');
    },
    bindEvents() {
      // TODO maybe move these functions elsewhere
      let transformOffset = (x, y) => {
        x = x * this.$refs.canvas.width / this.$refs.canvas.offsetWidth;
        y = y * this.$refs.canvas.height / this.$refs.canvas.offsetHeight;
        let point = this.canvasContext.getTransform().inverse().transformPoint(new DOMPoint(x, y));
        return [point.x, point.y];
      }
      let offsetFromTouch = (touch) => {
        let rect = touch.target.getBoundingClientRect();
        return transformOffset(touch.clientX - rect.left, touch.clientY - rect.top);
      };
      this.$refs.canvas.addEventListener('mousedown', (event) => {
        this.isDrawing = true;
        [this.lastX, this.lastY] = transformOffset(event.offsetX, event.offsetY);
      });
      this.$refs.canvas.addEventListener('mousemove', (event) => this.draw(...transformOffset(event.offsetX, event.offsetY)));
      this.$refs.canvas.addEventListener('mouseup', () => this.isDrawing = false);
      // TODO instead of abandoning the draw on mouseout, use mousemove on whole page
      this.$refs.canvas.addEventListener('mouseout', () => this.isDrawing = false);
      // TODO handle multiple touches
      this.$refs.canvas.addEventListener('touchstart', (event) => {
        this.isDrawing = true;
        [this.lastX, this.lastY] = offsetFromTouch(event.changedTouches[0]);
        event.preventDefault();
      });
      this.$refs.canvas.addEventListener('touchmove', (event) => {
        this.draw(...offsetFromTouch(event.changedTouches[0]));
        event.preventDefault();
      });
      this.$refs.canvas.addEventListener('touchend', (event) => {
        this.isDrawing = false;
        event.preventDefault();
      });
    },
    changeTool(tool) {
      this.selectedToolIdx = tool;
    },
    renderDrawCmd(cmd) {
      // setup
      switch(cmd[0]) {
        case DrawCmd.LINE:
          this.canvasContext.globalCompositeOperation = 'source-over';
          this.canvasContext.strokeStyle = cmd[5];
          break;
        case DrawCmd.LINE_ERASE:
          this.canvasContext.globalCompositeOperation = 'destination-out';
          break;
        case DrawCmd.CLEAR:
          this.canvasContext.clearRect(0, 0, this.width, this.height);
          break;
      }
      // actual draw
      switch (cmd[0]) {
        case DrawCmd.LINE:
        case DrawCmd.LINE_ERASE:
          this.canvasContext.lineWidth = cmd[6];
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(cmd[1], cmd[2]);
          this.canvasContext.lineTo(cmd[3], cmd[4]);
          this.canvasContext.stroke();
          break;
      }
    },
    sendDrawCmd(cmd) {
      this.$connection.$emit(this.$network_actions.SendDraw, cmd);
    },
    sendAndRenderDrawCmd(cmd) {
      this.sendDrawCmd(cmd);
      this.renderDrawCmd(cmd);
    },
    draw(x, y) {
      this.drawCursor(x, y);
      if (!this.isDrawing) return;

      let cmd;

      if (this.tools[this.selectedToolIdx].name === 'Eraser') {
        cmd = [DrawCmd.LINE_ERASE, this.lastX, this.lastY, x, y, null, this.brushSize*2];
      } else {
        cmd = [DrawCmd.LINE, this.lastX, this.lastY, x, y, this.tools[this.selectedToolIdx].color, this.brushSize];
      }

      this.sendAndRenderDrawCmd(cmd);
      [this.lastX, this.lastY] = [x, y];
    },
    drawCursor(x, y) {
      this.cursorContext.clearRect(0, 0, this.width, this.height);
      this.cursorContext.beginPath();
      this.cursorContext.ellipse(
        x, y,
        this.brushSize, this.brushSize,
        Math.PI / 4, 0, 2 * Math.PI
      );
      this.cursorContext.stroke();
    },
    showColorPalette() {
      const colorPalette = document.createElement('input');
      colorPalette.addEventListener('change', (event) => {
        this.tools[0].color = event.target.value;
      });
      colorPalette.type = 'color';
      colorPalette.value = this.tools[0].color;
      colorPalette.click();
    },
    download() {
      const link = document.createElement('a');
      link.download = `${this.outputName}.png`;
      link.href = this.$refs.canvas.toDataURL()
      link.click();
    },
    clear(){
      this.sendAndRenderDrawCmd([DrawCmd.CLEAR]);
    },
    onReceiveDraw(msg){
      // console.log("rcv", msg);
      this.renderDrawCmd(msg);
    }
  },
  created(){
    this.$connection.$on(this.$network_events.ReceiveDraw, this.onReceiveDraw);
  },
  beforeDestroy(){
    this.$connection.$off(this.$network_events.ReceiveDraw, this.onReceiveDraw);
  }
}
</script>
<style scoped>
.canvas-wrapper {
  display: inline-block;
  position: relative;
  width: 100%;
  max-width: 512px;
}
#canvas {
  background-color: #f9f9f9;
  z-index: 0;
}
#cursor {
  z-index: 1;
  pointer-events: none;
}
.active {
  background-color: #dea878 !important;
}
.tools {
  margin: 0;
  padding: 0;
}
.tools li{
  width: 50px;
  display: inline-block;
  padding: 4px;
  margin: 2px;
  background-color: #c8c8c8;
  border-left: 1px solid #1a1a1a;
  border-right: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  border-top: 1px solid #1a1a1a;
}
.tools img {
  width: 32px;
  user-select: none;
}
.draw-area canvas {
  vertical-align: top;
  margin-left: -2px;
  border: 2px solid black;
  width: 100%;
}
.draw-area canvas#cursor {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
