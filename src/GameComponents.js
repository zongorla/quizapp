import React from 'react';
import './GameComponents.css';


function GameMenu(props){
  const noQuestions = props.questionEditor.questions.length === 0;
  return ( <form onSubmit={props.startGame}>
    <div className="form-group">
      <div className="form-group row">
        <input type="text" className="form-control" id="player-name" placeholder="Enter your name" value={props.game.player} onChange={props.handleChange} required></input>
      </div>
      <div className="form-group row">
        <button type="submit" className="btn btn-primary btn-lg btn-block">Start a new game</button>
      </div>
      <div className={noQuestions?"":"hidden"}>
        <p className='lead text-warning'>Oups! There are no questions in the game. Add some before starting a new game</p>
      </div>
    </div>
  </form>)
}

function ActiveGame(props){
  const currentQuestion = props.game.currentQuestion;
  const question = props.game.questions[currentQuestion];
  return <div class="col-12 no-gutters">
            <GameInfo {...props.game}></GameInfo>
            <div className="row question-area">
              <div class="col-12">
                  <p className="text-left question-text">Question {currentQuestion+1}:<i> {question.text}</i></p>
                  <ul className="list-group">
                          {question.answers.map((answer,index) => <Answer key={index} answer={answer} selectAnswer={props.selectAnswer} answerSent={props.game.answerSent}></Answer>) }
                  </ul>
              </div>
            </div>
          <GameControls {...props}></GameControls>
        </div>
}


function GameInfo({points,player}){
  return  <div className="row">
            <div className="col-6">
              <p className="text-left">Player: {player}</p>
            </div>
            <div className="col-6">
              <p className="text-right">Points: {points}</p>
            </div>
          </div>
}

function GameControls(props){
  let button;
  if(props.game.answerSent){
    button = <button className="btn btn-block" onClick={props.nextQuestion}>Next Question</button>
  }else{
    button = <button className="btn btn-block" disabled={!props.game.answerSelected} onClick={props.sendAnswer}>Send answer</button>
  }
  return <div className="row">
        <div className="col-6">
          {button}
        </div>
        <div className="col-6">
          <button className="btn btn-block" onClick={props.endGame}>End Game</button>
        </div>
      </div>
}

function Answer({answer,selectAnswer,answerSent}){
  const classNames = ["text-left","text-left", "list-group-item" ,"quiz-option", answer.selected?"answer-selected":""];
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

