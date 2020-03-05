import React from 'react';
import { render } from '@testing-library/react';
import QuizApp from './QuizApp';


test('rootReducer returns initial state', () => {
  const { getByText } = render(<QuizApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
