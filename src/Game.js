import React from 'react';
import Redux, { bindActionCreators } from "redux";
import { Provider } from 'react-redux'
import {connect} from "react-redux"
import './Game.css';
import {cloneDeep} from 'lodash'


const GAME_START = "GAME_START"
const GAME_INPUTCHANGE = "GAME_INPUTCHANGE"
const GAME_ANSWERSELECTED = "GAME_ANSWERSENT"
const GAME_ANSWERSENT = "GAME_ANSWERSELECTED"
const GAME_NEXTQUESTION = "GAME_NEXTQUESTION"
const gameStates = {
  menu:1,
  running:2,
  finnished:3
}

const emptyGame = () => ({
  gameState:gameStates.menu,
  player:"",
  points:0,
  questions:[],
  currentQuestion:0,
  answerSelected:false,
  answerSent:false
})

function getGameQuestions(questions){
  questions = cloneDeep(questions);
  questions.forEach( (question) => {
    question.answers.forEach((answer) => {
      answer.selected = false; 
    })
  });
  return questions;
}

function startGame(game,questions,action){
  action.event.preventDefault();
  const newGame = {...game}
  newGame.gameState = gameStates.running;
  newGame.questions = getGameQuestions(questions);
  newGame.currentQuestion = 0;
  newGame.points = 0;
  return newGame;
}


function endOfGame(state){
  return state.game.currentQuestion === state.game.questions.length - 1;
}

const gameReducer =  (state, action) => {
  switch(action.type){
    case GAME_START:{
      state.game = startGame(state.game,state.questions,action);
      return state;
    }
    case GAME_INPUTCHANGE:{
      state.game = {...state.game}
      state.game.player = action.event.target.value;
      return state;
    }
    case GAME_ANSWERSELECTED:{
      if(!state.game.answerSent){
        state.game.answerSelected = true;
        const game = {...state.game}
        const question = game.questions[game.currentQuestion];
        question.answers = question.answers.map(function(answer){
          if(answer === action.answer){
            answer.selected = true;
          }else{
            answer.selected = false;
          }
          return answer;
        })
        state.game = game;
        return state;
      }
      return state;
    }
    case GAME_ANSWERSENT:{
      const game = {...state.game}
      game.answerSent = true;
      const question = game.questions[game.currentQuestion];
      question.answers.forEach(function(answer){
        if(answer.selected && answer.correct){
          game.points += 1;
        }
      });
      state.game = game;
      return state;
    }
    case GAME_NEXTQUESTION:{
      state.game = {...state.game}
      if(endOfGame(state)){
        state.game.gameState = gameStates.finnished;
      }else{
        state.game.currentQuestion += 1;
        state.game.answerSelected = false;
        state.game.answerSent = false;
        state.game.selectedAnswer = null;
      }
      return state;
    }
    default:
      return state;
  }
}

const mapStateToProps = function (state){
  return state;
};

const mapDispatchToProps = dispatch => ({
  startGame: (event) => dispatch({
    type:GAME_START,
    event:event
  }),
  handleChange: (event) => dispatch({
    type:GAME_INPUTCHANGE,
    event:event
  }),
  selectAnswer: (event,answer) => dispatch({
    type:GAME_ANSWERSELECTED,
    answer,
    event
  }),
  sendAnswer: (event) => dispatch({
    type:GAME_ANSWERSENT,
    event
  }),
  nextQuestion: (event) => dispatch({
    type:GAME_NEXTQUESTION,
    event
  })
});


const Game =  connect(mapStateToProps,mapDispatchToProps)(function(props){
    switch(props.game.gameState){
      case gameStates.menu:
        return <GameMenu {...props}></GameMenu>
      case gameStates.running:
        return <ActiveGame  {...props}></ActiveGame>
      case gameStates.finnished:
        return <GameSummary {...props}></GameSummary>
      default:
        return <div>Invalid Gamestate</div>
    }
});




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



export  {gameReducer,Game, gameStates,emptyGame};

