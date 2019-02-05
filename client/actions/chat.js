export const SET_NAME = 'SET_NAME';
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';


export const addChatMessage = (name, text) => ({
  type: ADD_CHAT_MESSAGE,
  name,
  text,
});

export const setName = name => ({
  type: SET_NAME,
  name,
});
