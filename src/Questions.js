import React from 'react';
import './Questions.css';

model = {

}

class QuizApp{

  constructor(){
      this.model = {
        questions:[{
          text:"Elso kerdes ?",
          answers:["a","b","c","d"],
          correct:"a"
        },{
          text:"Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg?Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg,Masodik kerder kerdes ami nagyon hosszu de tenyleg?",
          answers:["a","b","c","d"],
          correct:"d"
        },{
          text:"Harmadik kerdes ?",
          answers:["a","b","c","d"],
          correct:"b"
        }]
      }
  }

  getState(){

  }

  handleIntent(){

  }

}


class Questions extends React.Component {

  constructor(props){
    super(props)
    this.questions = props.questions;
    this.deleteQuestion = this.deleteQuestion.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
  }


  deleteQuestion(question){
    this.setState({
        questions: this.state.questions.filter(x => x.text !== question.text)
    });
  }

  addQuestion(question){
    this.state.questions.push(question);
    this.setState({
        questions: this.state.questions
    });
  }
  
  render(){
    return  <div>
        <QuestionList {...this.state} onDeleteClicked={this.deleteQuestion}></QuestionList>
        <NewQuestionForm  onQuestionSubmitted={this.addQuestion} ></NewQuestionForm>
    </div>;
  }
}


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

class NewQuestionForm extends React.Component{  
  emptyState = {
    text:"",
    answers:["","","",""],
    isCorrect:[false,false,false,false]
  }

  constructor(props){ 
    super(props);
    this.onQuestionSubmitted = props.onQuestionSubmitted;
    this.state = this.emptyState;

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleIsCorrectChange = this.handleIsCorrectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIsCorrectChange(event, index){
    let isCorrect = [...this.emptyState.isCorrect]
    isCorrect[index] = true;
    this.setState({
      isCorrect:isCorrect
    });
  }

  handleOptionChange(event, index) {
    const answers = [...this.state.answers]
    answers[index] = event.target.value;
    this.setState({answers: answers});
  }

  handleQuestionChange(event) {
    this.setState({
      text:event.target.value
    });
  }

  handleSubmit(event) {
    this.onQuestionSubmitted(this.state);
    this.setState(this.emptyState);
    event.preventDefault();
  }

  render(){
          return <form onSubmit={this.handleSubmit}>
            <h3>New question</h3>
            <div className="form-group ">
              <label htmlFor="newQuestionText">The new question</label>
              <input type="text" className="form-control" id="newQuestionText" value={this.state.text} placeholder="Enter question" onChange={this.handleQuestionChange}></input>
            </div>
            {this.state.answers.map((value,index) =>  (
             <div className="form-group form-inline"  key={index}>
               <IsCorrect  handleChange={this.handleIsCorrectChange} isCorrect={this.state.isCorrect[index]} index={index} ></IsCorrect> 
               <Option handleChange={this.handleOptionChange} value={value} isCorrect={this.state.isCorrect[index]} index={index} ></Option>
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

export default Questions;
