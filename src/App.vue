<template>
  <div id="app">
    <div class="container">
      <configPanel></configPanel>
    </div>
    <div class="container">
      <div v-if="show" class="build">
          <div class="roof"></div>
          <div class="upBorder"></div>
          <floor v-for="i in floorCount-1" :key=i+1 :num="floorCount-i+1"></floor>
          <floor :num="1" :start="true"></floor>
      </div>
    </div>
    <div v-if="show" class="controll-block">
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
  computed: mapGetters(['floorCount', 'elevator', 'show']),
}
</script>

<style lang="sass">
  #app 
    margin: 0 auto
    font-family: Roboto
    font-style: normal
    font-weight: normal

  .container 
    max-width: 965px
    margin: 0 auto
    display: flex
    flex-direction: column
    justify-content: center
    
  .build
    position: relative
    display: inline-block
    margin: 30px auto 0
    border-bottom: 10px solid #638CC2

    .roof 
      height: 5px 
      background: #638CC2
      margin-bottom: 2px
      margin-right: -10px
      margin-left: -10px

    .upBorder 
      height: 10px 
      background: #638CC2
      width: 100%
  .controll-block
    margin: 0 auto
    display: flex
    justify-content: center
    margin-top: 40px
</style>
