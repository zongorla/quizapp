

import { gameReducer, emptyGame} from "./Game"
import { questionsReducer} from './Questions';
import {createStore} from "redux"

let emptyState = () => ({
    questionEditor:{
      questions:[]
    },
    game:emptyGame()
  });
  
function createGameStore(storage){
    var store = createStore(rootReducer);
    var saveCalled = 0;
    store.subscribe(() => {
        storage.save(store.getState());
        console.log("Save called " + (++saveCalled));
    });

    function rootReducer(state,action){
        if(state === undefined){
            let initialState = storage.load(validateState);
            if(!initialState){
                initialState = emptyState();
            }      
            return initialState;
        }
        let newState = {...state};  
        newState.questionEditor = questionsReducer(state.questionEditor,action);
        newState = gameReducer(newState,action)
        
        return newState;
    }

    function validateState(state){
        return (state.questionEditor instanceof Object
        && state.game instanceof Object)
    }
    return store;

}


export {createGameStore,emptyState};