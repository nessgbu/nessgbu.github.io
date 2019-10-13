var message = '';
//武将 构造函数
function Player(name,head){
    this.main = 0;
    this.name = name;
    this.head = head;
    this.attack = 278.32;
    this.intelligence = 130.45;
    this.speed = 137.7;
    this.team = null;
    this.skills = [skilllist.defaultSkill,skilllist.defaultSkill,skilllist.defaultSkill];
    this.skillState0 = {
        readyState : 0,
        damage : 0
    };
    this.skillState1 = {
        readyState : 0,
        damage : 0
    };
    this.skillState2 = {
        readyState : 0,
        damage : 0
    };
    this.damage = 0;
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
            let team = [...teamB];
            for(let i = 1;i <= quantity;i++){
                let index = getRandomNum(1,team.length) - 1;
                objs.push(team[index]);
                team.splice(index,1);
            }
            return objs;
        }
        if(this.team == teamB){
            let team = [...teamA];
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
            console.log('ok');
            skill.launch(player);
            state.readyState = 0;
            return ;
        }
        if(getRandomNum(1,1000) <= skill.probability){
            skill.start(player);
            if(skill.needReady){
                state.readyState = 1;
            }
        }  
        
    },
    //行动
    go : function(){
        if(this.debuff.sandstorm.restRound){
            this.bedamaged += this.debuff.sandstorm.damage;
            this.debuff.sandstorm.from.damage += this.debuff.sandstorm.damage;
            message += `
                <span style="font-weight:bold">${this.name}</span>受到来自${this.debuff.sandstorm.from.name}的沙暴效果战损<span style="color:red">${this.debuff.sandstorm.damage}</span>
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
                message += `${this.name}对${obj[0].name}发动了普通攻击<br>`
            }else{
                message += `${this.name}处于来自${this.debuff.disarm.from.name}的缴械状态，无法普通攻击<br>`;
                this.debuff.disarm.restRound -= 1;
            }
        }else{
            message += `${this.name}处于来自${this.debuff.coma.from.name}的震慑状态，无法行动`;
            this.debuff.coma.restRound -= 1;
        }
        message += `<br>`;
    }
}

//战斗数据
var totalDamageA = 0,
    totalDamageB = 0;

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
        needReady : true,
        start : function(player){
            
            message += `<span style="font-weight:bold">${player.name}</span> 准备发动<span style="color:orange"> ${this.name} </span><br>`;
            
        },
        launch : function(player){
            message += `<span style="font-weight:bold">${player.name}</span> 发动了<span style="color:orange"> ${this.name} </span><br>`
        }
    },
    tujishangrou : {
        name : "屠几上肉",
        parent : '曹真',
        probability :　350,
        
        start : function(player){
            let objs = player.getObj(2);
            let attackDamage = Math.floor(player.attack*1.5);
            let magickDamage = Math.floor(player.intelligence*1.5);
            let allDamage = attackDamage + magickDamage;
            player.damage += allDamage;
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
        name : "测试用沙暴",
        parent : null,
        start : function(player){
            message += `<span style="font-weight:bold">${player.name}</span> 准备发动 <span style="color:orange">${this.name}</span>`
        },
        lunch : function(player){
            let objs = player.getObj(2);
            objs[0].debuff.sandstorm.restRound = 2;
            objs[0].debuff.sandstorm.from = player;
            onjs[0].debuff.sandstorm.damage = player.intelligence * 0;

        }

    }

}

function playerinit(){
    //构造武将
    player1.main = 1;
    player4.main = 1;
    speedinit();
};
//初始化速度
function speedinit(){
    for(index in teamAll){
        let spead = getRandomNum(1,200);
        teamAll[index].speed = spead;
    }
}
//初始化武将
var player1 = new Player('关羽','guanyu'),
    player2 = new Player('张飞','zhangfei'),
    player3 = new Player('刘备','liubei'),
    player4 = new Player('孙策','sunce'),
    player5 = new Player('孙坚','sunjian'),
    player6 = new Player('孙权','sunquan'),
    //添加阵营
    selfTeam = {
        
        totalDamage : 0,
        playerlist : [player1,player2,player3]
    },
    enemyTeam = {
        totalDamage : 0,
        playerlist : [player4,player5,player6]
    },
    teamA = [player1,player2,player3],
    teamB = [player4,player5,player6],
    teamAll = [player1,player2,player3,player4,player5,player6];
    player3.speed = 180;
    player2.speed = 1;
    playerGoList = [...teamAll];
    playerGoList.sort(compareSpeed);
    function compareSpeed(a,b){
        return a.speed - b.speed;
    }
    

    for (index in teamA){
        teamA[index].team = teamA;
        teamA[index].skills[1] = skilllist.yijujianmie;
    }
    player3.skills[2] = skilllist.shabaotest;
    for (index in teamB){
        teamB[index].team = teamB;
        teamB[index].skills[1] = skilllist.tujishangrou;
    }
function viewRendeer(){
    let team = [...teamA,...teamB];
        for(let i=1;i<=6;i++){
            document.getElementById('head'+i).style.backgroundImage = 'url(img/'+team[i-1].head+'.jpg)';
            document.getElementById('name'+i).innerText = team[i-1].name;
            document.getElementById('attack'+i).innerText = team[i-1].attack;
            document.getElementById('intelligence'+i).innerText = team[i-1].intelligence;
            document.getElementById('speed'+i).innerText = team[i-1].speed;
            for(let j=1;j<=3;j++){
                document.getElementById('skill'+i+'_'+j).innerText = team[i-1].skills[j-1].name;
            }
        }
    
    
}
var roundCount = 0;
function round(){
    for(let i=0;i<8;i++){
        roundCount += 1;
        message += `<span style="font-size:16px;line-height:30px;font-weight:bold">回合${roundCount}</span><br>`;
        for(index in playerGoList){
            playerGoList[index].go();
        }
        document.getElementById('battle_message').innerHTML = message;
    }
    
}


playerinit();
viewRendeer();
round();
