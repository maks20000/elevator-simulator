<template>
  <div class="controll">
      <span class="pin pin-1"></span>
      <span class="pin pin-2"></span>
      <span class="pin pin-3"></span>
      <span class="pin pin-4"></span>
      <h4>– Лифт {{lift.id}} –</h4>
      <div class="weight-block">
        <div class="weight">
            <div class="img">
                <img :src="'src/assets/svg/icon-lift-weight-'+getImageNum()+'.svg'" alt="weight-indicator">
            </div>
            <span v-if="checkWeight()" class="error">перевес</span>
            <div class="info">{{lift.people}} человек весом {{lift.weightSum}} кг</div>
        </div>
      </div>
      <div class="button-panel">
          <div v-for="i in 3" :key="i" class="column">
              <div @click="callElevator(10-j+i*10-10+1)" :class="{disable: (10-j+i*10-10+1)>floorCount, active: checkActive((10-j+i*10-10+1))}" v-for="j in 10" :key="10-j+i*10-10+1" class="lift-btn">{{10-j+i*10-10+1}}</div>
          </div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    props: {
        lift:null
    },

    data() {
        return {
            active:[],
        }
    },

    computed: mapGetters(['floorCount','weight']),

    methods: {
        callElevator (floor) {
            if (!this.checkActive(floor) && floor<=this.floorCount && this.lift.people>0) {
                this.active.push(floor);
                if (!this.lift.checkTarget(floor))
                    this.lift.to.push(floor);
                if (this.lift.state==4) {
                    if (floor>Math.floor(this.lift.floor)) {
                        this.lift.direction=1;
                        this.lift.onPath=1;
                    }
                    else if (floor<Math.floor(this.lift.floor)) {
                        this.lift.direction=0;
                        this.lift.onPath=0;
                    }
                    if (floor==Math.floor(this.lift.floor)) {
                        this.lift.delTarget(floor);
                        this.lift.DoorOpen();
                    }
                    else {
                        this.lift.closeAndMove();
                    }
                }
            } else this.noActive(floor);
        },

        checkWeight() {
            return this.lift.weightSum>this.weight;
        },

        getImageNum() {
            var result = 0;
            if (this.checkWeight()) result = 1;
            return result;
        },

        noActive (num) {
            for (var i=0; i<this.active.length; i++) {
                if (this.active[i]==num) {
                   this.active.splice(i,1);
                   break;
                }
            }
        },

        clearActive() {
           this.active.splice(0,this.active.length);
        },

        checkActive(num) {
            for (var i=0; i<this.active.length; i++) {
                if (this.active[i]==num) {
                    return true;
                }
            }
            return false;
        }
    },
    mounted () {
        this.lift.controller=this;
    }
}
</script>

<style lang="sass" scoped>
    .controll
        width: 200px
        background: #F9FAFA
        border: 1px solid #D8E2F0
        box-sizing: border-box
        border-radius: 5px
        padding-bottom: 14px
        position: relative
        &:not(:last-child)
            margin-right: 20px

        h4
            font-family: Roboto
            font-style: normal
            font-weight: bold
            font-size: 16px
            line-height: 18px
            text-align: center
            color: #638CC2
            margin-top: 15px
            margin-bottom: 10px
        .weight-block
            display: flex
            justify-content: center
        .weight 
            font-family: Roboto
            background: #0E3058
            box-shadow: inset 0px 1px 0px rgba(5, 28, 54, 0.2)
            border-radius: 3px
            min-width: 120px
            height: 25px
            display: inline-flex
            align-items: center
            padding: 4px 0px 4px 4px
            box-sizing: border-box
            position: relative
            .img
                display: flex
                align-items: center
            .info 
                font-size: 8px
                line-height: 11px
                color: #EBF5F7
                margin-left: 3px
            .error
                font-weight: bold
                font-size: 4px
                line-height: 4px
                display: flex
                align-items: center
                text-align: center
                letter-spacing: 0.15em
                text-transform: uppercase
                color: #FF5C5C
                position: absolute
                left: 19.97%
                right: 62.53%
                top: 15.16%
                bottom: 68.84%
        .button-panel
            display: flex
            margin: 10px auto 0
            justify-content: center
            .column:not(:last-child)
                margin-right: 21px
        .lift-btn
            box-sizing: border-box
            background: #FFFFFF
            border: 2px solid #638CC2
            color: #638CC2
            border-radius: 50%
            width: 30px
            height: 30px
            display: flex
            align-items: center
            justify-content: center
            font-weight: bold
            font-size: 14px
            cursor: pointer
            margin-bottom: 11px
            &:hover
                border: 2px solid #3166AC
                color: #3166AC
        .active 
            border: 2px solid #F8941F
            color: #F8941F
            &:hover
                border: 2px solid #F8941F
                color: #F8941F
        .disable 
            border: 2px solid #EBF5F7
            color: #EBF5F7
            cursor: default
            &:hover
                border: 2px solid #EBF5F7
                color: #EBF5F7
        .pin 
            width: 10px
            height: 10px 
            position: absolute
            background: url('../assets/svg/pin.svg') no-repeat center

        .pin-1 
            left: 5px
            top: 5px
        .pin-2 
            right: 7px
            top: 5px
        .pin-3 
            left: 5px
            bottom: 7px
        .pin-4
            right: 7px
            bottom: 7px

</style>
