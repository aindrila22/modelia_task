# Modelia - AI-Powered Image Generation

A modern, responsive web application for AI-powered image generation built with Next.js, React, and TypeScript.

![Modelia Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Modelia+AI+Image+Generation)

## 🚀 Features

- **AI Image Generation**: Upload an image, add a prompt, and generate AI-powered variations
- **Multiple Styles**: Choose from various artistic styles (Editorial, Artistic, Cinematic, etc.)
- **Real-time Preview**: See your generation parameters before processing
- **History Management**: View and restore previous generations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic theme switching based on system preferences
- **PWA Ready**: Install as a progressive web app for offline access
- **Error Handling**: Robust error boundaries and user-friendly error messages
- **Performance Optimized**: Code splitting, memoization, and image optimization

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Testing**: Jest + React Testing Library + Playwright
- **PWA**: Workbox for service worker and offline caching
- **State Management**: React Hooks (useState, useCallback, useEffect)
- **Performance**: React.memo, lazy loading, Suspense

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/modelia.git
   cd modelia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### Test Coverage
- **Unit Tests**: Component behavior, user interactions, edge cases
- **E2E Tests**: Critical user flows, cross-browser compatibility
- **Coverage**: Aim for >80% code coverage

## 📁 Project Structure
