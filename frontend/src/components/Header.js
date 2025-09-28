import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun, Zap, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useSocket } from '../hooks/useSocket';

const Header = ({ onMenuClick, currentPage }) => {
  const { theme, toggleTheme } = useTheme();
  const { connected } = useSocket();

  const getPageTitle = () => {
    switch (currentPage) {
      case 'landing':
        return 'AI Code Generator';
      case 'create':
        return 'Create New Project';
      case 'dashboard':
        return 'Project Dashboard';
      default:
        return 'AI Code Generator';
    }
  };

  const getPageDescription = () => {
    switch (currentPage) {
      case 'landing':
        return 'Generate production-ready HTML, CSS, and JavaScript projects with AI';
      case 'create':
        return 'Tell us about your project and watch AI create it in real-time';
      case 'dashboard':
        return 'Manage and download your generated projects';
      default:
        return 'Generate production-ready web projects with AI';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:px-6">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 hidden lg:block">
                {getPageDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Connection Status */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              connected
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {connected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="hidden sm:inline">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnected</span>
              </>
            )}
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </motion.button>

          {/* User Avatar/Profile (placeholder for future) */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="sm:hidden mt-3">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getPageDescription()}
        </p>
      </div>
    </header>
  );
};

export default Header;