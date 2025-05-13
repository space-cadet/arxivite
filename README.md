# Arxivite

A modern, lightweight arXiv paper browser built with React + Vite. Features a custom-built arXiv API integration for reliable paper fetching and time-based filtering.

## Features

- 🔍 Search and browse arXiv papers with advanced filtering
- 📱 Fully responsive design optimized for mobile and tablet
- 🏷️ Bookmark papers and organize your research
- 🎨 Modern UI with ShadcnUI components
- 💾 Local storage for preferences and UI state
- 🚀 Fast, client-side only - no backend required
- ⚡ Direct arXiv API integration with robust time-based filtering
- 📊 Research profile management
- 🔄 UI state persistence across sessions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/arxivite.git
cd arxivite

# Install dependencies (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Development

```bash
# Start development server with pnpm (recommended)
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

### Building for Production

```bash
# Build with pnpm (recommended)
pnpm build

# Or using npm
npm run build

# Or using yarn
yarn build
```

## Project Structure

```
arxivite/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── papers/        # Paper-related components
│   │   ├── search/        # Search components
│   │   ├── profile/       # Profile components
│   │   ├── layout/        # Layout components
│   │   └── bookmarks/     # Bookmark components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   │   ├── arxiv.ts       # Custom arXiv API client
│   │   └── bookmarks/     # Bookmark management
│   └── pages/             # Page components
├── public/                 # Static assets
└── memory-bank/           # Project documentation
```

## Core Features

### Custom arXiv Integration
- Direct XML API integration with export.arxiv.org
- Robust time-based filtering support
- Special handling for ID-based queries
- Efficient response caching

### Mobile Optimization
- Responsive design for all screen sizes
- Touch-optimized controls
- Mobile-specific navigation
- Adaptive paper display

### Paper Management
- Bookmark papers for later
- Organize research by categories
- UI state persistence
- Profile-based filtering

## Built With

- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build tool
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [TypeScript](https://typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Radix UI](https://www.radix-ui.com) - Accessible primitives

## Contributing

Feel free to submit issues and enhancement requests.

## Team

- **Deepak Vaid** - Project Designer - [dvaid79@gmail.com](mailto:dvaid79@gmail.com)
- **Claude 3.5** - Chief Coding Assistant

## Package Management

While pnpm is the recommended package manager for this project (for its efficiency and disk space usage), the project can be built using any Node.js package manager (npm, yarn, etc.) as long as you have access to the source code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.