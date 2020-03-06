import React from 'react';
import './QuizApp.css';

import {Game} from "./Game"
import {Questions} from './Questions';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function QuizApp(props) {
  return (
      <Router>
        <header className="masthead">
          <div className="inner">
            <h3 className="masthead-brand">The Quiz</h3>
            <nav className="nav nav-masthead justify-content-center">
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
  );
}

export {QuizApp};
