import React ,{ Component } from 'react';
import { connect } from 'react-redux'
import Map from './Map';
import logo from "./picture/Tank_Corp.png";
import logo2 from "./picture/Tank_Tete_tir.png";
import { toggleGame } from "./actions.js";

const mapStateToProps = state => ({
    game : state.game,
    socket: state.socket
});

class Game extends Component{

    componentDidMount(){

    }

    render(){
        let input;
        if(this.props.game){
            return <div className={"map"} style={{width: window.innerWidth, height: window.innerHeight }}>

                <Map />
            </div>
        } else{
            return  <div className={"App-header"}>
                <h1 className={'text-pop-up-top'}> Tank.IO </h1>
                <img src={logo} className={"App-logo"} alt="logo"/>
                <img src={logo2} className={"App-logo"} alt="logo"/> <br/> <br/> <br/>
                <form onSubmit={e => {e.preventDefault();
                    this.props.dispatch(toggleGame(input.value, this.props.socket));
                    }}>
                    <input ref={node => input = node} type='text' />
                    <input className={'button'} type='submit' value='Battle !'/>
                </form>
            </div>
        }
    }
}

export default connect(mapStateToProps)(Game);