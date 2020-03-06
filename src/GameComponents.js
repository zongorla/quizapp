import React from 'react';
import Redux, { bindActionCreators } from "redux";
import { Provider } from 'react-redux'
import {connect} from "react-redux"
import './Game.css';
import {cloneDeep} from 'lodash'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



function GameMenu(props){
  const noQuestions = props.questionEditor.questions.length === 0;
  return ( <form onSubmit={props.startGame}>
    {/* <h3 className="cover-heading">Start a new game</h3> */}
    <div className="form-group">
      <div className="form-group row">
        {/* <label for="player-name">Player name:</label> */}
        <input type="text" className="form-control" id="player-name" placeholder="Enter your name" value={props.game.player} onChange={props.handleChange} required></input>
      </div>
      <div className="form-group row">
        <button type="submit" className="btn btn-primary btn-lg btn-block">Start a new game</button>
      </div>
      <div className={noQuestions?"":"hidden"}>
        <p className='lead text-warning'>Oups! There are no questions in the game. Add some before starting a new game</p>
      </div>
      {/* <button><Link to="/questions" >Add questions</Link></button> */}
    </div>
  </form>)
}

function ActiveGame(props){
  const currentQuestion = props.game.currentQuestion;
  const question = props.game.questions[currentQuestion];
  return <div>
    <div>
      <p>Player: {props.game.player} Points:{props.game.points}</p>
      <button className={props.game.answerSent?"hidden":""} disabled={!props.game.answerSelected} onClick={props.sendAnswer}>Send answer</button>
      <button className={props.game.answerSent?"":"hidden"} onClick={props.nextQuestion}>Next Question</button>
      <button onClick={props.endGame}>End Game</button>
    </div>
    <ul>
          <li className="text-left">Question {currentQuestion+1}: {question.text}</li>
            {question.answers.map((answer,index) => <Answer key={index} answer={answer} selectAnswer={props.selectAnswer} answerSent={props.game.answerSent}></Answer>) }
    </ul>
    </div>
}

function Answer({answer,selectAnswer,answerSent}){
  const classNames = ["text-left", answer.selected?"answer-selected":""];
  if(answerSent){
    classNames.push(answer.correct?"correct":"incorrect");
  }
  return <li  
    className={classNames.join(" ")} 
    onClick={event => selectAnswer(event,answer)}>
      {answer.text}
  </li>
}

function GameSummary(props){
  return <div>
    <p>Congratulations {props.game.player} your score was {props.game.points}/{props.game.questions.length} </p>
    <GameMenu {...props}></GameMenu>
  </div>
}



export {GameMenu, ActiveGame, GameSummary};

