<template>
  <div id="app">
    <Aspside />
  </div>
</template>

<script>
import Aspside from './components/Aspside'

export default {
  name: 'app',
  components: {
    Aspside
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  color: #2a4461;
}
</style>
