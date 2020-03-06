import React from 'react';
import Redux, { bindActionCreators } from "redux";
import { Provider } from 'react-redux'
import {connect} from "react-redux"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import './Questions.css';
const QUESTIONS_ADD = "QUESTIONS_ADD"
const QUESTIONS_DELETE = "QUESTIONS_DELETE"

const questionsReducer =  (questionEditor, action) => {
  switch(action.type){
    case QUESTIONS_ADD:{
      // if(questionEditor.questions.find(q => q.text.trim() === action.question.text.trim())){
      //   NotificationManager.error('Error message', 'Question already exists!', 3000);
      // }
      questionEditor.questions = [...questionEditor.questions,action.question];
      return {...questionEditor};
    }
    case QUESTIONS_DELETE:{
      questionEditor.questions = questionEditor.questions.filter(q => q !== action.question);
      return {...questionEditor};
    }
    default:
      return questionEditor;
  }
}

const mapStateToProps = function (state){
  return {
    questions: state.questionEditor.questions
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


const Questions = connect(mapStateToProps,mapDispatchToProps)((props) =>
     (<div >
        <QuestionList questions={props.questions} onDeleteClicked={props.deleteQuestion}></QuestionList>
        <NewQuestionForm  onQuestionSubmitted={props.addQuestion} ></NewQuestionForm>
      </div>));


// function QuestionList({questions, onDeleteClicked}){
//   return <div>
//           <h3>Questions</h3>
//           <ul className="list-group question-list">
//             {questions.map((question) => <Question question={question} onDeleteClicked={onDeleteClicked} key={question.text}></Question>)}
//           </ul>
//         </div>;
// }
function QuestionList({questions, onDeleteClicked}){
  let questionList;
  if(questions.length !== 0){
    let questionList = questions.map((question) => <Question question={question} onDeleteClicked={onDeleteClicked} key={question.text}></Question>)
    return <div >
            <h3 className="cover-heading">Questions</h3>
            <div className="col-12 question-list">
              {questionList}
            </div>
          </div>;
  }else{
    return <></>
  }
}
function Question({question,onDeleteClicked}){
  return <div className="row">
          <div className="col-10">
            <p className="lead question">{question.text}</p>
          </div>
          <div className="col-2">
            <button onClick={() => onDeleteClicked(question)} className="btn delete-button btn-primary">X</button>
          </div>
        </div>
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
    this.handleOnInput = this.handleOnInput.bind(this);
  }

  handleIsCorrectChange(event, index){
    const answers = this.state.answers.map((answer,i)=> {
      answer.correct = i === index;
      return answer;
    })
    this.setState({answers: answers});
  }

  handleOptionChange(event, index) {
    const answers = [...this.state.answers]
    answers[index].text = event.target.value;
    this.setState({answers: answers});
  }

  handleOnInput(event){
    event.target.setCustomValidity("");
  }

  handleInvalid(event){
    const setCustomValidity = (message) => {
      event.target.setCustomValidity("");
      if (!event.target.validity.valid) {
        event.target.setCustomValidity(message);
      }
    }
    if(event.target.id && event.target.id.startsWith("radio")){
      setCustomValidity("Select a correct answer!")
    } if(event.target.id && event.target.id.startsWith("optiontext")){
      setCustomValidity("Answer cannot be empty!")
    } if(event.target.id === "newQuestionText"){
      setCustomValidity("Question cannot be empty!")
    }
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
          return <form onSubmit={this.handleSubmit} className="question-from">
            <h3>New question</h3>
            <div className="form-group row">
              {/* <label htmlFor="newQuestionText">The new question</label> */}
              <input type="text" 
                className="form-control" 
                id="newQuestionText" 
                value={this.state.text} 
                onInvalid={this.handleInvalid} 
                placeholder="Enter question" 
                onChange={this.handleQuestionChange}
                onInput={this.handleOnInput} 
                required
                autoComplete="off" ></input>
            </div>
            {this.state.answers.map((answer,index) =>  (
             <div className="form-group form-inline row"  key={index}>
               <IsCorrect {...this}  handleChange={this.handleIsCorrectChange} handleInvalid={this.handleInvalid} isCorrect={answer.correct} index={index} ></IsCorrect> 
               <Option {...this} handleChange={this.handleOptionChange} handleInvalid={this.handleInvalid} value={answer.text} index={index}  ></Option>
            </div>))}
            <div className="form-group row">
              <button type="submit" className="btn btn-primary btn-lg btn-block">Create question!</button>
            </div>
          </form>
  }
}


function Option({handleChange, handleOnInput, handleInvalid, index, value}){
  const inputId = "optiontext" + index;
  const placeholder = "Option " + (index+1);
  return <div className="col-10">
    <label htmlFor={inputId}></label>
    <input  type="text" 
            className="form-control option-input float-left" 
            id={inputId}  
            placeholder={placeholder} 
            value={value} 
            onInvalid={handleInvalid} 
            onInput={handleOnInput} 
            onChange={(event) => handleChange(event,index,"input")} 
            required
            autoComplete="off" >
    </input>
    </div>
}

function IsCorrect({handleChange, handleInvalid,handleOnInput,index,isCorrect}){
  const radioButtonId = "radio" + index;
  return <div className="custom-control custom-radio col-1">
      <input type="radio" 
            className="custom-control-input" 
            id={radioButtonId} 
            checked={isCorrect} 
            required 
            onInvalid={handleInvalid} 
            onInput={handleOnInput} 
            value={index} 
            name="correctOption" 
            onChange={(event) => handleChange(event,index)}>
      </input>
      <label className="custom-control-label" htmlFor={radioButtonId}></label>
    </div>
}

export  {questionsReducer,Questions};

