// web-rtc side of calling

import { RTCSessionDescription, RTCIceCandidate } from "./web-rtc";

export const listenForCandidates = (connection, callback) => {
  connection.addEventListener('icecandidate', ({ candidate }) => {
    candidate && callback(candidate.toJSON());
  });
};

export const saveCandidate = (connection, candidate) => {
  const iceCandidate = new RTCIceCandidate(candidate);
  connection.addIceCandidate(iceCandidate);
};

// Caller helpers

export const createOffer = async (connection) => {
  const offerDescription = await connection.createOffer();
  await connection.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  return offer;
};

export const saveAnswer = (connection, answer) => {
  if (!connection.currentRemoteDescription) {
    const answerDescription = new RTCSessionDescription(answer);
    connection.setRemoteDescription(answerDescription);
  }
};

// Callee helpers

export const createAnswer = async (connection, callData) => {
  const offerDescription = new RTCSessionDescription(callData.offer);
  await connection.setRemoteDescription(offerDescription);

  const answerDescription = await connection.createAnswer();
  await connection.setLocalDescription(answerDescription);

  const answer = {
    sdp: answerDescription.sdp,
    type: answerDescription.type,
  };

  return answer;
};
