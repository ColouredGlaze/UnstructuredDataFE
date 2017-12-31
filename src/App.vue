/*
 * @Author: mingtielin@outlook.com 
 * @Date: 2017-12-30 23:08:33 
 * @Last Modified by:   mingtielin@outlook.com 
 * @Last Modified time: 2017-12-30 23:08:33 
 */
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
