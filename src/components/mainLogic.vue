<template>
  
</template>

<script>
import {mapGetters} from 'vuex'
export default {

    data() {
        return {
            path:[],
        }
    },
    mounted() {
        this.$store.commit("mainLogic",this)
        setInterval(() => {
            this.OptimizePath ()

      }, 1000);
    },

    computed: mapGetters(['getPressedAtNum','elevator','pressed','floorCount','getFloorDir','getMaxFloor','getMinFloor','getElevatorMinDist',
    'getElevatorsTop','getElevatorsBottom','getElevatorsTargetPath','getElevatorsWeight',
    'getElevatorsDirection','getElevatorsMove', 'getElevatorsWithState', 'getElevatorsAtDir', 'getMinFloorAtDir', 'getElevatorsNoPeople','getNumFloor']),

    methods: {
        setTargetForLift () {
            var elevators = this.elevator;
            var floors = this.pressed;
            floors.forEach(floor => {
                var num = floor.floor.num 
                this.startLift(floor)
            if (floor.lift!=null)
                console.log("Этаж "+num+" вызов "+floor.dir+" Лифт "+floor.lift.id)
            });
        },

        OptimalTargets(lift, floor) {
            if (lift.onPath!=null && lift.onPath != floor.dir && floor.lift==lift) {
                lift.delTarget(floor.floor.num);
                floor.lift=null;
            }
        },

        changeTarget (lift, target) {
            if (target.lift!=null && target.lift!=lift) {
                console.log(999);
                if (!(target.lift.to[0]==target.floor.num && target.lift.state==2) && !(target.lift.direction==this.reverseDir(target.dir) && target.lift.onPath==target.dir)) {
                    console.log(888);
                    if (!target.lift.controller.checkActive(target.floor.num)) {
                        target.lift.delTarget(target.floor.num)
                    }
                } else lift=target.lift
            }
            target.lift=lift;
            this.setTarget(target.lift, target);
        },

        setTarget (elevator, target) {
            if (elevator!=null) {
                elevator.onPath=target.dir;
                if (!elevator.checkTarget(target.floor.num) && elevator.floor!=target.floor.num) {
                    elevator.to.push(target.floor.num)
                    if (elevator.state==0) elevator.Move();
                }
                else if (elevator.floor==target.floor.num && elevator.state!=1 && elevator.state!=2) {
                    elevator.DoorOpen()
                }
            }
        },

        reverseDir (dir) {
            if (dir==1) return 0
            else return 1
        },

        OptimizePath () {
            var pressed=this.pressed;
            pressed.forEach((floor)=> {
                var lifts = this.getElevatorsAtDir(this.reverseDir(floor.dir),floor);
                if (lifts.length>0) {
                    lifts=this.getElevatorsDirection(lifts,floor.dir);
                    if (lifts.length>0) {
                        lifts=this.getElevatorsTargetPath(lifts,floor.dir);
                        if (lifts.length>0) {
                           // lifts=this.getElevatorsMove(lifts);
                           // if (lifts.length>0) {
                               var lift = this.getElevatorMinDist(lifts,floor.floor.num);
                               this.changeTarget (lift, floor)
                           // }
                        }
                    }
                }
            })
        },

        
        findMoveLift (dir,numFloor) {       
            var lifts = this.getElevatorsAtDir(this.reverseDir(dir),this.getPressedAtNum(numFloor,dir));
            lifts=this.liftsMove=this.getElevatorsMove(lifts)
            if (lifts.length>0) {
                var liftsMove=this.getElevatorsMove(lifts)
                if (liftsMove.length>0) {
                    liftsMove=this.getElevatorsTargetPath(liftsMove,dir)
                    if (liftsMove.length>0) {
                        var lift = this.getElevatorMinDist(liftsMove,numFloor)
                      //  console.log("findMoveLift id "+lift.id);
                        return lift;
                    }
                }
            }
            return null;
        },

        findOptimalNoActive (dir,numFloor) {
            var lifts = this.getElevatorsAtDir(this.reverseDir(dir),this.getPressedAtNum(numFloor,dir));
            if (lifts.length>0) {
                var bottomLift = this.getElevatorMinDist(lifts,numFloor);
                console.log(this.getPressedAtNum(numFloor,dir))
                var topLift = this.getElevatorsAtDir(dir,this.getPressedAtNum(numFloor,dir));
                if (topLift.length>0)  {
                    topLift = this.getElevatorMinDist(topLift,numFloor);
                    if (Math.abs(numFloor-bottomLift.floor)>4 && Math.abs(numFloor-bottomLift.floor)>Math.abs(numFloor-topLift.floor)) {
                       // console.log(num+"условие лифт вкрхний или нижний id "+topLift.id)
                        return topLift;
                    } 
                }
                return bottomLift;
            }
            return null
        },

        findReverseLift (dir,numFloor) {
            //lifts = this.getElevatorsTargetPath(elevators,floor.dir);
            var lifts = this.getElevatorsAtDir(floor.dir,this.getPressedAtNum(numFloor,dir));
            if (lifts.length>0) {
                lifts = this.getElevatorsNoPeople(lifts)
                if (lifts.length>0) {
                    var floorDir = this.getFloorDir(floor.dir);
                    var minFloor = this.getMinFloorAtDir(floor.dir,floorDir);
                    var lift = this.getElevatorMinDist(lifts,numFloor)
                    if (lift.onPath==floor.dir || lift.onPath==null) {
                        if (minFloor.floor.num==numFloor) {
                            //console.log(numFloor+"условие reverse id "+lift.id)
                            return lift;
                        } else  {
                           // console.log(numFloor+"условие reverse else id "+lift.id)
                            this.clearElevatorTarget (lift,this.getPressedAtNum(numFloor,dir))
                        }
                    } 
                }
            }
            return null
        },

        clearElevatorTarget (lift,floor) {
            if (floor.lift!=null) {
                if (lift.to[0]!=floor.num && lift.state!=2) {
                    if (!floor.lift.controller.checkActive(floor.floor.num)) {
                        lift.delTarget(floor.floor.num)
                    }
                }
            }
        },


        startLift(floor) {
            var num = floor.floor.num;
            var lift = this.findMoveLift(floor.dir, num);
            console.log("направление "+floor.dir)

            console.log("Запускаю findMoveLift")
            if (lift == null)
            {
                console.log("findMoveLift вернул null")
                console.log("Запускаю findOptimalNoActive")
                lift = this.findOptimalNoActive(floor.dir, num)

                if (lift == null) {
                    console.log("findOptimalNoActive вернул null")
                    console.log("Запускаю findReverseLift")
                    lift = this.findReverseLift(floor.dir, num)

                }
            }
            if (lift!=null) {
                console.log("запускаю changeTarget")
                this.changeTarget (lift, floor)
            }
        }
    }

}
</script>

<style>

</style>