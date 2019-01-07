export const INIT = 'SOCKET_INITIALIZATION';
export const PUT = 'PUT_SOCKET';
export const CONNECTION_SUCCEEDED = 'SOCKET_CONNECTION_SUCCEEDED';
export const CONNECTION_FAILED = 'SOCKET_CONNECTION_ERROR';
export const DISCONNECTION = 'SOCKET_DISCONNECTION';
export const RECONNECTION_SUCCEEDED = 'SOCKET_RECONNECTION_SUCCEEDED';
export const RECONNECTION_FAILED = 'SOCKET_RECONNECTION_FAILED';

export const initSocket = () => {
  return {
    type: INIT,
  };
};

export const putSocket = socket => {
  return {
    type: PUT,
    payload: socket,
  };
};

export const connectionFailure = () => {
  return {
    type: CONNECTION_FAILED,
  };
};

export const connectionSuccess = () => {
  return {
    type: CONNECTION_SUCCEEDED,
  };
};

export const reconnectionSuccess = () => {
  return {
    type: RECONNECTION_SUCCEEDED,
  };
};

export const reconnectionFailure = () => {
  return {
    type: RECONNECTION_FAILED,
  };
};

export const disconnection = () => {
  return {
    type: DISCONNECTION,
  };
};
