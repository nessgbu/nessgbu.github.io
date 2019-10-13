//武将 构造函数
function Player(name,head){
    this.main = 0;
    this.name = name;
    this.head = head;
    this.attack = 278.32;
    this.intelligence = 130.45;
    this.speed = 137.7;
    this.team = null;
    this.skill0 = skill.defaultSkill;
    this.skill1 = skill.defaultSkill;
    this.skill2 = skill.defaultSkill;
    this.skills = [this.skill0,this.skill1,this.skill2];
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
        }
    }
};
Player.prototype = {
    //获取 攻击目标数组 函数
    getObj :  function(quantity) {
        let objs = [];
        if(this.debuff.confusion.restRound){
            console.log(this.debuff.confusion.restRound);
            let team =  teamAll;
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
            let team = teamB;
            for(let i = 1;i <= quantity;i++){
                let index = getRandomNum(1,team.length) - 1;
                objs.push(team[index]);
                team.splice(index,1);
            }
            return objs;
        }
        if(this.team == teamB){
            let team = teamA;
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
    skillLunch : function(skill,player){
        if(getRandomNum(1,1000)<=skill.probability){
            skill.start(player);
        }
    },
    //行动
    go : function(){
        if(!this.debuff.coma.restRound){
            if(!this.debuff.silence.restRound){
                this.skillLunch(this.skill0,this);
                this.skillLunch(this.skill1,this);
                this.skillLunch(this.skill2,this);
            }else{
                console.log(this.name+'处于来自'+this.debuff.silence.from+'的禁言状态，无法发动技能')
            }
            if(!this.debuff.disarm.restRound){
                let obj = this.getObj(1);
                console.log(this.name+'对'+obj[0].name+'发动了普通攻击');
            }
        }else{
            console.log(this.name+'处于来自'+this.debuff.coma.from+'的震慑状态，无法行动');
        }
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
skill = {
    yijujianmie : {
        name : "一举歼灭",
        parent : '张梁',
        probability :　400,
        start : function(){
            console.log();
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

            let message = `
            <span style="color:green">${player.name}</span>
            对
            <span style="color:red">${objs[0].name}、${objs[1].name}</span>发动了屠几上肉<br>
            <span style="font-style:bold">${objs[0].name}</span>由于${player.name}的${this.name}受到${allDamage}点伤害<br>
            <span style="font-style:bold">${objs[1].name}</span>由于${player.name}的${this.name}受到${allDamage}点伤害<br>
            `
            
            ;
            document.getElementById('battle_message').innerHTML = message;
            console.log(message);
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

    }

}

function playerinit(){
    //构造武将
    
    player1.main = 1;
    player4.main = 1;
    player1.skill1 = skill.tujishangrou;

    //初始化速度
    // for(index in teamAll){
    //     let spead = getRandomNum(1,100);
    //     teamAll[index].speed = spead;
    // }
    
};
//初始化武将
var player1 = new Player('关羽','guanyu'),
    player2 = new Player('张飞','zhangfei'),
    player3 = new Player('刘备','liubei'),
    player4 = new Player('孙策','sunce'),
    player5 = new Player('孙坚','sunjian'),
    player6 = new Player('孙权','sunquan'),
    //添加阵营
    teamA = [player1,player2,player3],
    teamB = [player4,player5,player6],
    teamAll = [...teamA,...teamB];
    for (index in teamA){
        teamA[index].team = teamA;
    }
    for (index in teamB){
        teamB[index].team = teamB;
    }
function viewRendeer(){
    for(let i=1;i<=6;i++){
        document.getElementById('head'+i).style.backgroundImage = 'url(img/'+teamAll[i-1].head+'.jpg)';
        document.getElementById('name'+i).innerText = teamAll[i-1].name;
        document.getElementById('attack'+i).innerText = teamAll[i-1].attack;
        document.getElementById('intelligence'+i).innerText = teamAll[i-1].intelligence;
        document.getElementById('speed'+i).innerText = teamAll[i-1].speed;
        for(let j=1;j<=3;j++){
            document.getElementById('skill'+i+'_'+j).innerText = teamAll[i-1].skills[j-1].name;
        }
    }
}

playerinit();
viewRendeer();


player1.go();
