import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

    const socketInstance = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Connected to server');
      setConnected(true);
      setReconnectAttempts(0);
      toast.success('Connected to AI Code Generator!');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setConnected(false);

      if (reason === 'io server disconnect') {
        // Server initiated disconnect
        toast.error('Server disconnected. Please refresh the page.');
      } else {
        // Client initiated disconnect or network issue
        toast.error('Connection lost. Attempting to reconnect...');
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setReconnectAttempts(prev => prev + 1);

      if (reconnectAttempts >= 3) {
        toast.error('Unable to connect to server. Please check your connection.');
      }
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`);
      toast.success('Reconnected to server!');
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to server');
      toast.error('Failed to reconnect. Please refresh the page.');
    });

    // Global error handler
    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [reconnectAttempts]);

  // Socket event listeners for project events
  useEffect(() => {
    if (!socket) return;

    const handleProjectCreated = (data) => {
      console.log('Project created:', data);
      toast.success(`Project "${data.projectName}" created!`);
    };

    const handleProjectComplete = (data) => {
      console.log('Project completed:', data);
      toast.success(`Project "${data.projectName}" generation completed!`);
    };

    const handleFileComplete = (data) => {
      console.log('File generated:', data);
      toast.success(data.message);
    };

    const handleFileError = (data) => {
      console.error('File generation error:', data);
      toast.error(data.message);
    };

    const handleStatus = (data) => {
      console.log('Status update:', data);
      // Only show important status updates
      if (data.status === 'completed') {
        toast.success(data.message);
      } else if (data.status === 'error') {
        toast.error(data.message);
      }
    };

    const handleImprovementComplete = (data) => {
      console.log('Improvement completed:', data);
      toast.success(`Improvement iteration ${data.iteration}/${data.total} completed`);
    };

    // Register event listeners
    socket.on('project-created', handleProjectCreated);
    socket.on('project-complete', handleProjectComplete);
    socket.on('file-complete', handleFileComplete);
    socket.on('file-error', handleFileError);
    socket.on('status', handleStatus);
    socket.on('improvement-complete', handleImprovementComplete);

    // Cleanup listeners
    return () => {
      socket.off('project-created', handleProjectCreated);
      socket.off('project-complete', handleProjectComplete);
      socket.off('file-complete', handleFileComplete);
      socket.off('file-error', handleFileError);
      socket.off('status', handleStatus);
      socket.off('improvement-complete', handleImprovementComplete);
    };
  }, [socket]);

  // Helper functions
  const createProject = (projectData) => {
    if (!socket || !connected) {
      toast.error('Not connected to server');
      return;
    }

    socket.emit('create-project', projectData);
  };

  const improveProject = (projectId, iterations = 1) => {
    if (!socket || !connected) {
      toast.error('Not connected to server');
      return;
    }

    socket.emit('improve-project', { projectId, iterations });
  };

  const getProjectFiles = (projectId) => {
    if (!socket || !connected) {
      toast.error('Not connected to server');
      return;
    }

    socket.emit('get-project-files', { projectId });
  };

  const value = {
    socket,
    connected,
    reconnectAttempts,
    createProject,
    improveProject,
    getProjectFiles,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};