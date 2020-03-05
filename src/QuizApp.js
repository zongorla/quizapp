import React from 'react';
import logo from './logo.svg';
import './QuizApp.css';
import Questions from './Questions';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function QuizApp() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav> */}
        <Switch>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/questions">
            <Questions />
          </Route>
          <Route path="/">
            <Game />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


function Game() {
  return <h2>Game</h2>;
}


export default QuizApp;
