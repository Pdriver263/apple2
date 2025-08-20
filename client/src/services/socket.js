let socket = null;

export const connectSocket = () => {
  // Use the same port as your API
  const port = process.env.REACT_APP_API_PORT || 5000;
  socket = new WebSocket(`ws://localhost:${port}/ws`);

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call connectSocket first.');
  }
  return socket;
};