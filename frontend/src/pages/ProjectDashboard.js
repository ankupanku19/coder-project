import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Download,
  Eye,
  Calendar,
  Clock,
  FileText,
  Code,
  Palette,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { useProject } from '../utils/ProjectContext';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const { projects, loading } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      initializing: { label: 'Initializing', className: 'status-badge initializing' },
      generating: { label: 'Generating', className: 'status-badge generating' },
      improving: { label: 'Improving', className: 'status-badge improving' },
      completed: { label: 'Completed', className: 'status-badge completed' },
      error: { label: 'Error', className: 'status-badge error' },
    };

    const config = statusConfig[status] || statusConfig.initializing;
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  };

  const handleViewProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDownloadProject = (projectId) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    window.open(`${serverUrl}/api/projects/${projectId}/download`, '_blank');
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and download your AI-generated projects
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </motion.button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pl-10 pr-8 appearance-none"
              >
                <option value="all">All Projects</option>
                <option value="completed">Completed</option>
                <option value="generating">Generating</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No matching projects'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {projects.length === 0
                ? 'Start by creating your first AI-generated project'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {projects.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="btn-primary"
              >
                Create Your First Project
              </motion.button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300 group"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                      {project.name}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleViewProject(project.id)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                      title="View project"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {project.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadProject(project.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Download project"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                )}

                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <FileText className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">HTML</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Palette className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">CSS</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Code className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">JS</p>
                  </div>
                </div>

                {/* Project Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : 'Unknown'
                      }
                    </span>
                  </div>
                  {project.completedAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {Math.round((new Date(project.completedAt) - new Date(project.createdAt)) / 1000)}s
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewProject(project.id)}
                    className="btn-outline flex-1 py-2 text-sm"
                  >
                    View Files
                  </motion.button>
                  {project.status === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownloadProject(project.id)}
                      className="btn-primary py-2 px-4 text-sm flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;