<template>
  <div id="app" class="w3-content ">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body{
  background-color:#2ab7ca
}

.error {
  color:red
}


.myButton{
  min-width: 200px;
  border-radius: 8px;
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

@media ( min-width: 1024px ) {
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



@import './assets/styles/w3.css';
@import 'assets/styles/w3-theme.css';
</style>
