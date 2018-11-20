import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import {reducer} from './reducer.js'
import './App.css';
import Game from "./Game";
import thunk from 'redux-thunk';

const middleware = [thunk];
if(process.env.NODE_ENV !=='production') {
    middleware.push(createLogger());
}
const store = createStore(reducer, applyMiddleware(...middleware));



class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">

                    <Game/>
                </div>
            </Provider>
        );

    }
}


export default App
