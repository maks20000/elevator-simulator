<template>
  <div id="app">
    <configPanel></configPanel>
    <div class="build">
        <floor v-for="i in floorCount-1" :key=i+1 :num="floorCount-i+1"></floor>
        <floor :num="1" :start="true"></floor>
    </div>
    <div class="controll-block">
      <controll v-for="(lift,index) in elevator" :key="index" :lift="lift"></controll>
    </div>
    <main-logic></main-logic>
  </div>
</template>

<script>

import configPanel from './components/configPanel'
import floor from './components/floor'
import controll from './components/controll'
import mainLogic from './components/mainLogic'
import {mapGetters} from 'vuex'
export default {
  components: {
    configPanel, floor, controll, mainLogic
  },
  data () {
    return {

    }
  },
  mounted() {
      
  },
  computed: mapGetters(['floorCount', 'elevator']),
}
</script>

<style lang="sass">
  #app 
    max-width: 960px
    margin: 0 auto
    font-family: Roboto
    font-style: normal
    font-weight: normal
  .build
    position: relative
  .controll-block
    margin: 0 auto
    display: flex
    justify-content: center
    margin-top: 40px
</style>
