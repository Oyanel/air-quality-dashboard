<template>
  <div id="app">
    <Main/>
    <a href="https://www.nimbus.cit.ie" target=”_blank”><img class="logo" src="./assets/Logo.png"
                                                             alt="logo Nimbus"/></a>
  </div>
</template>

<script>
  import Main from './components/Main.vue'

  export default {
    name: 'app',
    components: {
      Main
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #e8eef5;
    padding-bottom: 1px;
  }

  .logo {
    position: fixed;
    bottom: 10px;
    left: 10px;
    height: 50px;
    opacity: .5;
    z-index: 1;
    transition: opacity .5s ease;
  }

  .logo:hover {
    opacity: 1;
    transition: opacity .5s ease;
  }
</style>
