import React from 'react';
import {createStore,combineReducers} from "redux"
import {Provider} from "react-redux"

import 'react-notifications/lib/notifications.css';
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
  questionEditor:{
    questions:[]
  },
  game:emptyGame(),
  currentPage:pages.home
}

var store = createStore(rootReducer);
var saveCalled = 0;
store.subscribe(() => {
  storage.save(store.getState());
  console.log("Save called " + (++saveCalled));
});

function validateState(state){
   return (state.questionEditor instanceof Object
    && state.game instanceof Object)
}

function rootReducer(state,action){
    if(state === undefined){
      let initialState = storage.load(validateState);
      if(!initialState ){
        initialState = emptyState;
      }      
      return initialState;
    }
    let newState = {...state};  
    newState.questionEditor = questionsReducer(state.questionEditor,action);
    newState = gameReducer(newState,action)
   
    return newState;
}


function QuizApp(props) {
  return (
    <Provider store={store}>
      <Router>
        <header class="masthead">
          <div class="inner">
            <h3 class="masthead-brand">The Quiz</h3>
            <nav class="nav nav-masthead justify-content-center">
              <Link className="nav-link active"to="/questions">Edit questions</Link>
              <Link className="nav-link active"to="/game">Play</Link>
            </nav>
          </div>
        </header>
        <main role="main" className="inner cover">
            <Switch> 
              <Route path="/game">
                  <Game/>
              </Route>
              <Route path="/questions">
                  <Questions/>         
              </Route>
              <Route path="/">
                  <Game/>
              </Route>
            </Switch>
        </main>
      </Router>
    </Provider>   
  );
}

export {store,QuizApp};
