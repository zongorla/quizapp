import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {QuizApp} from './QuizApp';
import {storage} from "./Storage"
import {createGameStore} from "./GameState"
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux"

ReactDOM.render(<Provider store={createGameStore(storage)}>
                    <QuizApp></QuizApp>
                </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
