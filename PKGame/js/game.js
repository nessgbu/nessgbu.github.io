function getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

function getPercent(per){
    var ran = getRandom(1,100);
    if (ran <= per)
        return true;
    else
        return false;
}

var playerList = [];
function Player(name,minAggr,maxAggr){
    this.name = name;
    this.minAggr = minAggr;
    this.maxAggr = maxAggr;
    this.health = 100;
    this.alive = true;
}
Player.prototype = {
    constructor : Player,
    getAggr : function(){
        return getRandom(this.minAggr,this.maxAggr);
    },
    getObj : function(){
        var iobj = playerList[getRandom(0,playerList.length-1)];
        if ( iobj.alive && iobj != this ){
            console.log(iobj);
            return iobj;
        }else
            this.getObj();
            
    },
    attack : function(){
        var aggr = this.getAggr();
        var obj = this.getObj();
        obj.attacked(aggr);
        console.log(obj);
    },
    attacked : function(aggr){
        this.health -= aggr;
        if ( this.health <= 0 )
            this.alive = false;
    }
};

var skill = {
    multiAttack : function(percent){
        var aggr = this.getAggr();
        var per = getPercent(percent);
        console.log(this.name + " 发动了攻击 " + aggr);
        

        
    }
};

var lbc = new Player("中二刘布超",5,10);
playerList.push(lbc);
var lql = new Player("臭猪刘青龙",5,10);
playerList.push(lql);
var nsy = new Player("废宅牛思尧",5,10);
playerList.push(nsy);
var qdy = new Player("降智祁德宇",5,10);
playerList.push(qdy);
window.onload = function(){
    lbc.attack();
};

window.addEventListener('resize',function(e){
    alert('height: ' + window.innerHeight + ' width: ' +window.innerWidth)
},false)

