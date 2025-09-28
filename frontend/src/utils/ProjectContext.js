import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSocket } from './SocketContext';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// Project reducer for state management
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
        loading: false,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        currentProject: action.payload,
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
        currentProject: state.currentProject?.id === action.payload.id
          ? { ...state.currentProject, ...action.payload }
          : state.currentProject,
      };

    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };

    case 'SET_PROJECT_FILES':
      return {
        ...state,
        currentProject: state.currentProject
          ? { ...state.currentProject, files: action.payload }
          : null,
      };

    case 'UPDATE_PROJECT_FILE':
      const { fileName, content } = action.payload;
      return {
        ...state,
        currentProject: state.currentProject
          ? {
              ...state.currentProject,
              files: {
                ...state.currentProject.files,
                [fileName]: content,
              },
            }
          : null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_GENERATION_STATUS':
      return {
        ...state,
        generationStatus: action.payload,
      };

    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...action.payload,
        }],
      };

    case 'CLEAR_LOGS':
      return {
        ...state,
        logs: [],
      };

    default:
      return state;
  }
};

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  generationStatus: null,
  logs: [],
};

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { socket, connected } = useSocket();

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleProjectCreated = (data) => {
      dispatch({
        type: 'ADD_PROJECT',
        payload: {
          id: data.projectId,
          name: data.projectName,
          status: 'initializing',
          files: {},
          createdAt: new Date().toISOString(),
        },
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'info',
          message: `Project "${data.projectName}" created`,
          projectId: data.projectId,
        },
      });
    };

    const handleStatus = (data) => {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          id: data.projectId,
          status: data.status,
          statusMessage: data.message,
        },
      });

      dispatch({
        type: 'SET_GENERATION_STATUS',
        payload: data,
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'status',
          message: data.message,
          projectId: data.projectId,
          status: data.status,
        },
      });
    };

    const handleFileStart = (data) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'file-start',
          message: data.message,
          fileName: data.fileName,
          projectId: data.projectId,
        },
      });
    };

    const handleFileComplete = (data) => {
      dispatch({
        type: 'UPDATE_PROJECT_FILE',
        payload: {
          fileName: data.fileName,
          content: data.content,
        },
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'file-complete',
          message: data.message,
          fileName: data.fileName,
          projectId: data.projectId,
        },
      });
    };

    const handleFileError = (data) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'error',
          message: data.message,
          fileName: data.fileName,
          projectId: data.projectId,
          error: data.error,
        },
      });
    };

    const handleProjectComplete = (data) => {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          id: data.projectId,
          status: 'completed',
          files: data.files || [],
          completedAt: new Date().toISOString(),
        },
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'success',
          message: `Project "${data.projectName}" generation completed!`,
          projectId: data.projectId,
        },
      });
    };

    const handleProjectFiles = (data) => {
      dispatch({
        type: 'SET_PROJECT_FILES',
        payload: data.files,
      });
    };

    const handleImprovementStart = (data) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'improvement-start',
          message: data.message,
          iteration: data.iteration,
          total: data.total,
          projectId: data.projectId,
        },
      });
    };

    const handleImprovementComplete = (data) => {
      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'improvement-complete',
          message: data.message,
          iteration: data.iteration,
          total: data.total,
          projectId: data.projectId,
        },
      });
    };

    const handleFileImproveComplete = (data) => {
      dispatch({
        type: 'UPDATE_PROJECT_FILE',
        payload: {
          fileName: data.fileName,
          content: data.content,
        },
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'file-improve',
          message: data.message,
          fileName: data.fileName,
          iteration: data.iteration,
          projectId: data.projectId,
        },
      });
    };

    const handleError = (data) => {
      dispatch({
        type: 'SET_ERROR',
        payload: data.message || 'An error occurred',
      });

      dispatch({
        type: 'ADD_LOG',
        payload: {
          type: 'error',
          message: data.message,
          error: data.error,
          projectId: data.projectId,
        },
      });
    };

    // Register event listeners
    socket.on('project-created', handleProjectCreated);
    socket.on('status', handleStatus);
    socket.on('file-start', handleFileStart);
    socket.on('file-complete', handleFileComplete);
    socket.on('file-error', handleFileError);
    socket.on('project-complete', handleProjectComplete);
    socket.on('project-files', handleProjectFiles);
    socket.on('improvement-start', handleImprovementStart);
    socket.on('improvement-complete', handleImprovementComplete);
    socket.on('file-improve-complete', handleFileImproveComplete);
    socket.on('error', handleError);

    // Cleanup listeners
    return () => {
      socket.off('project-created', handleProjectCreated);
      socket.off('status', handleStatus);
      socket.off('file-start', handleFileStart);
      socket.off('file-complete', handleFileComplete);
      socket.off('file-error', handleFileError);
      socket.off('project-complete', handleProjectComplete);
      socket.off('project-files', handleProjectFiles);
      socket.off('improvement-start', handleImprovementStart);
      socket.off('improvement-complete', handleImprovementComplete);
      socket.off('file-improve-complete', handleFileImproveComplete);
      socket.off('error', handleError);
    };
  }, [socket]);

  // Action creators
  const createProject = (projectData) => {
    if (!connected) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Not connected to server',
      });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    socket.emit('create-project', projectData);
  };

  const improveProject = (projectId, iterations = 1) => {
    if (!connected) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Not connected to server',
      });
      return;
    }

    socket.emit('improve-project', { projectId, iterations });
  };

  const getProjectFiles = (projectId) => {
    if (!connected) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Not connected to server',
      });
      return;
    }

    socket.emit('get-project-files', { projectId });
  };

  const setCurrentProject = (project) => {
    dispatch({
      type: 'SET_CURRENT_PROJECT',
      payload: project,
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearLogs = () => {
    dispatch({ type: 'CLEAR_LOGS' });
  };

  const addLog = (logData) => {
    dispatch({
      type: 'ADD_LOG',
      payload: logData,
    });
  };

  const value = {
    ...state,
    createProject,
    improveProject,
    getProjectFiles,
    setCurrentProject,
    clearError,
    clearLogs,
    addLog,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};