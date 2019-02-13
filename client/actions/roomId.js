
export const SET_ROOM_ID = 'SET_ROOM_ID';
export const RESET_ROOM_ID = 'RESET_ROOM_ID';


export const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  roomId
});

export const resetRoomId = () => ({
  type: RESET_ROOM_ID,
});