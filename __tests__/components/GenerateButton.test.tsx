import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerateButton from '@/app/components/GenerateButton';

describe('GenerateButton', () => {
  const mockOnGenerate = jest.fn();
  const mockOnAbort = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders generate button when not generating', () => {
    render(
      <GenerateButton
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        isGenerating={false}
        disabled={false}
      />
    );
    
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
  });

  it('renders abort button when generating', () => {
    render(
      <GenerateButton
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        isGenerating={true}
        disabled={false}
      />
    );
    
    expect(screen.getByRole('button', { name: /abort/i })).toBeInTheDocument();
  });

  it('calls onGenerate when generate button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GenerateButton
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        isGenerating={false}
        disabled={false}
      />
    );
    
    const button = screen.getByRole('button', { name: /generate/i });
    await user.click(button);
    
    expect(mockOnGenerate).toHaveBeenCalled();
  });

  it('calls onAbort when abort button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GenerateButton
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        isGenerating={true}
        disabled={false}
      />
    );
    
    const button = screen.getByRole('button', { name: /abort/i });
    await user.click(button);
    
    expect(mockOnAbort).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <GenerateButton
        onGenerate={mockOnGenerate}
        onAbort={mockOnAbort}
        isGenerating={false}
        disabled={true}
      />
    );
    
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

