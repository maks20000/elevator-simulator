<template>
  
</template>

<script>
import {mapGetters} from 'vuex'
export default {

    mounted() {
        setInterval(() => {
        this.setTargetForLift();
      }, 1000);
    },

    computed: mapGetters(['elevator','pressed','floorCount','getFloorDir','getMaxFloor','getMinFloor','getElevatorMinDist',
    'getElevatorsTop','getElevatorsBottom','getElevatorsTargetPath',
    'getElevatorsDirection','getElevatorsMove', 'getElevatorsWithState']),

    methods: {
        setTargetForLift () {
            var elevators = this.elevator;
            var floors = this.pressed;
            floors.forEach(floor => {
                var num = floor.floor.num 
                if (floor.dir==1) {

                    var allFloorDir = this.getFloorDir(floor.dir);
                    var lifts = this.getElevatorsBottom(num);
                    lifts=this.getElevatorsDirection(lifts,floor.dir)
                    if (lifts.length>0) {
                        var liftsMove=this.getElevatorsMove(lifts)
                        if (liftsMove.length>0) {
                            this.changeTarget(liftsMove,floor);
                        }
                        else {
                            var bottomDist = Math.abs(num - this.getElevatorMinDist(lifts,floor.num));
                            var topDist = Math.abs(num - this.getElevatorMinDist(this.getElevatorsTop(num),num));
                            ///////////
                            this.changeTarget(lifts,floor);
                        }
                    } else {
                        lifts = this.getElevatorsWithState(0);
                        if (lifts.length>0) {
                            var floorDir = this.getFloorDir(floor.dir);
                            var minFloor = this.getMinFloor(floorDir);
                            if (minFloor===floor) {
                                this.changeTarget(lifts,floor);
                            }
                        }
                    }
                }
            });
        },

        changeTarget (elevators, target) {
            var lift = this.getElevatorMinDist(elevators,target.floor.num)
            if (target.lift!=null && target.lift!=lift) {
                if (target.lift.to[0]!=target.floor.num && target.lift.state!=2) {
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
        }
    }

}
</script>

<style>

</style>