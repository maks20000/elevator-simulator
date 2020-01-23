import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store ({
    state: {
        showBuild:false,
        step:null,
        floorCount:9,
        elevatorCount:1,
        tonnageNum:800,
        pressed: [],
        elevator: [],
        mainLogicObject:null,
    },

    mutations: {
        show (state,value) {
            state.showBuild=value
        },
        setFloorCount(state,value) {
            state.floorCount=value;
        },
        setElevatorCount(state,value) {
            state.elevatorCount=value;
        },
        tonnageNum(state,value) {
            state.tonnageNum=value;
        },
        pressed(state,floor) {
            state.pressed.push(floor);
        },
        elevator(state,elevator) {
            state.elevator.push(elevator);
        },
        step(state,step) {
            state.step=step;
        },

        mainLogic(state,mainLogic) {
            state.mainLogicObject=mainLogic;
        },
    },

    getters: {
        show (state) {
            return state.showBuild;
        },
        mainLogic (state) {
            return state.mainLogicObject;
        },
        step (state) {
            return state.step;
        },
        floorCount (state) {
            return state.floorCount;
        },
        elevatorCount (state) {
            return state.elevatorCount;
        },
        weight (state) {
            return state.tonnageNum;
        },
        pressed (state) {
            return state.pressed;
        },
        elevator (state) {
            return state.elevator;
        },

        getPressedAtNum: (state,getters) => (num, dir) => {
            var onDir = getters.getFloorDir(dir);
            return(onDir.filter((item)=>{
                return item.floor.num==num;
            }))[0];
        },

        getFloorDir: (state) => (dir) => {
            return(state.pressed.filter((item)=>{
                return item.dir==dir;
            }))
        },

        getNumFloor: () => (floor) => {
            var result=new Array();
            floor.forEach((item)=> {
                result.push(item.floor.num);
            })
            return result;
        },


        getMinFloorAtDir: (state,getters) => (dir,floors) => {
            if (dir==0) return getters.getMaxFloor(floors)
            else return  getters.getMinFloor(floors)
        },

        getMaxFloor: (state) => (floors) => {
            var result=null
            if (floors.length) {
                result=floors[0];
                for (var i=1; i<floors.length; i++) {
                    if (result.floor.num<floors[i].floor.num) {
                        result=floors[i];
                    }
                }
            }
            return result;
        },

        getMinFloor: (state) => (floors) => {
            var result=null
            if (floors.length) {
                result=floors[0];
                for (var i=1; i<floors.length; i++) {
                    if (result.floor.num>floors[i].floor.num) {
                        result=floors[i];
                    }
                }
            }
            return result;
        },

        getElevatorMinDist: (state) => (elevators,floor) => {
            var result=elevators[0];
            var dist=Math.abs(floor-result.floor)
            for (var i=0; i<elevators.length; i++) {
                var d = Math.abs(floor-elevators[i].floor)
                if (d < dist) {
                    result=elevators[i];
                    dist=d;
                }
            }
            return result
        },

        getElevatorsTop: (state) => (floor) => {
            var result = new Array();
            state.elevator.forEach((lift)=>{
                if ((state.tonnageNum - lift.weightSum >= 120 && lift.floor>=floor.floor.num) && (lift.onPath==null || lift.onPath==floor.dir)) result.push(lift);
            })
            return result
        },

        getElevatorsAtDir: (state, getters) => (dir, floor) => {
            if (dir==0) return getters.getElevatorsBottom(floor)
            else return getters.getElevatorsTop(floor)
        },

        getElevatorsBottom: (state,getters) => (floor) => {
            var result = new Array();
            state.elevator.forEach((lift)=>{
                if ((state.tonnageNum - lift.weightSum >= 120 && lift.floor<=floor.floor.num) && (lift.onPath==null || lift.onPath==floor.dir)) result.push(lift);
            })
            return result
        },

        getElevatorsWeight: (state) => (elevators) =>{
            return (elevators.filter((lift)=> {
                return state.tonnageNum - lift.weightSum >= 120 
            }))
        },

        getElevatorsTargetPath: (state) => (elevators,dir) =>{
            return (elevators.filter((lift)=> {
                return lift.onPath==dir
            }))
        },

        getElevatorsDirection: (state) => (elevators,dir) =>{
            return (elevators.filter((lift)=> {
                return lift.direction==dir
            }))
        },

        getElevatorsMove: (state) => (elevators) => {
            return (elevators.filter((lift)=> {
                return lift.state==1
            }))
        },

        getElevatorsNoPeople: (state) => (elevators) => {
            return (elevators.filter((lift)=> {
                return lift.people==0
            }))
        },

        getElevatorsNoTargets: (state) => (elevators) => {
            return (elevators.filter((lift)=> {
                return lift.to.length==0
            }))
        },

        getElevatorsWithState: (state) => (s) => {
            return (state.elevator.filter((lift)=> {
                return lift.state==s
            }))
        }
    }
})