import React from 'react';
import { render } from '@testing-library/react';
import {createGameStore,emptyState} from './GameState';
import cloneDeep from "lodash"
const mockStorage = (initalstate=null) => ({
  state: initalstate,
  save: function(newState){
    this.state = cloneDeep(newState);
  },
  load:function(){
    return this.state;
  }
})

test('can create empty store', () => {
  const store = createGameStore(mockStorage());
  expect(store).toBeInstanceOf(Object)
  let state = store.getState();
  expect(state).toBeInstanceOf(Object)
  expect(state.game).toBeInstanceOf(Object)
  expect(state.questionEditor).toBeInstanceOf(Object)
});


test('loads state from localStorage', () => {
  const testState = emptyState();
  testState.game.player = "Player 1";
  expect(testState.game.player).toBe("Player 1");
  const state = createGameStore(mockStorage(testState)).getState();
  expect(state).toBeInstanceOf(Object)
  expect(state.game).toBeInstanceOf(Object)
  expect(state.game.player).toBe("Player 1");
});