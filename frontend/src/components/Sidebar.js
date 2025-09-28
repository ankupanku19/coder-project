import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Home,
  Plus,
  FolderOpen,
  Settings,
  Code,
  Zap,
  FileText,
  Download,
  Github,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'landing',
      label: 'Home',
      icon: Home,
      path: '/',
      description: 'Return to home page',
    },
    {
      id: 'create',
      label: 'Create Project',
      icon: Plus,
      path: '/create',
      description: 'Generate a new project with AI',
    },
    {
      id: 'dashboard',
      label: 'My Projects',
      icon: FolderOpen,
      path: '/dashboard',
      description: 'View and manage your projects',
    },
  ];

  const bottomMenuItems = [
    {
      id: 'docs',
      label: 'Documentation',
      icon: FileText,
      external: true,
      href: 'https://docs.ai-code-generator.app',
      description: 'Learn how to use the AI Code Generator',
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: Github,
      external: true,
      href: 'https://github.com/ai-code-generator',
      description: 'View source code and contribute',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Configure your preferences',
    },
  ];

  const handleMenuClick = (item) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.path);
      onPageChange(item.id);
    }
    onClose();
  };

  const isCurrentPage = (itemPath) => {
    return location.pathname === itemPath;
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    open: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + index * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    }),
    closed: {
      opacity: 0,
      x: -20,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    AI Code Generator
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    v1.0.0
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Main Menu */}
            <div className="flex-1 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = isCurrentPage(item.path);

                return (
                  <motion.button
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Features Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Code className="w-4 h-4 text-primary-500" />
                  <span>HTML, CSS, JS Generation</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span>Real-time Code Updates</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Download className="w-4 h-4 text-primary-500" />
                  <span>Instant Project Download</span>
                </div>
              </div>
            </div>

            {/* Bottom Menu */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                {bottomMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = !item.external && isCurrentPage(item.path);

                  return (
                    <motion.button
                      key={item.id}
                      custom={menuItems.length + index}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.external && (
                        <div className="ml-auto">
                          <div className="w-3 h-3 border border-gray-400 rounded-sm flex items-center justify-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;