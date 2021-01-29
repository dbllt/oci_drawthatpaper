<template>
  <div id="app">
    <router-view/>
  </div>
</template>



<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
  padding: 2% 10% 2% 10%;
  width: 30%;
  min-width: 200px;
  border-radius: 8px;

}


.block:hover {
  color: white
}

input{
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

 .roomList{

   border-style: solid;
   border-width: 1px;
   border-color:#fed766;
   min-height: 200px;
   height: 200px;
   overflow: scroll;
   overflow-x: hidden;
 }
</style>
