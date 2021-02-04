<template>
  <div id="app" class="w3-display-container">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}

html,
body {
  background-color: #2ab7ca;
  height: 100%;
}

.error {
  color: red;
}

.myButton {
  min-width: 150px;
  border-radius: 8px;
}

.big {
  min-width: 300px;
  min-height: 150px;
  border-radius: 8px;
  line-height: 150px;
}

.content {
  height: 90%;
  min-height: 500px;
}

.roomList {
  border-style: solid;
  border-width: 1px;
  border-color: #fed766;
  min-height: 200px;
  height: 275px;
  overflow: scroll;
  overflow-x: hidden;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text */
  position: absolute;
  z-index: 1;
  top: 125%;
  left: 50%;
  margin-left: -60px;

  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.5s;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.tooltip-bottom {
  top: 135%;
  left: 50%;
  margin-left: -60px;
}

.tooltip-bottom::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #555 transparent;
}

@media (min-width: 1024px) {
  .wordToDraw {
    float: left;
    width: 33%;
  }

  .canvas {
    float: left;
    width: 33%;
  }

  .scores {
    float: left;
    width: 33%;
  }

  .clearfix {
    clear: left;
  }
}

.disabled {
  pointer-events: none;
}

@import "./assets/styles/w3.css";
@import "assets/styles/w3-theme.css";
</style>
