const io = require('socket.io')();
const _ = require('lodash');

const NAME = ['Yolooo', 'Owensalam', 'Sullivanslight', 'Undeadwang', 'Russellrek'];

const MAP_WIDTH = 10000;
const MAP_HEIGHT = 10000;

const TANK_SIZE = 50;
const TANK_SPEED = 2;

const FIRE_SIZE = 10;
const FIRE_SPEED = 3;
const FIRE_CD = 1000;

var id =0;
var player = [];
var shoots = [];


function collision(tab, data, dataSize) {
    return  _.find(tab, function(x){return  data.x < x.x + TANK_SIZE && data.x + dataSize > x.x && data.y < x.y + TANK_SIZE && data.y + dataSize > x.y  && !_.isEqual(x.id, data.id) });
}

function traitementEvent(data, client, tab){
    var tank = _.find(tab, function(x){return _.isEqual(client.id, x.id)});
    var res = {id: client.id, x: tank.x, y: tank.y, rotTete: tank.rotTete, rotTank: tank.rotTank, score: tank.score, fire: tank.fire };
    if(!_.isUndefined(tank)) {
        if (data.Right ){
            res.rotTank = res.rotTank +TANK_SPEED ;
        }
        if (data.Left ){
            res.rotTank = res.rotTank -TANK_SPEED ;
        }

        let moveX = TANK_SPEED * Math.sin(2 * Math.PI / 360 *  res.rotTank );
        let moveY = TANK_SPEED * -Math.cos(2 * Math.PI / 360 *  res.rotTank );

        if (data.Down && tank.y - moveY > 0 && tank.y - moveY < MAP_HEIGHT - TANK_SIZE && tank.x - moveX > 0 && tank.x - moveX < MAP_WIDTH-TANK_SIZE ) {
            res.y = res.y - moveY;
            res.x = res.x - moveX;
        }
        if (data.UP && tank.y + moveY > 0 && tank.y + moveY < MAP_HEIGHT -TANK_SIZE && tank.x + moveX > 0 && tank.x + moveX < MAP_WIDTH- TANK_SIZE ) {
            res.y = res.y + moveY;
            res.x = res.x + moveX;
        }
        if (_.isNumber(data.MouseX) && _.isNumber(data.MouseY)) {
            res.rotTete = 90 + _.multiply(Math.atan2(data.MouseY-(res.y+TANK_SIZE), data.MouseX-(res.x+TANK_SIZE)),(_.divide(180,Math.PI)));
        }
        if (data.Fire) {
            if(Date.now() - tank.fireCdDate > FIRE_CD) {
                res.fire = true;
                _.find(tab, function(x){return _.isEqual(client.id, x.id)}).fire = true;
              _.find(tab, function(x){return _.isEqual(client.id, x.id)}).fireCdDate = Date.now();
                let yStart = FIRE_SPEED  *  Math.sin( (res.rotTete - 90) * (Math.PI/180) );
                let xStart = FIRE_SPEED  *  Math.cos( (res.rotTete - 90) * (Math.PI/180));
                shoots = _.concat(shoots,  {k: client.id *1000 + _.random(0,999),x: res.x + (xStart*TANK_SIZE/2) + TANK_SIZE/2 , y: res.y + (yStart*TANK_SIZE/2) +TANK_SIZE/2 ,rot: res.rotTete, vitX: xStart, vitY: yStart});
            }
        }
        if(Date.now() - tank.fireAnimation > 200) {
            _.find(tab, function(x){return _.isEqual(client.id, x.id)}).fire = false;
          _.find(tab, function(x){return _.isEqual(client.id, x.id)}).fireAnimation = Date.now();
        }
    }
    return res;
}

function updateFire(){
    _.map(shoots, (x, index, tab)=>{
        if(x.x > 0 && x.x < MAP_WIDTH - FIRE_SIZE && x.y > 0 && x.y < MAP_HEIGHT - FIRE_SIZE){
            let col = collision(player, x, FIRE_SIZE);
            if(_.isUndefined(col) || Math.floor(x.k/1000) === col.id) {
                x.x = x.x + x.vitX;
                x.y = x.y + x.vitY;
            } else {
                _.remove(player, function (x) {return x.id === col.id});
                io.emit('playerLeave', col.id);
                let id = Math.floor(x.k/1000 );
                if(!_.isUndefined(_.find(player, function(x){return x.id === id}))){
                    _.find(player, function(x){return _.isEqual(x.id,id)}).score++;
                }
                tab[index] = 0;

            }
        } else {
            tab[index] = 0;
        }
    });
    shoots = _.compact(shoots);
    let envoieShoots =[];
    _.map(shoots, (item) => { envoieShoots= _.concat(envoieShoots, {x: item.x, y: item.y, rot: item.rot, k: item.k})});
    io.emit('fire', envoieShoots );
    setTimeout(()=>{ updateFire()  }, 20 );
}

function updateTanks(){
    io.emit('Tanks', player);
    setTimeout(()=>{ updateTanks()  }, 20 );
}



io.on('connection', (client)=> {
    client.on('namePlayer', (data) => {
        client.id = id;
        let x =0;
        let y =0;

        do{
            x=  _.random(5, 500);
            y =  _.random(5, 500);

        }while (!_.isUndefined(collision(player, {x: x, y: y, id: id}, TANK_SIZE)));
        if(data  === ''){
            data = NAME[_.random(0,NAME.length-1)];
        }
        data = Array.from(data).splice(0,10).join('');

        let newPlayer = {id: id, x: x, y: y,rotTete: 0, name: data, rotTank : 0, score: 0, fire : false, fireCdDate: 0, fireAnimation: 0, skin: _.random(1,5)};

        client.emit('setup', {tanks : player , id :  id, fires: shoots});

        player = _.concat(player, newPlayer);
        client.broadcast.emit('newPlayer', newPlayer);
        id++;
    });

    client.on('depl', (data) => {
        if(!_.isUndefined( _.find(player, function(x){return _.isEqual(x.id, client.id)}))){
            var depl = traitementEvent(data, client, player);
            if(_.isUndefined(collision(player, depl, TANK_SIZE))) {
                _.find(player, function(x){return _.isEqual(x.id, client.id)}).x = depl.x;
                _.find(player, function(x){return _.isEqual(x.id, client.id)}).y = depl.y;
                _.find(player, function(x){return _.isEqual(x.id, client.id)}).rotTank = depl.rotTank;
                _.find(player, function(x){return _.isEqual(x.id, client.id)}).rotTete = depl.rotTete;
            }

        }
    });




    client.on('disconnect', function(){
        _.remove(player, function (x) {return x.id === client.id});
        client.broadcast.emit('playerLeave', client.id);
    });

    client.on('ms', function () {
        client.emit('ms');
    })


});

updateFire();
updateTanks();

const port = 8000;
io.listen(port);
console.log('Io listen');