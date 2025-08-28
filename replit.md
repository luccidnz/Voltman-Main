# Overview

This is a modern Volt-Man arcade-style game built as a full-stack web application. The project recreates the classic Pac-Man gameplay with a unique twist - featuring Volt, a lightning-powered miniature schnauzer navigating mazes while collecting treats and avoiding mutant rabbits. The application combines a React frontend with custom game engine, Express.js backend, and PostgreSQL database using modern web technologies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript and Vite for development tooling
- **Component Library**: Comprehensive Radix UI component system with Tailwind CSS for styling
- **State Management**: Zustand for game state and audio management
- **Game Engine**: Custom HTML5 Canvas-based 2D game engine with pixel-perfect rendering
- **Responsive Design**: Mobile-first approach with touch controls and desktop keyboard support

**Key Design Patterns**:
- Custom hook pattern for game logic (`useVoltManGame`, `useIsMobile`)
- Component composition with UI components in separate folder structure
- Canvas-based rendering system with dedicated game renderer class

## Backend Architecture

**Framework**: Express.js with TypeScript
- **API Design**: RESTful API structure with `/api` prefix routing
- **Development Server**: Vite integration for hot module replacement in development
- **Static File Serving**: Express serves built React application in production
- **Error Handling**: Centralized error handling middleware with structured error responses

**Architecture Choices**:
- Monorepo structure with shared TypeScript types between client and server
- Separate build processes for client (Vite) and server (esbuild)
- Development vs production environment handling with different middleware stacks

## Game Engine Architecture

**Core Components**:
- **GameRenderer**: Canvas-based rendering system with automatic scaling and centering
- **Player/Enemy Classes**: Entity system for game characters with position interpolation
- **Maze Generation**: Procedural maze creation with classic Pac-Man layout patterns
- **State Management**: Zustand stores for game state, audio, and UI management

**Game Loop Design**:
- Frame-based animation with requestAnimationFrame
- Delta time-based movement for consistent gameplay across different framerates
- Collision detection using tile-based coordinate system

## Data Storage Solutions

**Database**: PostgreSQL with Neon serverless adapter
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Code-first approach with migration support
- **Development Storage**: In-memory storage implementation for development/testing

**Storage Interface**:
- Abstract storage interface allowing multiple implementations
- User management system with username/password schema
- Prepared for game statistics and leaderboard features

## Authentication and Authorization

**Current Implementation**: Basic user schema prepared for future authentication
- **User Model**: Username/password structure with unique constraints
- **Session Management**: Infrastructure prepared for connect-pg-simple sessions
- **Security**: Password hashing and validation mechanisms ready for implementation

## External Dependencies

**Core Libraries**:
- **React Ecosystem**: React 18, React DOM, React Three Fiber for potential 3D features
- **UI Framework**: Radix UI primitives with Tailwind CSS styling system
- **State Management**: Zustand for lightweight reactive state
- **Database**: Drizzle ORM with Neon PostgreSQL adapter
- **Development**: Vite, TypeScript, esbuild for build tooling

**Game-Specific Dependencies**:
- **Audio**: Web Audio API integration for sound effects and background music
- **Graphics**: HTML5 Canvas with potential WebGL support via React Three Fiber
- **Input Handling**: Custom touch and keyboard input systems
- **Asset Management**: Vite asset pipeline with support for audio and 3D model files

**Styling and UI**:
- **CSS Framework**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React icon library
- **Fonts**: Inter font family via Fontsource
- **Animations**: CSS-based animations with Tailwind utilities

**Development Tools**:
- **TypeScript**: Strict type checking across entire codebase
- **Build Tools**: Vite for frontend, esbuild for backend bundling
- **Environment**: Replit-optimized with runtime error overlay
- **Database Tools**: Drizzle Kit for schema management and migrations