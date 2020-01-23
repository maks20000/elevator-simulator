<template>
  <div class="floor">
      <div class = "left-block">
          <div class="window"></div>
          <div class="window"></div>
      </div>
      <div class="main">
         <div v-for="i in elevatorCount" :key="i" class="elevator-block">
             <elevator class="lift" v-if="start" :id="i"></elevator>
        </div> 
        <div class="btns">
            <div @click="callElevator(1)" :class="{disable:num==floorCount, active:up}" class="btn-up"></div>
            <div @click="callElevator(0)" :class="{disable:num==1, active:down}" class="btn-down"></div>
        </div>
        <div class="stairs">
            <div><img src='../assets/svg/stairs.svg' alt=""></div>
            <div><img src='../assets/svg/stairs.svg' alt=""></div>
        </div>
      </div>
      <div class = "right-block">
          <div class="window"></div>
      </div>
  </div>
</template>

<script>
import elevator from './elevator'
import {mapGetters} from 'vuex'
export default {
    components:{
        elevator,
    },
    props: {
        start: true,
        num: 0,
    },
    computed: mapGetters(['elevatorCount','floorCount','pressed','elevator','mainLogic','show']),

    data() {
        return {
            down: false,
            up: false
        }
    },

    methods: {
        callElevator (target) {

            if (target==0 && !this.down) { 
                this.down = true;
                this.$store.commit("pressed",{floor:this, dir:0, lift:null});
                setTimeout(() => {
                    this.mainLogic.setTargetForLift();
                }, 1000);
                
            }

            if (target==1 && !this.up) { 
                this.up = true;
                this.$store.commit("pressed",{floor:this, dir:1, lift:null});
                setTimeout(() => {
                    this.mainLogic.setTargetForLift();
                }, 1000);
                
            }
        },
        maxFloor(dir) {
            var pressed=this.pressed;
            var floor = new Array();
            for(var i=0; i<pressed.length; i++) {
                floor.push(pressed[i].floor.num);
            }
            if (dir==0) {
                return floor.sort()[0]
            }
            else {
                return floor.sort()[pressed.length-1]
            }
        },
    },

    mounted() {
        if (this.start) {
            this.$store.commit('step',this.$el)
        }
    }  
}
</script>

<style lang="sass" scoped>

    .floor 
        display: flex
        justify-content: center
        z-index: -1
        
        &:first-child
            &:before 
                content: ''
                width: 100% 
                height: 10px
                background: #638CC2
                position: absolute
                z-index: 1
        

    .left-block, .right-block 
        display: flex
        justify-content: space-between
        align-items: center
        width: 208px
        box-sizing: border-box
        padding: 32px 34px
        background: #EBF5F7
        border: 5px solid #638CC2

    .main 
        border-bottom: 5px solid #EBF5F7
        border-top: 5px solid #EBF5F7
        display: flex
        justify-content: center
        padding-left: 5px
        z-index: 0

        .elevator-block
            width: 71px
            border-right: 1px solid #EBF5F7
            border-left: 1px solid #EBF5F7
            display: flex
            justify-content: center

        .btns 
            padding: 0px 15px 10px 15px
            display: flex
            flex-direction: column
            justify-content: flex-end
            border-right: 0px
            
            .btn-up
                width: 30px
                height: 30px
                margin-bottom: 5px
                background: url('../assets/svg/btn-arrow.svg') no-repeat center
                cursor: pointer
                &:hover
                    background: url('../assets/svg/Button_hover.svg') no-repeat center
            .btn-down
                width: 30px
                height: 30px
                transform: rotate(180deg)
                background: url('../assets/svg/btn-arrow.svg') no-repeat center
                cursor: pointer
                &:hover
                    background: url('../assets/svg/Button_hover.svg') no-repeat center
            .active 
                background: url('../assets/svg/Button_pressed.svg') no-repeat center
                &:hover
                    background: url('../assets/svg/Button_pressed.svg') no-repeat center
            .disable 
                background: url('../assets/svg/Button_disabled.svg') no-repeat center
                &:hover
                    background: url('../assets/svg/Button_disabled.svg') no-repeat center

        .stairs 
            width: 106px
            border-left: 5px solid #EBF5F7
            border-right: 0px
            margin-right: -1px
            div 
                width: 100% 
                margin-bottom: -5px
                margin-left: -1px
                &:last-child
                    text-align: right
                
    .right-block
        justify-content: center
        width: 145px
        .window::before
            width: 22px

    .lift
        position: absolute
        bottom: 0

    .window 
        border: 2px solid #638CC2
        width: 50px
        height: 60px
        background: #fff
        position: relative
        box-sizing: border-box
        &::after
            content: ''
            position: absolute
            border: 2px solid #638CC2
            width: 100%
            height: 20px
            left: -2px
            top: -2px
        &::before
            content: ''
            position: absolute
            border-left: 2px solid #638CC2
            width: 21px
            height: 34px
            right: -1px
            bottom: 0px

</style>>
