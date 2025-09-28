import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateProject from './pages/CreateProject';
import ProjectDashboard from './pages/ProjectDashboard';
import ProjectView from './pages/ProjectView';
import LandingPage from './pages/LandingPage';

// Hooks
import { useSocket } from './hooks/useSocket';
import { useTheme } from './hooks/useTheme';

// Utils
import { SocketProvider } from './utils/SocketContext';
import { ThemeProvider } from './utils/ThemeContext';
import { ProjectProvider } from './utils/ProjectContext';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const { connected } = useSocket();
  const { theme } = useTheme();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Connection Status Indicator */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: connected ? -100 : 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm font-medium"
      >
        🔌 Disconnected from server. Attempting to reconnect...
      </motion.div>

      <Router>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              currentPage={currentPage}
            />

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<LandingPage onNavigate={setCurrentPage} />} />
                <Route path="/create" element={<CreateProject />} />
                <Route path="/dashboard" element={<ProjectDashboard />} />
                <Route path="/project/:id" element={<ProjectView />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Loading Overlay for global loading states */}
      <div id="loading-portal" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;