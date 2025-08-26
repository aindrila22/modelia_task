import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../../app/components/ImageUpload';

// Mock FileReader
class MockFileReader {
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;
  readAsDataURL(file: Blob) {
    // Simulate an image file being read
    if (this.onload) {
      this.onload.call(
        this as unknown as FileReader,
        { target: { result: 'data:image/jpeg;base64,mocked' } } as ProgressEvent<FileReader>
      );
    }
  }
}
(global as typeof globalThis).FileReader = MockFileReader as typeof FileReader;

// Mock Image constructor
class MockImage {
  onload: (() => void) | null = null;
  src: string = '';
  width: number = 100;
  height: number = 100;
  
  constructor() {
    // Simulate image loading
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}
(global as typeof globalThis).Image = MockImage as typeof Image;

// Mock canvas
const mockToDataURL = jest.fn(() => 'data:image/jpeg;base64,mocked');
(global as typeof globalThis).HTMLCanvasElement.prototype.getContext = (function(contextId: string) {
  if (contextId === '2d') {
    return {
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;
(global as typeof globalThis).HTMLCanvasElement.prototype.toDataURL = mockToDataURL;

describe('ImageUpload', () => {
  const mockOnImageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area', () => {
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />);
    expect(screen.getByText(/upload an image/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('shows selected image when provided', () => {
    const testImageUrl = 'data:image/jpeg;base64,test';
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={testImageUrl} />);
    const image = screen.getByAltText('Selected image');
    expect(image).toHaveAttribute('src', testImageUrl);
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    render(<ImageUpload onImageSelect={mockOnImageSelect} selectedImage={null} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload image/i);
    
    await user.upload(input, file);

    await waitFor(() => {
      expect(mockOnImageSelect).toHaveBeenCalledWith(expect.stringContaining('data:image/jpeg;base64'));
    });
  });

});