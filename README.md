# 🤖 AI Code Generator

**Generate production-ready HTML, CSS, and JavaScript projects with AI in real-time**

![AI Code Generator Demo](https://via.placeholder.com/800x400/3b82f6/ffffff?text=AI+Code+Generator+Demo)

## ✨ Features

- 🚀 **Real-time Code Generation**: Watch AI generate your project files live
- 🎯 **Pure Web Standards**: Generates clean HTML, CSS, and JavaScript (no frameworks)
- 🔄 **Iterative Improvements**: AI continuously enhances your code quality
- 🎨 **Beautiful UI**: Modern React interface with Tailwind CSS
- 📱 **Responsive Design**: Works perfectly on all devices
- 💾 **Instant Download**: Download complete projects as ZIP files
- 🔧 **Production Ready**: All code follows best practices and is deployment-ready
- ⚡ **WebSocket Connection**: Real-time communication between frontend and backend
- 🌙 **Dark Mode**: Full dark mode support
- 📊 **Project Management**: Track and manage all your generated projects

## 🏗️ Architecture

```
ai-code-generator/
├── backend/              # Node.js + Express + Socket.io + Claude SDK
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment variables template
├── frontend/             # React + Tailwind CSS
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Context providers and utilities
│   │   └── styles/      # CSS and styling
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
├── generated/            # Generated project outputs
└── package.json          # Root package.json for scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Claude API key from [Anthropic](https://console.anthropic.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-code-generator.git
   cd ai-code-generator
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env

   # Edit the .env file and add your Claude API key
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Required: Claude API key
ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional: Server configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional: File settings
MAX_FILE_SIZE=10mb
MAX_PROJECTS=100
```

### Frontend Configuration

The frontend automatically connects to the backend. For production deployment, update the WebSocket connection URL in `frontend/src/utils/SocketContext.js`.

## 📖 Usage Guide

### Creating a New Project

1. **Navigate to Create Project**
   - Click "Create New Project" or go to `/create`

2. **Fill Project Details**
   - **Project Name**: One word, letters and numbers only (e.g., "portfolio", "restaurant")
   - **Description**: Detailed description of what you want to build
   - **Iterations**: Number of improvement cycles (0-5)

3. **Watch Real-time Generation**
   - See files being generated live
   - Monitor progress through the generation log
   - Watch improvements being applied

4. **Download or View**
   - View generated files with syntax highlighting
   - Preview the website in browser
   - Download complete project as ZIP

### Project Examples

**Portfolio Website:**
```
Name: portfolio
Description: A modern personal portfolio website with a hero section, about me, skills showcase, project gallery with hover effects, contact form, and smooth scrolling navigation. Include dark mode toggle and responsive design.
```

**Restaurant Website:**
```
Name: restaurant
Description: A beautiful restaurant website with an elegant header, menu sections with food images, about us story, reservation form, customer testimonials, and location map. Include image galleries and smooth animations.
```

**SaaS Landing Page:**
```
Name: startup
Description: A modern SaaS landing page with hero section, feature highlights, pricing tiers, customer testimonials, FAQ section, and call-to-action buttons. Include gradient backgrounds and modern UI elements.
```

## 🛠️ Development

### Available Scripts

```bash
# Development (runs both frontend and backend)
npm run dev

# Production build
npm run build

# Install all dependencies
npm run install:all

# Backend only
npm run backend:dev    # Development
npm run backend:start  # Production

# Frontend only
npm run frontend:dev   # Development
npm run frontend:start # Production (builds first)

# Utilities
npm run clean          # Remove all node_modules
npm run setup          # Full setup (install + build)
```

### Project Structure Details

**Backend (`/backend`)**
- `server.js`: Express server with Socket.io and Claude integration
- Real-time WebSocket communication
- File generation and management
- Project download endpoints

**Frontend (`/frontend`)**
- **Components**: Reusable UI components (Header, Sidebar, etc.)
- **Pages**: Main application pages (Landing, Create, Dashboard, Project View)
- **Hooks**: Custom React hooks for Socket.io and theme management
- **Utils**: Context providers for state management

**Generated Projects**
- Pure HTML5 with semantic markup
- Modern CSS3 with responsive design
- Vanilla JavaScript with ES6+ features
- README.md with project documentation

## 🎨 Generated Code Features

### HTML
- Semantic HTML5 structure
- SEO-friendly meta tags
- Accessibility features
- Clean, readable markup

### CSS
- Modern CSS3 features (Flexbox, Grid, Animations)
- Responsive design for all devices
- Beautiful color schemes and typography
- Smooth animations and transitions
- Cross-browser compatibility

### JavaScript
- ES6+ modern JavaScript
- Modular code structure
- Event handling and DOM manipulation
- Performance optimizations
- Error handling and validation

## 🚢 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   PORT=5000
   ANTHROPIC_API_KEY=your_key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Deploy to Platform**
   - Heroku, Railway, DigitalOcean, etc.
   - Ensure Node.js 18+ support
   - Set environment variables in platform dashboard

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Platform**
   - Vercel, Netlify, AWS S3 + CloudFront
   - Upload `build/` folder contents
   - Configure environment variables if needed

### Full-Stack Deployment

Deploy both frontend and backend on the same platform or use separate services with proper CORS configuration.

## 🧪 Testing

### Manual Testing

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Test core functionality**
   - Create a new project
   - Monitor real-time generation
   - View generated files
   - Download project ZIP
   - Test responsive design

3. **Test error scenarios**
   - Invalid project names
   - Network disconnections
   - API rate limits

### Automated Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🔒 Security

- **API Key Protection**: Never expose Claude API key in frontend
- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: API requests are rate-limited to prevent abuse
- **CORS Protection**: Proper CORS configuration for production
- **Helmet Security**: Security headers and protection middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Use TypeScript for type safety (future enhancement)
- Write comprehensive tests
- Update documentation for new features
- Follow semantic versioning

## 📊 Performance

- **Generation Speed**: ~30-60 seconds per project
- **File Sizes**: Optimized for minimal bundle sizes
- **Real-time Updates**: Sub-second WebSocket latency
- **Memory Usage**: Efficient project caching
- **Scalability**: Stateless backend design

## 🐛 Troubleshooting

### Common Issues

**Connection Issues:**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify WebSocket connection
# Check browser developer tools -> Network -> WS
```

**API Key Issues:**
```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Test API key manually
curl -H "x-api-key: $ANTHROPIC_API_KEY" https://api.anthropic.com/v1/messages
```

**Build Issues:**
```bash
# Clear all caches and reinstall
npm run clean
npm run install:all
npm run build
```

### Error Messages

- **"Not connected to server"**: Backend is not running or WebSocket connection failed
- **"ANTHROPIC_API_KEY not found"**: Environment variable not set correctly
- **"Project generation failed"**: Check API key validity and rate limits

## 📋 Roadmap

- [ ] **Code Templates**: Pre-built templates for common project types
- [ ] **Custom Styling**: User-defined color schemes and design preferences
- [ ] **GitHub Integration**: Direct deployment to GitHub Pages
- [ ] **Collaboration Features**: Share and collaborate on projects
- [ ] **API Documentation**: Comprehensive API documentation
- [ ] **Mobile App**: Native mobile app for project management
- [ ] **Plugin System**: Extensible plugin architecture
- [ ] **Advanced Customization**: More granular control over generation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for the powerful Claude AI API
- [React](https://reactjs.org) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Socket.io](https://socket.io) for real-time communication
- [Prism](https://prismjs.com) for syntax highlighting

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ai-code-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ai-code-generator/discussions)
- **Email**: support@ai-code-generator.app

---

**Built with ❤️ using Claude AI** • **Made for developers by developers** • **Open source and free forever**