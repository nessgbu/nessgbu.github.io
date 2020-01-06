var option = document.getElementById('option');
var opt = ['满级','1级','成长'];
var optnum = 0;
function changeopt(){
    optnum ++ ;
    if (optnum >= 3)
        optnum = 0;
    option.innerHTML = opt[optnum];
    optinit();
};
function numSort(a,b){
    let s1 = 0;
    let s2 = 0;
    if(attrSelect.att){
        s1 += parseFloat(a.n_att);
        s2 += parseFloat(b.n_att);
    }
    if(attrSelect.int){
        s1 += parseFloat(a.n_int);
        s2 += parseFloat(b.n_int);

    }
    if(attrSelect.def){
        s1 += parseFloat(a.n_def);
        s2 += parseFloat(b.n_def);
    }
    if(attrSelect.spd){
        s1 += parseFloat(a.n_spd);
        s2 += parseFloat(b.n_spd);
    }
    if(attrSelect.pol){
        s1 += parseFloat(a.n_pol);
        s2 += parseFloat(b.n_pol);
    }
    if(attrSelect.charm){
        s1 += parseFloat(a.n_charm);
        s2 += parseFloat(b.n_charm);
    }
    return s2 - s1;
}
var attrSelect = {
    att : 0,
    int : 0,
    def : 0,
    spd : 0,
    pol : 0,
    charm : 0
}
function optinit(){
    if(optnum == 0){
        for (i in heros){
            hero = heros[i];
            hero.n_att = parseFloat(hero.att + hero.g_att*49).toFixed(2);
            hero.n_int = parseFloat(hero.int + hero.g_int*49).toFixed(2);
            hero.n_def = parseFloat(hero.def + hero.g_def*49).toFixed(2);
            hero.n_spd = parseFloat(hero.spd + hero.g_spd*49).toFixed(2);
            hero.n_pol = parseFloat(hero.pol + hero.g_pol*49).toFixed(2);
            hero.n_charm = parseFloat(hero.charm + hero.g_charm*49).toFixed(2);
        }
    }else if(optnum == 1){
        for (i in heros){
            hero = heros[i];
            hero.n_att = parseFloat(hero.att).toFixed(0);
            hero.n_int = parseFloat(hero.int).toFixed(0);
            hero.n_def = parseFloat(hero.def).toFixed(0);
            hero.n_spd = parseFloat(hero.spd).toFixed(0);
            hero.n_pol = parseFloat(hero.pol).toFixed(0);
            hero.n_charm = parseFloat(hero.charm).toFixed(0);
        }
    }else{
        for (i in heros){
            hero = heros[i];
            hero.n_att = parseFloat(hero.g_att).toFixed(2);
            hero.n_int = parseFloat(hero.g_int).toFixed(2);
            hero.n_def = parseFloat(hero.g_def).toFixed(2);
            hero.n_spd = parseFloat(hero.g_spd).toFixed(2);
            hero.n_pol = parseFloat(hero.g_pol).toFixed(2);
            hero.n_charm = parseFloat(hero.g_charm).toFixed(2);
        }
    };

    trans();
    
}

var message;
var list = document.getElementById('list');
var menu = document.getElementById('menu');
var input_att = document.getElementById('att');
var input_int = document.getElementById('int');
var input_def = document.getElementById('def');
var input_spd = document.getElementById('spd');
var input_pol = document.getElementById('pol');
var input_cha = document.getElementById('cha');
function trans(){
    
    attrSelect.att = input_att.checked;
    attrSelect.int = input_int.checked;
    attrSelect.def = input_def.checked;
    attrSelect.spd = input_spd.checked;
    attrSelect.pol = input_pol.checked;
    attrSelect.charm = input_cha.checked;
    
    for (i in heros){
        hero = heros[i];
        hero.select = 0;
        if(attrSelect.att){
            hero.select += parseFloat(hero.n_att);
        }
        if(attrSelect.int){
            hero.select += parseFloat(hero.n_int);
        }
        if(attrSelect.def){
            hero.select += parseFloat(hero.n_def);
        }
        if(attrSelect.spd){
            hero.select += parseFloat(hero.n_spd);
        }
        if(attrSelect.pol){
            hero.select += parseFloat(hero.n_pol);
        }
        if(attrSelect.charm){
            hero.select += parseFloat(hero.n_charm);
        };
        hero.select = hero.select.toFixed(2);
    };
    
    heros.sort(numSort);
    attrListInit();
}
function attrListInit(){
    message = '';
    for (i in heros){
        hero = heros[i];
        message += `
            <div>
                <span  style="color:${(function(){if(hero.color) return '#909'; else return '#f60'})()}">${hero.name}</span>
                <span>${hero.n_att}</span>
                <span>${hero.n_int}</span>
                <span>${hero.n_def}</span>
                <span>${hero.n_spd}</span>
                <span>${hero.n_pol}</span>
                <span>${hero.n_charm}</span>
                <span>${hero.select}</span>
            </div>
        `;
    }
    list.innerHTML = message;
}

optinit();
