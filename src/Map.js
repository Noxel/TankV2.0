import React, { Component } from 'react';
import './App.css';
import './Tank.css';
import { connect } from 'react-redux';
import {setupMap, newPlayer, updateFire, playerLeave, keyDown, keyUp, mouseMove, updateTanks} from './actions';
import Tank_Corp from  './picture/Tank_Corp.png';
import Tank_Tete from './picture/Tank_Tete.png';
import Fire from './picture/tir.png';

const Img_Tank_Corp = new Image();
Img_Tank_Corp.src = Tank_Corp;

const Img_Tank_Tete = new Image();
Img_Tank_Tete.src = Tank_Tete;

const Img_Fire = new Image();
Img_Fire.src = Fire;

const _ = require('lodash');




const mapStateToProps = state => ({
    socket: state.socket,
    tanks: state.tanks,
    fires: state.fires,
    input: state.input,
    id: state.idPlayer

});

class Map extends Component{

   componentDidMount(){
        this.props.socket.on('setup', data =>{this.props.dispatch(setupMap(window.innerWidth, window.innerHeight, data.tanks, data.fires, data.id))});

        this.props.socket.on('newPlayer', data =>{this.props.dispatch(newPlayer(data))});

        this.props.socket.on('fire', data =>{this.props.dispatch(updateFire(data))});

        this.props.socket.on('playerLeave', data =>{this.props.dispatch(playerLeave(data))});

        this.props.socket.on('Tanks', data => {this.props.dispatch(updateTanks(data))});

       window.addEventListener("keydown", this.moveStart.bind(this), false);
       window.addEventListener("keyup", this.moveStop.bind(this), false);
       window.addEventListener("mousemove", this.moveTete.bind(this), false);

       this.move();
       requestAnimationFrame(this.updateCanvas.bind(this));
    }

    moveStart(e){
       this.props.dispatch(keyDown(e));
    }
    moveStop(e){
       this.props.dispatch(keyUp(e));
    }
    moveTete(e){
       this.props.dispatch(mouseMove(e));
    }

    move(){
        setInterval(() =>  {
            this.props.socket.emit('depl', this.props.input);
        }, 10);
    }

    updateCanvas() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0, canvas.width, canvas.height);
        requestAnimationFrame(this.updateCanvas.bind(this));

        _.map(this.props.tanks, item => {
            ctx.save();
            ctx.translate(item.x + 25, item.y + 25);
            ctx.rotate(item.rotTank*Math.PI/180);
            ctx.drawImage(Img_Tank_Corp, -25,-25,50,50);
            ctx.restore();

            ctx.save();
            ctx.translate(item.x + 25, item.y + 25);
            ctx.rotate(item.rotTete*Math.PI/180);
            ctx.drawImage(Img_Tank_Tete, -15,-25,30,50);
            ctx.restore();

            ctx.save();
            ctx.font = '25px serif';
            ctx.textAlign = "center";
            ctx.translate(item.x + 25, item.y);
            ctx.fillText(item.name, 0, -25);
            ctx.restore();
        });
        _.map(this.props.fires, item => {
            ctx.save();
            ctx.translate(item.x + 5, item.y + 5);
            ctx.rotate(item.rot*Math.PI/180);
            ctx.drawImage(Img_Fire, -5,-5,10,10);
            ctx.restore();
        });


    }



    render(){
        return <canvas id={'canvas'} width={window.innerWidth} height={window.innerHeight}/>
    }
}

export default connect(mapStateToProps)(Map);