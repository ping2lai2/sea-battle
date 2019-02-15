
export const SET_ROOM_ID = 'SET_ROOM_ID';
export const RESET_ROOM_ID = 'RESET_ROOM_ID';
export const SET_PLAYER_TYPE ='SET_PLAYER_TYPE';
export const SET_SPECTATOR_TYPE = 'SET_SPECTATOR_TYPE';

export const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  roomId
});

export const resetRoomId = () => ({
  type: RESET_ROOM_ID,
});

export const setPlayerType = () => ({
  type: SET_PLAYER_TYPE,
});

export const setSpectatorType = () => ({
  type: SET_SPECTATOR_TYPE,
});
