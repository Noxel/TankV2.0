

export const TOGGLE_GAME = 'TOGGLE_GAME';
export const TOGGLE_GAME_ERROR = 'TOGGLE_GAME_ERROR';
export const toggleGame = (name, socket) => async (dispatch) => {
    try{
        await socket.emit('namePlayer', name);
        dispatch({type: TOGGLE_GAME, game: true, name: name});
    } catch(e){
        dispatch({type: TOGGLE_GAME_ERROR, error: e});
    }
};

export const NEW_PLAYER = 'NEW_PLAYER';
export const NEW_PLAYER_ERROR = 'NEW_PLAYER_ERROR';
export const newPlayer = (data ) => dispatch => {
    try{
        dispatch({type: NEW_PLAYER, tank: data  });
    } catch(e){
        dispatch({type: NEW_PLAYER_ERROR, error: e});
    }
};

export const FIRE = 'FIRE';
export const FIRE_ERROR = 'FIRE_ERROR';
export const updateFire = (data ) => dispatch => {
    try{
        dispatch({type: FIRE, fires: data  });
    } catch(e){
        dispatch({type: FIRE_ERROR, error: e});
    }
};

export const TANKS = 'TANKS';
export const TANKS_ERROR = 'TANKS_ERROR';
export const updateTanks = (data ) => dispatch => {
    try{
        dispatch({type: TANKS, tanks: data  });
    } catch(e){
        dispatch({type: TANKS_ERROR, error: e});
    }
};

export const LEAVE_PLAYER = 'LEAVE_PLAYER';
export const LEAVE_PLAYER_ERROR = 'LEAVE_PLAYER_ERROR';
export const playerLeave = (data ) => dispatch => {
    try{
        dispatch({type: LEAVE_PLAYER, id: data  });
    } catch(e){
        dispatch({type: LEAVE_PLAYER_ERROR, error: e});
    }
};

export const SETUP_MAP = 'SETUP_MAP';
export const SETUP_MAP_ERROR = 'SETUP_MAP_ERROR';
export const setupMap = (width, height, tanks, fires, id ) => dispatch => {
    try{
        dispatch({type: SETUP_MAP, tanks: tanks, fires: fires, idPlayer: id  });
    } catch(e){
        dispatch({type: SETUP_MAP_ERROR, error: e});
    }
};

export const KEY_DOWN = 'KEY_DOWN';
export const KEY_DOWN_ERROR = 'KEY_DOWN_ERROR';
export const keyDown = (event) => dispatch => {
    try{
        dispatch({type: KEY_DOWN, eventKey: event.key})
    } catch (e) {
        dispatch({type: KEY_DOWN_ERROR, error: e})
    }
};

export const KEY_UP = 'KEY_UP';
export const KEY_UP_ERROR = 'KEY_UP_ERROR';
export const keyUp = (event) => dispatch => {
    try{
        dispatch({type: KEY_UP, eventKey: event.key})
    } catch (e) {
        dispatch({type: KEY_UP_ERROR, error: e})
    }
};

export const MOUSE_MOVE = 'MOUSE_MOVE';
export const MOUSE_MOVE_ERROR = 'MOUSE_MOVE_ERROR';
export const mouseMove = (event) => dispatch => {
    try{
        dispatch({type: MOUSE_MOVE, MouseX: event.pageX, MouseY: event.pageY})
    } catch (e) {
        dispatch({type: MOUSE_MOVE_ERROR, error: e})
    }
};

