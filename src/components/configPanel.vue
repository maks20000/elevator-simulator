<template>
  <div class="panel">
        <div class="item">
          <label for="floor">Количество этажей</label>
          <div class="select">
            <select id="floor" :value="floors"  v-model="floors" >
                <option v-for="i in maxFloor-minFloor+1" :value="i+minFloor-1" :key="i">{{i+minFloor-1}}</option>
            </select>
          </div>
        </div>
        <div class="item">
          <label for="elevator">Лифтов</label>
          <div class="select">
            <select id="elevator" :value="elevators" v-model="elevators">
                <option v-for="i in maxElevators" :value="i" :key="i">{{i}}</option>
            </select>
          </div>
        </div>
        <div class="item">
          <label for="tonnage">Грузоподъемность лифтов</label>
          <div class="select">
            <select id="tonnage" :value="tonn" v-model="tonn">
                <option v-for="(item, index) in tonnage" :value="item" :key="index">{{item}}</option>
            </select></div> кг
        </div>
        <div class="item">
            <button @click="SetParams">Поехали!</button>
        </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            maxFloor:30,
            minFloor:9,
            maxElevators:6,
            elevators:1,
            floors:9,
            tonn:800,
            tonnage:this.GetTonnage(800,1300,100),
        }
    },
    methods: {
        GetTonnage (min, max, step) {
            var result=new Array();
            var count = (max-min)/step;

            for(var i=0; i<=count; i++) {
                result.push(min+step*i)
            }
            return result;
        },

        SetParams () {
            this.$store.commit("setFloorCount",this.floors);
            this.$store.commit("setElevatorCount",this.elevators);
            this.$store.commit("tonnageNum",this.tonn);
            this.$store.commit("show",true);
        }
    }
}
</script>

<style lang="sass" scoped>
    .panel 
        display: flex
        justify-content: space-between
        align-items: center
        border-radius: 5px
        border: 1px solid #E1E9F3
        background: #F9F9FA
        padding: 30px 27px
        
    label 
        font-family: Roboto
        font-style: normal
        font-weight: normal
        font-size: 16px
        line-height: 19px
        color: #0E3058
    select 
        width: 66px
        height: 39px
        border-radius: 2px
        border: 1px solid #638CC2
        box-sizing: border-box
        margin-left: 8px
        padding-left: 8px
        color: #0E3058
        -webkit-appearance: none
        -moz-appearance: none
        appearance: none
    .select
        position: relative
        display: inline-block
        &:before 
            content: ""
            padding: 0 8px
            position: absolute
            right: 8px
            top: 12px
            z-index: 1
            text-align: center
            width: 15px
            height: 15px
            pointer-events: none
            box-sizing: border-box
            background: url('../assets/svg/select-g.svg') no-repeat center

    button
        background: #3166AC
        border-radius: 4px
        border: 0px
        width: 173px
        height: 46px
        color: #fff
        font-size: 16px
        line-height: 19px
</style>