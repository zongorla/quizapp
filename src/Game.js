import React from 'react';
import {connect} from "react-redux"
import {cloneDeep} from 'lodash'
import './Game.css';
import {GameMenu, ActiveGame, GameSummary} from "./GameComponents"


const GAME_START = "GAME_START";
const GAME_INPUTCHANGE = "GAME_INPUTCHANGE";
const GAME_ANSWERSELECTED = "GAME_ANSWERSENT";
const GAME_ANSWERSENT = "GAME_ANSWERSELECTED";
const GAME_NEXTQUESTION = "GAME_NEXTQUESTION";
const GAME_END = "GAME_END";

const gameStates = {
  menu:1,
  running:2,
  finnished:3
};

const emptyGame = () => ({
  gameState:gameStates.menu,
  player:"",
  points:0,
  questions:[],
  currentQuestion:0,
  answerSelected:false,
  answerSent:false
});

const gameReducer = (state, action) => {
  switch(action.type){
    case GAME_START:{
      return startGame(state,state.questionEditor.questions,action);
    }
    case GAME_INPUTCHANGE:{
      return inputChange(state, action);
    }
    case GAME_ANSWERSELECTED:{
      return answerSelected(state, action);
    }
    case GAME_ANSWERSENT:{
      return answerSent(state, action);
    }
    case GAME_NEXTQUESTION:{
      return nextQuestion(state,action);
    }
    case GAME_END:{
      return endGame(state,action);
    }
    default:
      return state;
  }
};


function startGame(state,questions,action){
  action.event.preventDefault();
  state.game = {...state.game};
  if(questions.length !== 0){
    state.game.gameState = gameStates.running;
    state.game.questions = getGameQuestions(questions);
    state.game.currentQuestion = 0;
    state.game.points = 0;
    state.game.answerSelected = false;
    state.game.answerSent = false;
  }
  return state;
};

function getGameQuestions(questions){
  questions = cloneDeep(questions);
  questions.forEach( (question) => {
    question.answers.forEach((answer) => {
      answer.selected = false; 
    });
  });
  return questions;
}

function inputChange(state,action){
  state.game = {...state.game};
  state.game.player = action.event.target.value;
  return state;
}

function answerSelected(state,action){
  if(!state.game.answerSent){
    state.game.answerSelected = true;
    const game = {...state.game}
    const question = game.questions[game.currentQuestion];
    question.answers = question.answers.map(function(answer){
      answer.selected = answer === action.answer;
      return answer;
    })
    state.game = game;
    return state;
  }
  return state;
}

function answerSent(state,action){
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

function nextQuestion(state,action){      
  state.game = {...state.game}
  if(isEndOfGame(state)){
    state.game.gameState = gameStates.finnished;
  }else{
    state.game.currentQuestion += 1;
    state.game.answerSelected = false;
    state.game.answerSent = false;
  }
  return state;
}

function endGame(state,action){
  state.game = {...state.game}
  state.game.gameState = gameStates.menu;
  return state;
}

function isEndOfGame(state){
  return state.game.currentQuestion === state.game.questions.length - 1;
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
  }),
  endGame: () => dispatch({
    type:GAME_END
  })
});

const Game = connect(mapStateToProps,mapDispatchToProps)( (props) => {
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

export {gameReducer,emptyGame,Game};

