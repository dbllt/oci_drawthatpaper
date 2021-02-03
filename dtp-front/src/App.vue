<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-color: #2ab7ca;
}

h1 {
  color: #e6e6ea;
}
.block {
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 26px;
  cursor: pointer;
  margin: 5% auto;
  padding: 2% 2% 2% 2%;
  width: 30%;
  min-width: 200px;
  border-radius: 8px;
}

.block.small {
  min-width: 50px;
  font-size: 20px;
}

.block:hover {
  color: white;
}

input {
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 20px;

  margin: 5% auto;
  padding: 2% 5% 2% 5%;
  width: 30%;
  min-width: 150px;
  border-radius: 8px;
}

input.big {
  min-width: 300px;
}

.roomList {
  border-style: solid;
  border-width: 1px;
  border-color: #fed766;
  min-height: 200px;
  height: 400px;
  overflow: scroll;
  overflow-x: hidden;
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
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
  float: left; width: 33%;
}
.canvas{
  float: left; width: 33%;
}
.scores {
  float: left; width: 33%;
}
.clearfix{
  clear:left;
}
}
table{
  width:100%;
  margin-left: auto;
  margin-right: auto;
}
table, th, td {
  border: 1px solid black;
}

.disabled {
  pointer-events: none;
}

.wordButton{
  float: left;
  width: 10%;
  padding: 1%;
  margin: 2%;
  display: block;
  text-align: center;
  border: none;
  background-color: #fed766;
  font-size: 26px;
  cursor: pointer;
  min-width: 200px;
  border-radius: 8px;
}
.wordButton:hover {
  color: white;
}

.wordList{
  margin-left: 30%;
  margin-right: auto
}

</style>
