var message = '';
var teamA,teamB,player1,player2,player3,player4,player5,player6;
var roundCount = 0;
//武将 构造函数
function Player(name='工具人',head='default',attack=278.32,intelligence=130.45,speed=137.7){
    this.main = 0;
    this.name = name;
    this.head = head;
    this.attack = attack;
    this.intelligence = intelligence;
    this.speed = speed;
    this.team = null;
    this.skills = [skilllist.defaultSkill,skilllist.defaultSkill,skilllist.defaultSkill];
    this.skillState0 = {
        readyState : 0,
        damage : 0,
        count : 0
    };
    this.skillState1 = {
        readyState : 0,
        damage : 0,
        count : 0
    };
    this.skillState2 = {
        readyState : 0,
        damage : 0,
        count : 0
    };
    this.att = {
        count : 0,
        damage : 0
    };
    this.bedamaged = 0;
    this.buff = {},
    this.debuff = {
        confusion : {
            name : '混乱',
            restRound : 0,
            from : null
        },
        silence : {
            name : '禁言',
            restRound : 0,
            from : null
        },
        coma : {
            name : '震慑',
            restRound : 0,
            from : null
        },
        disarm : {
            name : '缴械',
            restRound : 0,
            from : null
        },
        sandstorm :　{
            name : '沙暴',
            restRound : 0,
            from : null,
            damage : 0
        }
    }
};
Player.prototype = {
    getDamage : function(){
        let damage = 0;
        damage += this.skillState0.damage;
        damage += this.skillState1.damage;
        damage += this.skillState2.damage;
        damage += this.att.damage;
        return damage;
    },
    //获取 攻击目标数组 函数
    getObj :  function(quantity) {
        let objs = [];
        if(this.debuff.confusion.restRound){
            let team = [...teamAll];
            team.splice(team.findIndex((val,index,arr) => {
                return val == this;
            }),1);
            
            for(let i = 1;i <= quantity;i++){
                let index = getRandomNum(1,team.length) - 1;
                objs.push(team[index]);
                team.splice(index,1);
            }
            return objs;
        }
        if(this.team == teamA){
            let team = [...teamB.list];
            for(let i = 1;i <= quantity;i++){
                let index = getRandomNum(1,team.length) - 1;
                objs.push(team[index]);
                team.splice(index,1);
            }
            return objs;
        }
        if(this.team == teamB){
            let team = [...teamA.list];
            for(let i = 1;i <= quantity;i++){
                let index = getRandomNum(1,team.length) - 1;
                objs.push(team[index]);
                team.splice(index,1);
            }
            return objs;
        }
        return objs;
    },
    //发动技能
    skillLaunch : function(skill,player,state){
        if(state.readyState){
            skill.launch(player,state);
            state.readyState = 0;
            return ;
        }
        if(getRandomNum(1,1000) <= skill.probability){
            skill.start(player,state);
            if(skill.needReady){
                state.readyState = 1;
            }
        }  
        
    },
    //行动
    go : function(){
        message += `<b>【${this.name}回合】</b><br>`
        if(this.debuff.sandstorm.restRound){
            this.bedamaged += this.debuff.sandstorm.damage;
            this.debuff.sandstorm.from.damage += this.debuff.sandstorm.damage;
            message += `
                <span style="font-weight:bold">${this.name}</span>受到来自${this.debuff.sandstorm.from.name}的沙暴效果战损<span style="color:red">${this.debuff.sandstorm.damage}</span><br>
            `;
            this.debuff.sandstorm.restRound -= 1;
        }
        if(!this.debuff.coma.restRound){
            if(!this.debuff.silence.restRound){
                    this.skillLaunch(this.skills[0],this,this.skillState0);
                    this.skillLaunch(this.skills[1],this,this.skillState1);
                    this.skillLaunch(this.skills[2],this,this.skillState2);
                
            }else{
                message += `${this.name}+处于来自${this.debuff.silence.from.name}的禁言状态，无法发动技能<br>`
                this.debuff.silence.restRound -= 1;
            }
            if(!this.debuff.disarm.restRound){
                let obj = this.getObj(1);
                let damage = Math.floor(this.attack);
                this.att.damage += damage;
                this.att.count ++;
                obj[0].bedamaged += damage;
                message += `<span style="font-weight:bold"> ${this.name} </span>对 <span style="font-weight:bold">${obj[0].name}</span> 发动了普通攻击,<br>
                <span style="font-weight:bold">${obj[0].name}</span>受到<span style="color:red">${damage}</span>点伤害<br>
                `
            }else{
                message += `${this.name}处于来自${this.debuff.disarm.from.name}的缴械状态，无法普通攻击<br>`;
                this.debuff.disarm.restRound -= 1;
            }
        }else{
            message += `${this.name}处于来自${this.debuff.coma.from.name}的震慑状态，无法行动<br>`;
            this.debuff.coma.restRound -= 1;
        }
        message += `<br>`;
    }
}

//随机值函数0
function getRandomNum(first,last){
    let num = Math.floor(Math.random()*(last-first+1))+first;
    return num;
}

//技能列表
var skilllist = {
    yijujianmie : {
        name : "一举歼灭",
        parent : '张梁',
        probability :　400,
        damage : 3.35,
        needReady : true,
        start : function(player){
            message += `<span style="font-weight:bold">${player.name}</span> 准备发动<span style="color:orange"> ${this.name} </span><br>`;
            
        },
        launch : function(player,state){
            let attackDamage = Math.floor(player.attack * this.damage);
            let objs = player.getObj(1);
            state.damage += attackDamage;
            state.count++;
            objs[0].bedamaged += attackDamage;
            if(objs[0].debuff.sandstorm.restRound){
                objs[0].debuff.confusion.restRound = 2;
                objs[0].debuff.confusion.from = player;
                message += `<b>${objs[0].name}</b>进入沙暴状态<br>`
            }
            message += `<span style="font-weight:bold">${player.name}</span> 发动了<span style="color:orange"> ${this.name} </span><br>
            <span style="font-weight:bold">${objs[0].name}</span> 受到 <span style="color:red">${attackDamage}</span> 点兵刃伤害<br>
            `
        }
    },
    tujishangrou : {
        name : "屠几上肉",
        parent : '曹真',
        attack : 1.5,
        magic : 1.5,
        probability :　350,
        
        start : function(player,state){
            let objs = player.getObj(2);
            let attackDamage = Math.floor(player.attack*this.attack);
            let magickDamage = Math.floor(player.intelligence*this.magic);
            let allDamage = attackDamage + magickDamage;
            state.damage += allDamage * 2;
            state.count++;
            objs[0].bedamaged += allDamage;
            objs[1].bedamaged += allDamage;
            message += `
            <span style="font-weight:bold"> ${player.name} </span> 
            对 
            <span style="font-weight:bold"> ${objs[0].name}、${objs[1].name} </span>发动了<span style="color:orange"> 屠几上肉 </span><br>
            <span style="font-weight:bold"> ${objs[0].name} </span>由于<span style="font-weight:bold"> ${player.name} </span>的<span style="color:orange"> ${this.name} </span>
            受到<span style="color:red"> ${attackDamage} </span>点兵刃伤害<br>
            <span style="font-weight:bold"> ${objs[0].name} </span>由于<span style="font-weight:bold"> ${player.name} </span>的<span style="color:orange"> ${this.name} </span>
            受到<span style="color:red"> ${magickDamage} </span>点谋略伤害<br>
            <span style="font-weight:bold"> ${objs[1].name} </span>由于<span style="font-weight:bold"> ${player.name} </span>的<span style="color:orange"> ${this.name} </span>
            受到<span style="color:red"> ${attackDamage} </span>点兵刃伤害<br>
            <span style="font-weight:bold"> ${objs[1].name} </span>由于<span style="font-weight:bold"> ${player.name} </span>的<span style="color:orange"> ${this.name} </span>
            受到<span style="color:red"> ${magickDamage} </span>点谋略伤害<br>
            `;
        }
    },
    defaultSkill : {
        name : "禁用",
        parent : null,
        probability : 0,
    },
    shabaotest : {
        name : "妖术(测试)",
        parent : null,
        damage : 0,
        probability : 400,
        needReady : true,
        start : function(player){
            message += `<span style="font-weight:bold">${player.name}</span> 准备发动 <span style="color:orange">${this.name}</span>`
        },
        launch : function(player,state){
            let objs = player.getObj(3);
            for(i in objs){
                objs[i].debuff.sandstorm.restRound = 2;
                objs[i].debuff.sandstorm.from = player;
                // objs[i].debuff.sandstorm.damage = player.intelligence * this.damage;
            };
            state.count++;
        }

    }

}
//全局变量初始化
function init(){
    player1 = new Player('关羽','guanyu');
    player2 = new Player('张飞','zhangfei');
    player3 = new Player('刘备','liubei');
    player4 = new Player('孙策','sunce');
    player5 = new Player('孙坚','sunjian');
    player6 = new Player('孙权','sunquan');
    teamA = {
        list : [player1,player2,player3],
        damage : function(){
            let damage = 0;
            for(index in this.list){
                damage += this.list[index].getDamage();
            }
            return damage;
        },
        bedamaged : function(){
            let bedamaged = 0;
            for(index in this.list){
                bedamaged += this.list[index].bedamaged;
            }
            return bedamaged;
        },
        enemy :　teamB
    };
    teamB = {
        list : [player4,player5,player6],
        damage : function(){
            let damage = 0;
            for(index in this.list){
                damage += this.list[index].getDamage();
            }
            return damage;
        },
        bedamaged : function(){
            let bedamaged = 0;
            for(index in this.list){
                bedamaged += this.list[index].bedamaged;
            }
            return bedamaged;
        },
        enemy :　teamA
    };
    teamAll = [player1,player2,player3,player4,player5,player6];
    player1.main = 1;
    player4.main = 1;
    speedinit();
    playerGoList = [...teamAll];
    playerGoList.sort(compareSpeed);
    function compareSpeed(a,b){
        return b.speed - a.speed;
    }
    

    for (index in teamA.list){
        teamA.list[index].team = teamA;
        teamA.list[index].skills[1] = skilllist.yijujianmie;
    }
    player3.skills[2] = skilllist.shabaotest;
    for (index in teamB.list){
        teamB.list[index].team = teamB;
        teamB.list[index].skills[1] = skilllist.tujishangrou;
    }
    round();
};
//初始化速度
function speedinit(){
    for(index in teamAll){
        let spead = getRandomNum(1,200);
        teamAll[index].speed = spead;
    }
}
   
    
function viewRendeer(){
    let team = [...teamA.list,...teamB.list];
    let state = [];
        for(let i=1;i<=6;i++){
            let player = team[i-1];
            state = [player.skillState0,player.skillState1,player.skillState2];
            document.getElementById('head'+i).style.backgroundImage = 'url(img/'+team[i-1].head+'.jpg)';
            document.getElementById('name'+i).innerText = team[i-1].name;
            document.getElementById('attack'+i).innerText = team[i-1].attack;
            document.getElementById('intelligence'+i).innerText = team[i-1].intelligence;
            document.getElementById('speed'+i).innerText = team[i-1].speed;
            for(let j=1;j<=3;j++){
                document.getElementById('skill'+i+'_'+j).innerText = team[i-1].skills[j-1].name;
                document.getElementById('skill'+i+'_'+j+'_count').innerText =state[j-1].count;
                document.getElementById('skill'+i+'_'+j+'_damage').innerText =state[j-1].damage;
            }
            document.getElementById('att_count'+i).innerText = player.att.count;
            document.getElementById('att_damage'+i).innerText = player.att.damage;
        }
        document.getElementById('teamAdamage').innerText = teamA.damage();
        document.getElementById('teamAbedamaged').innerText = teamA.bedamaged();
        document.getElementById('teamBdamage').innerText = teamB.damage();
        document.getElementById('teamBbedamaged').innerText = teamB.bedamaged();
}

function round(){
    for(let i=0;i<8;i++){
        roundCount += 1;
        message += `<span style="font-size:16px;line-height:30px;font-weight:bold">回合${roundCount}</span><br>`;
        for(index in playerGoList){
            playerGoList[index].go();
        }
        document.getElementById('battle_message').innerHTML = message;
    }
    viewRendeer();
}


init();

