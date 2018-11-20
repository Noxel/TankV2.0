import openSocket from 'socket.io-client';
const _ = require('lodash');


let basestate = {
            idPlayer: 0,
            socket: openSocket(  'http://192.168.1.35:8000'),
            tanks: [],
            fires: [],
            ms : 0,
            input: {
                Left : false,
                Down : false,
                Right : false,
                UP : false,
                Fire : false,
                MouseX : 0,
                MouseY : 0
                },
            game: false,
            name: '',
            error: '',

};

const reducer = function(state = basestate, action) {
    switch (action.type) {
        case 'TOGGLE_GAME' :
            return {...state, name: action.name, game: action.game};

        case 'SETUP_MAP' :
            return {...state, app: action.app, tanks: action.tanks, fires: action.fires, idPlayer: action.idPlayer};

        case 'FIRE' :
            return {...state,fires: action.fires};

        case 'TANKS' :
            return {...state,tanks: action.tanks};

        case 'NEW_PLAYER' :
            return {...state, tanks: [...state.tanks, action.tank]};

        case 'LEAVE_PLAYER':
            return {...state, tanks: state.tanks.filter(x => {return x.id !== action.id})};

        case 'KEY_DOWN' :
            switch (action.eventKey) {
                case 'z' :
                    return {...state, input: {...state.input, UP : true}};
                case 's':
                    return {...state, input: {...state.input, Down : true}};
                case 'q' :
                    return {...state, input: {...state.input, Left : true}};
                case 'd' :
                    return {...state, input: {...state.input, Right : true}};
                case ' ':
                    return {...state, input: {...state.input, Fire : true}};
                default :
                    return {...state};
            }

        case 'KEY_UP' :
            switch (action.eventKey) {
                case 'z' :
                    return {...state, input: {...state.input, UP : false}};
                case 's':
                    return {...state, input: {...state.input, Down : false}};
                case 'q' :
                    return {...state, input: {...state.input, Left : false}};
                case 'd' :
                    return {...state, input: {...state.input, Right : false}};
                case ' ':
                    return {...state, input: {...state.input, Fire : false}};
                default :
                    return {...state};
            }

        case 'MOUSE_MOVE' :
            return {...state, input:{...state.input, MouseX: action.MouseX, MouseY: action.MouseY} };





        case 'FIRE_ERROR' :
            return {...state,error: action.error};

        case 'TANKS_ERROR' :
            return {...state,error: action.error};

        case 'LEAVE_PLAYER_ERROR' :
            return {...state,error: action.error};

        case 'NEW_PLAYER_ERROR' :
            return {...state,error: action.error};

        case 'TOGGLE_GAME_ERROR' :
            return {...state,error: action.error};

        case 'SETUP_MAP_ERROR' :
            return {...state,error: action.error};

        case 'KEY_UP_ERROR' :
            return {...state,error: action.error};

        case 'KEY_DOWN_ERROR' :
            return {...state,error: action.error};

        case 'MOUSE_MOVE_ERROR' :
            return {...state,error: action.error};

        default :
            return state;

    }
};

export {reducer}