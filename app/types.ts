export type Style = 'Editorial' | 'Streetwear' | 'Vintage';

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: Style;
  createdAt: string;
}

export interface GenerateRequest {
  imageDataUrl: string;
  prompt: string;
  style: Style;
}

export interface GenerateResponse {
  id: string;
  imageUrl: string;
  prompt: string;
  style: Style;
  createdAt: string;
}

export interface GenerateError {
  message: string;
}
