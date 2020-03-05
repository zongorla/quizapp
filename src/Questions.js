import React from 'react';
import Redux from "redux";
import { Provider } from 'react-redux'
import {connect} from "react-redux"
import './Questions.css';
const QUESTIONS_ADD = "QUESTIONS_ADD"
const QUESTIONS_DELETE = "QUESTIONS_DELETE"

const questionsReducer =  (questions, action) => {
  switch(action.type){
    case QUESTIONS_ADD:{
      return [...questions,action.question];
    }
    case QUESTIONS_DELETE:{
      return questions.filter(x => x.text !== action.question.text);
    }
    default:
      return questions;
  }
}

const mapStateToProps = function (state){
  return {
    questions:state.questions
  }
};

const mapDispatchToProps = dispatch => ({
  addQuestion: question => dispatch({
    type:QUESTIONS_ADD,
    question:question
  }),
  deleteQuestion: question => dispatch({
    type:QUESTIONS_DELETE,
    question:question
  })
});


const Questions =  connect(mapStateToProps,mapDispatchToProps)((props) =>
     (<div>
        <QuestionList questions={props.questions} onDeleteClicked={props.deleteQuestion}></QuestionList>
        <NewQuestionForm  onQuestionSubmitted={props.addQuestion} ></NewQuestionForm>
</div>));


function QuestionList({questions, onDeleteClicked}){
  return <div >
          <h3>Questions</h3>
          <ul className="list-group question-list">
            {questions.map((question) => <Question question={question} onDeleteClicked={onDeleteClicked} key={question.text}></Question>)}
          </ul>
        </div>;
}

function Question({question,onDeleteClicked}){
  return <li className="list-group-item">{question.text}<button onClick={() => onDeleteClicked(question)} className="btn delete-button btn-primary">X</button></li>
}

const emptyAnswer = () => ({ text:"", correct:false })
const emptyFromState = () => ({
  text:"",
  answers:[emptyAnswer(),emptyAnswer(),emptyAnswer(),emptyAnswer()],
})

class NewQuestionForm extends React.Component{  

  constructor(props){ 
    super(props);
    this.onQuestionSubmitted = props.onQuestionSubmitted;
    this.state = emptyFromState();

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleIsCorrectChange = this.handleIsCorrectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIsCorrectChange(event, index){
    const answers = [...this.state.answers]
    answers[index].correct = true;
    this.setState({answers: answers});
  }

  handleOptionChange(event, index) {
    const answers = [...this.state.answers]
    answers[index].text = event.target.value;
    this.setState({answers: answers});
  }

  handleQuestionChange(event) {
    this.setState({
      text:event.target.value
    });
  }

  handleSubmit(event) {
    this.onQuestionSubmitted(this.state);
    this.setState(emptyFromState());
    event.preventDefault();
  }

  render(){
          return <form onSubmit={this.handleSubmit}>
            <h3>New question</h3>
            <div className="form-group">
              <label htmlFor="newQuestionText">The new question</label>
              <input type="text" className="form-control" id="newQuestionText" value={this.state.text} placeholder="Enter question" onChange={this.handleQuestionChange}></input>
            </div>
            {this.state.answers.map((answer,index) =>  (
             <div className="form-group form-inline"  key={index}>
               <IsCorrect  handleChange={this.handleIsCorrectChange} isCorrect={answer.correct} index={index} ></IsCorrect> 
               <Option handleChange={this.handleOptionChange} value={answer.text} index={index} ></Option>
            </div>))}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
  }
}


function Option({handleChange, index, value}){
  const inputId = "optiontext" + index;
  const placeholder = "Option " + (index+1);
  return <>
    <label htmlFor={inputId}></label>
    <input type="text" className="form-control" id={inputId} placeholder={placeholder} value={value} onChange={(event) => handleChange(event,index,"input")}></input>
    </>
}

function IsCorrect({handleChange,index,isCorrect}){
  const radioButtonId = "radio" + index;
  return <div className="custom-control custom-radio">
      <input type="radio" className="custom-control-input" id={radioButtonId} checked={isCorrect} name="correctOption" onChange={(event) => handleChange(event,index)}></input>
      <label className="custom-control-label" htmlFor={radioButtonId}></label>
    </div>
}

export  {questionsReducer,Questions};

