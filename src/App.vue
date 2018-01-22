/*
 * @Author: mingtielin@outlook.com 
 * @Date: 2017-12-30 23:08:33 
 * @Last Modified by: mingtielin@outlook.com
 * @Last Modified time: 2018-01-20 09:24:24
 */
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
body {
  margin: 0px;
  background: url('assets/client-clean.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
}
a:link {
  color: #000;
  }
a:visited {
  color: rgb(0, 0, 0);
  }
a:hover {
  color: rgb(255, 123, 0); 
  cursor: pointer;
}
</style>
