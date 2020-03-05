import React from 'react';
import Redux, { bindActionCreators } from "redux";
import { Provider } from 'react-redux'
import {connect} from "react-redux"
import './Game.css';
import {cloneDeep} from 'lodash'



function GameMenu(props){
  return ( <form onSubmit={props.startGame}>
    <h3>Start a new game</h3>
    <div className="form-group">
      <input type="text" className="form-control" id="Name" placeholder="Enter your name" value={props.game.player} onChange={props.handleChange}></input>
      <button type="submit" className="btn btn-primary">Start Quiz</button>
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
    </div>
    <ul>
          <li>Question {currentQuestion+1}: {question.text}</li>
            {question.answers.map(answer => <Answer key={answer.text} answer={answer} selectAnswer={props.selectAnswer} answerSent={props.game.answerSent}></Answer>) }
    </ul>
    </div>
}

function Answer({answer,selectAnswer,answerSent}){
  const classNames = [answer.selected?"answer-selected":""];
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

