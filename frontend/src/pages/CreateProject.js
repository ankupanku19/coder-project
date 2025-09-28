import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  FileText,
  Code,
  Palette,
  Download,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProject } from '../utils/ProjectContext';
import { useSocket } from '../hooks/useSocket';

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject, currentProject, generationStatus, logs, loading, error } = useProject();
  const { connected } = useSocket();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    improvements: 2,
  });

  const [step, setStep] = useState('form'); // 'form', 'generating', 'completed'

  useEffect(() => {
    if (generationStatus) {
      if (generationStatus.status === 'generating' || generationStatus.status === 'improving') {
        setStep('generating');
      } else if (generationStatus.status === 'completed') {
        setStep('completed');
      } else if (generationStatus.status === 'error') {
        setStep('form');
      }
    }
  }, [generationStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!connected) {
      toast.error('Not connected to server. Please wait for connection.');
      return;
    }

    if (!formData.projectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Project description is required');
      return;
    }

    // Validate project name
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(formData.projectName)) {
      toast.error('Project name must start with a letter and contain only letters and numbers');
      return;
    }

    setStep('generating');
    createProject(formData);
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      description: '',
      improvements: 2,
    });
    setStep('form');
  };

  const handleViewProject = () => {
    if (currentProject) {
      navigate(`/project/${currentProject.id}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'initializing':
        return <Clock className="w-5 h-5 animate-spin" />;
      case 'generating':
        return <Code className="w-5 h-5 animate-pulse" />;
      case 'improving':
        return <Sparkles className="w-5 h-5 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getProgress = () => {
    if (!generationStatus) return 0;

    switch (generationStatus.status) {
      case 'initializing':
        return 10;
      case 'generating':
        return 50;
      case 'improving':
        return 80;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const projectExamples = [
    {
      name: 'portfolio',
      description: 'A modern personal portfolio website with a hero section, about me, skills showcase, project gallery with hover effects, contact form, and smooth scrolling navigation. Include dark mode toggle and responsive design.',
    },
    {
      name: 'restaurant',
      description: 'A beautiful restaurant website with an elegant header, menu sections with food images, about us story, reservation form, customer testimonials, and location map. Include image galleries and smooth animations.',
    },
    {
      name: 'startup',
      description: 'A modern SaaS landing page with hero section, feature highlights, pricing tiers, customer testimonials, FAQ section, and call-to-action buttons. Include gradient backgrounds and modern UI elements.',
    },
  ];

  const handleUseExample = (example) => {
    setFormData({
      ...formData,
      projectName: example.name,
      description: example.description,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Create Your AI-Generated Project
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Describe your project and watch AI generate beautiful HTML, CSS, and JavaScript code in real-time.
                </p>
              </div>

              {/* Project Examples */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Start Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projectExamples.map((example, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUseExample(example)}
                      className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                        {example.name} Website
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {example.description.substring(0, 100)}...
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="card space-y-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="e.g., portfolio, restaurant, startup"
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    One word, letters and numbers only. This will be your folder name.
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project in detail. Include the type of website, features you want, design preferences, color schemes, layout ideas, and any specific functionality."
                    className="textarea-field"
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Be as detailed as possible. The more context you provide, the better the AI can understand your vision.
                  </p>
                </div>

                <div>
                  <label htmlFor="improvements" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Improvement Iterations
                  </label>
                  <select
                    id="improvements"
                    name="improvements"
                    value={formData.improvements}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value={0}>No improvements (faster)</option>
                    <option value={1}>1 iteration</option>
                    <option value={2}>2 iterations (recommended)</option>
                    <option value={3}>3 iterations</option>
                    <option value={4}>4 iterations</option>
                    <option value={5}>5 iterations (maximum quality)</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    More iterations = higher quality code, but takes longer to generate.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !connected}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 py-4"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Project...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Generate Project</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary flex items-center justify-center space-x-2 py-4"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Reset</span>
                  </motion.button>
                </div>

                {!connected && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Not connected to server. Please wait for connection.</span>
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  AI is Creating Your Project
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Sit back and watch the magic happen in real-time
                </p>
              </div>

              {/* Progress */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(generationStatus?.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {generationStatus?.status === 'initializing' && 'Initializing Project'}
                        {generationStatus?.status === 'generating' && 'Generating Files'}
                        {generationStatus?.status === 'improving' && 'Improving Code Quality'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {generationStatus?.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {getProgress()}%
                  </div>
                </div>

                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Live Logs */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Live Generation Log
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
                  {logs.slice(-10).map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`mb-2 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' || log.type === 'file-complete' ? 'text-green-400' :
                        log.type === 'file-start' ? 'text-blue-400' :
                        'text-gray-300'
                      }`}
                    >
                      <span className="text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {' '}
                      {log.message}
                    </motion.div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-gray-500">Waiting for generation to start...</div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Project Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Improvements</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.improvements} iterations</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="text-gray-900 dark:text-white">{formData.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Success Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Project Generated Successfully!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Your AI-generated project is ready for download and deployment
                </p>
              </div>

              {/* Project Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">HTML</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Generated</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Palette className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">CSS</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Generated</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Code className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">JavaScript</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Generated</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Improvements</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formData.improvements}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewProject}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2 py-4"
                >
                  <FileText className="w-5 h-5" />
                  <span>View Project Files</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (currentProject) {
                      try {
                        const serverUrl = process.env.REACT_APP_SERVER_URL || 'https://coder-project-jar9.onrender.com';
                        const downloadUrl = `${serverUrl}/api/projects/${currentProject.id}/download`;
                        console.log('Download URL:', downloadUrl);
                        window.open(downloadUrl, '_blank');
                        toast.success('Download started!');
                      } catch (error) {
                        console.error('Download error:', error);
                        toast.error('Failed to start download');
                      }
                    } else {
                      toast.error('No project available for download');
                    }
                  }}
                  className="btn-outline flex items-center justify-center space-x-2 py-4"
                >
                  <Download className="w-5 h-5" />
                  <span>Download ZIP</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="btn-secondary flex items-center justify-center space-x-2 py-4"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Another</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Error</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateProject;