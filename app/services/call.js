// web-rtc side of calling

export const listenForCandidates = (connection, callback) => {
  connection.onicecandidate = ({ candidate }) => {
    candidate && callback(candidate.toJSON());
  };
};

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

export const saveAnsweringCandidate = (connection, answeringCandidate) => {
  const candidate = new RTCIceCandidate(answeringCandidate);
  connection.addIceCandidate(candidate);
};
