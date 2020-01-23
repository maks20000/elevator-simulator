<template>
  <div :style="{bottom: position+'px'}" class="elevator">
      <div class="doors">
        <div :class="{tr:isOpen}" class="door door-left"></div>
        <div :class="{tr:isOpen}" class="door door-right"></div>  
        <div :style="{opacity: opacity}" class="people"><img :src="'/src/assets/svg/lift_person_0'+setImage()+'.svg'" alt=""></div>
      </div>
      <span class="num">- {{id}} -</span>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
export default {
    props: {
        id:null,
    },
    data() {
        return {
            step:136,
            isOpen:false,
            direction:1,
            to:[],
            onPath:null,
            floor:1,
            position:0,
            people:0,
            weight:[],
            weightSum:0,
            opacity:0,
            state:0,
            controller:null,
        }
    },
    computed: mapGetters(['pressed','mainLogic']),
    methods: {

        setImage () {
           return Math.min(6,this.people)
        },

        Move() { 
          var speed=1.0;
          var velocity=0;
          var step=0.01;
          var to=this.position;
          this.state=1;
          if (this.direction==0) {
            step*=-1;
            speed*=-1;
          }  
          var interval = setInterval(() => { 
             this.step=this.$store.getters.step.offsetHeight; 
             var target = this.GetFloorTarget ();
             if (!target) {
                 this.ChangeDirection();
                 step*=-1;
                 speed*=-1;
                 target = this.GetFloorTarget ();
                 if (!target) clearInterval(interval);
             }
             var toPosition = this.step*(target-1);
             var dist = Math.abs (toPosition - this.position);

             if (dist>50) {
                if ((this.direction==1 && velocity < speed) || (this.direction==0 && velocity > speed)) velocity+=step
                 to+=velocity;
             }
             if (dist<60) {
                 this.state=2;
                 to=this.lerp(this.position,toPosition,0.015)
                 if ((this.direction==1 && toPosition - to<0.01) || (this.direction==0 && to<0.01)) to=toPosition;
             }
        
             this.position=to;
             this.floor=this.position/this.step+1;
             if ((this.position>=toPosition && this.direction==1) || (Math.floor (this.position)<=toPosition && this.direction==0)) {
                 clearInterval(interval);
                 setTimeout(() => {
                     this.DoorOpen();
                 }, 1000);
             }
          }, 10);
        },

        checkTarget (target) {
            for (var i=0; i<this.to.length; i++) {
                if (this.to[i]==target) {
                   return true
                }
            }
            return false
        },

        delTarget (target) {
            for (var i=0; i<this.to.length; i++) {
                if (this.to[i]==target) {
                    this.to.splice(i,1);
                    break;
                }
            }
        },

        getStops(floor, direction) {
            var targets=this.to;
            var result=0;
            if (direction==1) {
                targets=targets.sort();
                for (var i=0; i<targets.length; i++) {
                    if (targets[i]<floor) result++;
                }
            }
            else if (direction==0) {
                targets=targets.sort(function(a,b){return b-a});
                for (var i=0; i<targets.length; i++) {
                    if (targets[i]>floor) result++;
                }
            }
            return result;
        },

        GetFloorTarget () {
            if (this.direction==1) {
                this.to=this.to.sort();
            }
            else if (this.direction==0) {
                this.to=this.to.sort(function(a,b){return b-a});
            }  
            for (var i=0; i<this.to.length; i++) {
                if (this.direction==1 && this.to[i]>=this.floor) {
                    return this.to[i];
                }
                if (this.direction==0 && this.to[i]<=this.floor) {
                    return this.to[i];
                }
            }
            return false;
        },

        ChangeDirection() {
            if (this.direction==1) {
                this.direction=0
            }
            else if (this.direction==0) {
                this.direction=1
            }
        },

        DoorOpen () {
            this.isOpen=true;
            this.state=3;
            var inPeople = false;
            this.delTarget(Math.floor(this.floor));
            inPeople = this.clearPressed();
            setTimeout(() => {
                this.opacity=0;
                setTimeout(() => {
                    if (this.people>0 && this.controller.checkActive(Math.floor(this.floor))) {
                        var out;
                        if (Math.floor(this.floor)==this.$store.getters.floorCount || Math.floor(this.floor)==1) out=this.people;
                        else out = this.Random(1,this.people)

                        this.Out(out);
                    }

                    this.controller.noActive(Math.floor (this.floor));


                    if (inPeople) {
                        var people = this.Random(1,5);
                        this.In(people);
                    }
                    if (this.people>0)
                        setTimeout(()=>{
                            this.opacity=1;
                        },500)
                    if (this.people==0) {
                        this.clearPressed();
                    }
                    if (this.weightSum>this.$store.getters.weight) {
                        this.mainLogic.setTargetForLift();
                        this.Unload();
                    } else this.CloseDoor();
                }, 1000);              
            }, 1200);
        },

        clearPressed () {
            var inPeople=false;
            for (var i=0; i<this.pressed.length; i++) {
                if (this.pressed[i].floor.num==Math.floor (this.floor)) {
                    if (this.pressed[i].dir==1 && this.onPath==1 || (this.pressed[i].dir==1 && this.to.length==0 && (this.pressed[i].lift==null || this.pressed[i].lift==this))) {
                        this.pressed[i].floor.up=false;
                        this.pressed.splice(i,1);
                        this.direction=1
                        inPeople=true;
                        break;
                    }
                    else if ((this.pressed[i].dir==0 && this.onPath==0) || (this.pressed[i].dir==0 && this.to.length==0 && (this.pressed[i].lift==null || this.pressed[i].lift==this))) {
                        this.pressed[i].floor.down=false;
                        this.pressed.splice(i,1);
                        this.direction=0
                        inPeople=true;
                        break;
                    }
                }
            }
            return inPeople;
        },

        Unload () {
            var intervalId = setInterval(() => {
                if (this.weightSum>this.$store.getters.weight) {
                    this.opacity=0;
                    setTimeout(() => {
                        this.Out(1);
                        this.opacity=1;
                    }, 1000);
                }
                else {
                    clearInterval(intervalId);
                    this.CloseDoor();
                }
            }, 3000);
        },

        clearTargets() {
            this.to.splice(0,this.to.length);
            this.controller.clearActive();
            this.onPath=null;
        },

        CloseDoor () {
            setTimeout(() => {
                if (this.people==0) {
                    this.state=0;
                    this.clearTargets();
                    setTimeout(() => {
                        this.mainLogic.setTargetForLift();
                    }, 2000);
                    this.isOpen=false;
                }
                else if  (this.to.length==0 || this.controller.active.length==0) {
                    this.state=4;
                }


                if (Math.floor(this.floor)==this.$store.getters.floorCount) this.direction=0;
                else if (Math.floor(this.floor)==1) this.direction=1;


                if (this.to.length>0 && this.state!=0 && this.controller.active.length>0) {
                    this.closeAndMove();
                }
            }, 1000);
        },

        closeAndMove () {
            this.isOpen=false;
            setTimeout(() => {
                this.Move();
                this.mainLogic.setTargetForLift();
            }, 1200);
        },

        Out (count) {
            this.people-=count;
            for(var i = 0; i < count; i++) {
                var w = this.Random(0,this.weight.length-1);
                this.weightSum-=this.weight[w];
                this.weight.splice(w,1);
            }
        },

        In (count) {
            this.people+=count;
             for (var i = 0; i < count; i++) {
                var w = this.Random(45,120); 
                this.weight.push(w);
                this.weightSum+=w;
             }
        },
  
        lerp (start, end, amt) {
            return (1-amt)*start+amt*end
        },

        Random(min, max) {
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }
    },

    mounted() {
        this.$store.commit("elevator",this);
    }
}
</script>

<style lang="sass" scoped>

    .elevator 
        width: 61px
        height: 75px
        border: 2px solid #638CC2
        margin-bottom: 5px
        background-color: #fff
        z-index: -2
        .doors
            position: relative
            display: flex
            justify-content: space-between
            .people
                position: absolute
                transition: all 1s ease
                bottom: -2px
                display: flex
                align-items: flex-end
                opacity: 0
                z-index: -1
                img
                    width: 100%
            .door
                background-color: rgba(235, 245, 247, 0.5)
                box-sizing: border-box
                width: calc(61px / 2)
                height: 75px
                transition: all 1s ease
            .door-left
                border-right: 1px solid #638CC2
            .door-right 
                border-left: 1px solid #638CC2
            .tr 
                width: 5px
        .num 
            text-align: center
            display: block
            width: 100%
            font-size: 18px
            color: #3166AC
            position: absolute
            top: -26px

</style>

