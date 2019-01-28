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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 24px;
}
</style>
