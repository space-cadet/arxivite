# arxivite

A lightweight, self-contained arXiv paper browser built with React + Vite.

## Features

- Search and browse arXiv papers directly in your browser
- No backend required - uses @agentic/arxiv package
- Modern UI with ShadcnUI components
- Local storage for preferences
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd arxivite

# Install dependencies (using npm)
npm install

# Or using Bun
bun install
```

### Development

```bash
# Start development server
npm run dev

# Or using Bun
bun dev
```

## Project Structure

```
arxivite/
├── src/              # Source code
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions
├── public/           # Static assets
└── memory-bank/      # Project documentation
```

## Built With

- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build tool
- [@agentic/arxiv](https://npmjs.com/package/@agentic/arxiv) - arXiv API client
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [TypeScript](https://typescriptlang.org) - Type safety

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
