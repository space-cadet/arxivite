# Project Brief
*Last Updated: 2025-04-26*

## Project Overview
A self-contained arXiv paper browser built with React + Vite. Uses the @agentic/arxiv package for direct arXiv interactions, with a modern UI built using ShadcnUI components.

## Goals
- Create a lightweight, self-contained arXiv paper browser
- Provide a modern, responsive interface for reading papers
- Enable easy search and filtering of papers
- Keep everything client-side for simplicity

## Core Features
- Paper search and browsing using @agentic/arxiv
- Category-based filtering
- Local storage for preferences
- Modern UI with ShadcnUI components

## Project Structure
```
arxivite/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions
├── public/                 # Static assets
└── memory-bank/           # Project documentation
```

## Key Components
- Custome build integration with arXiv api
- **ShadcnUI**: Modern UI component library
- **React + Vite**: Frontend framework and build tool
- **Local Storage**: Client-side data persistence

## Current Status
- Overall Progress: 10%
- Active Tasks: Initial setup
- Current Focus: Project structure and documentation

## Task Tracking
Tasks are tracked in `tasks.md` with the following priority structure:
- **High Priority**: Core paper browsing functionality
- **Medium Priority**: UI/UX improvements
- **Low Priority**: Additional features

## Memory Bank Organization
Following KIRSS principle:
- Keep documentation minimal but sufficient
- Focus on essential tracking
- Avoid overcomplication

## Implementation Guidelines
- Follow KIRSS principle
- Keep everything client-side
- Use local storage for persistence
- Minimize external dependencies

## External Dependencies
- shadcn/ui: Latest - UI components
- React: 18 - Frontend framework
- Vite: Latest - Build tool and dev server

## Notes
- No backend server required
- All data fetched directly from arXiv
- Preferences stored in browser
