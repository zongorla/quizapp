import React from 'react';
import {createStore,combineReducers} from "redux"
import {Provider} from "react-redux"
import logo from './logo.svg';
import './QuizApp.css';
import {Game, gameReducer, emptyGame} from "./Game"
import {Questions, questionsReducer} from './Questions';
import {storage} from "./Storage"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const pages = {
  home:1,
  game:2,
  questions:3
};

let emptyState = {
  questions:[],
  game:emptyGame(),
  currentPage:pages.home
}

var store = createStore(rootReducer);
var saveCalled = 0;
store.subscribe(() => {
  storage.save(store.getState());
  console.log("Save called " + (++saveCalled));
});

function rootReducer(state,action){
    if(state === undefined){
      let initialState = storage.load();
      if(!initialState){
        initialState = emptyState;
      }      
      return initialState;
    }
    let newState = {...state};  
    newState.questions = questionsReducer(state.questions,action);
    newState = gameReducer(newState,action)
   
    return newState;
}


function QuizApp(props) {
  return (
    <Provider store={store}>
      <Router>
        <div>
            <Switch> 
              <Route path="/game">
                  <Game/>
              </Route>
              <Route path="/questions">
                  <Questions/>         
              </Route>
              <Route path="/">
              <nav>
                <ul>
                  <li>
                    <Link to="/questions" >Questions</Link>
                  </li>
                  <li>
                    <Link to="/game">Game</Link>
                  </li>
                </ul>
              </nav>
              </Route>
            </Switch>
        </div>
      </Router>
    </Provider>   
  );
}

export {store,QuizApp};
