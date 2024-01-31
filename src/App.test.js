import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

test('renders the component', () => {
  render(<App />);
  expect(screen.getByText(/Delivery Fee Calculator/i)).toBeInTheDocument();
});

test('calculates cart value and subcharge correctly', () => {
  render(<App />);
  const cartInput = screen.getByLabelText('Input cart value:');

  fireEvent.change(cartInput, { target: { value: '8' } });

  expect(screen.getByText(/Cart value is: 8 and subcharge is: 2 --> totaling: 10 €/i)).toBeInTheDocument();
});