import React from 'react';
import {connect} from "react-redux"
import {cloneDeep} from 'lodash'
import './Game.css';
import {GameMenu, ActiveGame, GameSummary} from "./GameComponents"


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

