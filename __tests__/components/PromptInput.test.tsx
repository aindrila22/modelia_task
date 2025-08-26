

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PromptInput from '@/app/components/PromptInput';

// Helper wrapper to simulate controlled usage
function Wrapper({ initialValue = '', placeholder = 'Test' }) {
  const [val, setVal] = React.useState(initialValue);
  return (
    <PromptInput
      value={val}
      onChange={setVal}
      placeholder={placeholder}
    />
  );
}

describe('PromptInput', () => {
  it('renders with placeholder text', () => {
    render(<Wrapper placeholder="Test placeholder" />);
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<Wrapper initialValue="Test prompt" />);
    
    expect(screen.getByDisplayValue('Test prompt')).toBeInTheDocument();
  });

  it('calls onChange when user types and updates value', async () => {
    const user = userEvent.setup();
    render(<Wrapper />);
    
    const input = screen.getByPlaceholderText('Test');
    await user.type(input, 'Hello');
    
    // Input should show final value
    expect(input).toHaveValue('Hello');
  });

  it('shows character count', () => {
    render(<Wrapper initialValue="Test" />);
    
    expect(screen.getByText('4/500')).toBeInTheDocument();
  });
});