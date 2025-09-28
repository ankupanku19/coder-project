import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ArrowLeft,
  Download,
  FileText,
  Code,
  Palette,
  Copy,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProject } from '../utils/ProjectContext';
import { useSocket } from '../hooks/useSocket';

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, getProjectFiles } = useProject();
  const { connected } = useSocket();

  const [activeFile, setActiveFile] = useState('index.html');
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const project = projects.find(p => p.id === id) || currentProject;

  useEffect(() => {
    if (project && project.files) {
      setFiles(project.files);
      setLoading(false);
    } else if (connected && id) {
      getProjectFiles(id);
    }
  }, [project, connected, id, getProjectFiles]);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project, setCurrentProject]);

  const fileTypes = {
    'index.html': { icon: FileText, language: 'html', label: 'HTML' },
    'styles.css': { icon: Palette, language: 'css', label: 'CSS' },
    'script.js': { icon: Code, language: 'javascript', label: 'JavaScript' },
    'README.md': { icon: FileText, language: 'markdown', label: 'README' },
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleDownload = () => {
    if (project) {
      const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
      window.open(`${serverUrl}/api/projects/${project.id}/download`, '_blank');
    }
  };

  const handleImprove = () => {
    if (project && connected) {
      // Implement improvement functionality
      toast.success('Requesting improvements...');
    }
  };

  const getLanguageFromFile = (fileName) => {
    const fileType = fileTypes[fileName];
    return fileType ? fileType.language : 'text';
  };

  const renderPreview = () => {
    const htmlContent = files['index.html'] || '';
    const cssContent = files['styles.css'] || '';
    const jsContent = files['script.js'] || '';

    const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>${cssContent}</style>
</head>
<body>
    ${htmlContent.replace(/<(!DOCTYPE|html|head|body|title)[^>]*>/gi, '').replace(/<\/(html|head|body)>/gi, '')}
    <script>${jsContent}</script>
</body>
</html>
    `;

    return (
      <div className="w-full h-full bg-white rounded-lg border border-gray-200">
        <iframe
          srcDoc={previewHTML}
          className="w-full h-full rounded-lg"
          title="Project Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Project Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The project you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                {project.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {project.status === 'completed' ? 'Ready for use' : `Status: ${project.status}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{previewMode ? 'Code View' : 'Preview'}</span>
            </button>

            {project.status === 'completed' && (
              <>
                <button
                  onClick={handleImprove}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Improve</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        {previewMode ? (
          /* Preview Mode */
          <div className="h-[80vh]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Live Preview
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Preview of your generated website
              </p>
            </div>
            {renderPreview()}
          </div>
        ) : (
          /* Code View */
          <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
            {/* File Tabs */}
            <div className="lg:w-64">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Files
              </h2>
              <div className="space-y-2">
                {Object.keys(files).map((fileName) => {
                  const fileType = fileTypes[fileName];
                  const Icon = fileType ? fileType.icon : FileText;
                  const isActive = activeFile === fileName;

                  return (
                    <motion.button
                      key={fileName}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveFile(fileName)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{fileName}</p>
                        <p className="text-xs opacity-75">
                          {fileType ? fileType.label : 'File'}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Code Display */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {fileTypes[activeFile] &&
                      React.createElement(fileTypes[activeFile].icon, {
                        className: "w-5 h-5 text-primary-600"
                      })
                    }
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {activeFile}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCode(files[activeFile] || '')}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([files[activeFile] || ''], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = activeFile;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Download file"
                    >
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <SyntaxHighlighter
                    language={getLanguageFromFile(activeFile)}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      background: 'transparent',
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{ color: '#6b7280', fontSize: '12px' }}
                  >
                    {files[activeFile] || '// No content available'}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;