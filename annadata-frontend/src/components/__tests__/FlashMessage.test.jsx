import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlashMessages } from '../FlashMessage.jsx';

describe('FlashMessage Component', () => {
  const mockMessages = [
    { id: '1', message: 'Success message', type: 'success' },
    { id: '2', message: 'Error occurred', type: 'danger' }
  ];

  const mockCloseHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders multiple flash messages', () => {
    render(
      <FlashMessages 
        messages={mockMessages} 
        onCloseMessage={mockCloseHandler} 
      />
    );
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('applies correct bootstrap classes based on message type', () => {
    render(
      <FlashMessages 
        messages={mockMessages} 
        onCloseMessage={mockCloseHandler} 
      />
    );
    
    const successAlert = screen.getByText('Success message').closest('.alert');
    const errorAlert = screen.getByText('Error occurred').closest('.alert');
    
    expect(successAlert).toHaveClass('alert-success');
    expect(errorAlert).toHaveClass('alert-danger');
  });

  test('calls onCloseMessage when close button is clicked', () => {
    render(
      <FlashMessages 
        messages={mockMessages} 
        onCloseMessage={mockCloseHandler} 
      />
    );
    
    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);
    
    expect(mockCloseHandler).toHaveBeenCalledWith('1');
  });

  test('renders nothing when no messages are provided', () => {
    const { container } = render(
      <FlashMessages 
        messages={[]} 
        onCloseMessage={mockCloseHandler} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });
});
