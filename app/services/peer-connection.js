import React, { createContext, useContext, useReducer } from "react";
import { getRemoteStream, sendLocalStream } from "./streams";
import { RTCPeerConnection } from './web-rtc';

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const PeerConnection = createContext({
  connection: null,
  peer: null,

  localStream: null,
  remoteStream: null,

  setLocalStream: () => { },
  setRemoteStream: () => { },
  setPeer: () => { },
  closeConnection: () => { },
});

const connectionActions = {
  SET_LOCAL_STREAM: 'set-local-stream',
  SET_REMOTE_STREAM: 'set-remote-stream',
  SET_PEER: 'set-peer',
  CLOSE_CONNECTION: 'close-connection',
};

const reductions = {
  [connectionActions.SET_LOCAL_STREAM]: (state, action) => ({
    ...state,
    localStream: action.payload,
  }),
  [connectionActions.SET_PEER]: (state, action) => ({
    ...state,
    peer: action.payload,
  }),
  [connectionActions.CLOSE_CONNECTION]: (state, action) => {
    connection.close();
    return {
      ...state,
      connection: null,
    };
  },
  [connectionActions.SET_REMOTE_STREAM]: (state, action) => {
    if (!state || state.remoteStream) return state;

    return {
      ...state,
      remoteStream: action.payload
    };
  },
  default: (state, action) => {
    console.log('Invalid Action dispatched', JSON.stringify(action, null, 2));
    return state;
  }
};

const connectionReducer = (state, action) => {
  return reductions[action.type] ? reductions[action.type](state, action) : reductions.default(state, action);
};

export const ConnectionProvider = ({ children }) => {
  const [peerConnection, dispatch] = useReducer(connectionReducer);

  const setLocalStream = (stream) => dispatch({
    type: connectionActions.SET_LOCAL_STREAM,
    payload: stream,
  });

  const setRemoteStream = (stream) => dispatch({
    type: connectionActions.SET_REMOTE_STREAM,
    payload: stream,
  });

  const setPeer = (peer) => dispatch({
    type: connectionActions.SET_PEER,
    payload: peer,
  });

  const closeConnection = (peer) => dispatch({
    type: connectionActions.SET_PEER,
    payload: peer,
  });

  return (
    <PeerConnection.Provider value={{
      ...peerConnection,
      connection: new RTCPeerConnection(servers),
      setLocalStream,
      setPeer,
      setRemoteStream,
      closeConnection,
    }}>
      {children}
    </PeerConnection.Provider>
  );
};

export const usePeerConnection = () => useContext(PeerConnection);
