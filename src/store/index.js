import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store ({
    state: {
        step:null,
        floorCount:9,
        elevatorCount:1,
        tonnageNum:800,
        pressed: [],
        elevator: []
    },

    actions: {
        setTargetForLift (context) {
            var pressed = context.getters.pressed;
            for (var i=0; i<pressed.length; i++) {
                    console.log("Проверка "+pressed[i].floor.num+" этаж")
                    var selected=null;
                    var num = pressed[i].floor.num;
                    if (pressed[i].lift!=null) {
                        if (pressed[i].lift.state==1 && pressed[i].lift.to[0]==num) continue;
                        if ((pressed[i].lift.state==4 || pressed[i].lift.state==3 || pressed[i].lift.state==1) && 
                            pressed[i].lift.checkTarget(num) && !pressed[i].lift.controller.checkActive(num)) {
                            pressed[i].lift.delTarget(num)
                            if (pressed[i].lift.people>0 && pressed[i].lift.to.length==0) {
                                pressed[i].lift.state=4
                            }
                        }
                    }
                    var elevator=new Array();
                    for (var j=0; j<context.getters.elevator.length; j++) {
                        var lift=context.getters.elevator[j];
                        if (context.getters.weight-lift.weightSum<120) continue;
                        if (pressed[i].dir==1) {
                            if ((lift.state==0 && lift.onPath==null) || lift.onPath==1) {
                                    elevator.push(lift);    
                                }
                        }
                        else if (pressed[i].dir==0) {
                            if (lift.state!=2 && (lift.state==0 && lift.onPath==null) || lift.onPath==0) {
                                    elevator.push(lift);    
                                }
                        }
                    }
                    
                    if (elevator.length>0) {
                        console.log(elevator);
                        var lift = elevator[0];
                        var dists = new Array();
                        for (var j=0; j<elevator.length; j++) {
                            var d = (Math.abs(num-elevator[j].floor));
                            if (elevator[j].state==1) d-=1;
                            dists.push(d);
                        }
                        if (selected==null) {
                            selected = elevator[0];
                            var dist = dists[0];
                            for (var j=1; j<dists.length; j++) {
                                if (dist>dists[j]) {
                                    selected=elevator[j];
                                    dist=dists[j];
                                }
                            }
                        }
                        if (pressed[i].lift!=null) {
                            if (selected!=pressed[i].lift) {
                                if (!pressed[i].lift.controller.checkActive(num)) {
                                    pressed[i].lift.delTarget(num)
                                }
                                pressed[i].lift=selected;
                            }
                        } else pressed[i].lift=selected;

                        

                        if (!selected.checkTarget(num) && selected.state!=4) {
                            
                            selected.to.push(num)
                        }

                        if (selected.state==0) {
                            selected.onPath=pressed[i].dir;
                            if (selected.floor<num) selected.direction=1
                            else selected.direction=0
                            selected.Move();
                        }
                        else if (selected.state==4 && Math.floor(selected.floor)==num && selected.onPath==pressed[i].dir) {
                            selected.DoorOpen()
                        }
                    }
                
            }
        }
    },

    mutations: {
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
        }
    },

    getters: {
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
    }
})