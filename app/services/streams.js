import { MediaStream, mediaDevices } from "./web-rtc";

export const getMediaDevices = async () => {
  let cameraCount = 0;
  try {
    const devices = await mediaDevices.enumerateDevices();

    const videoDevices = devices
      .filter((device) => device.kind === 'videoinput')
      .reduce((acc, device) => ({
        ...acc,
        [device.facing === 'front' ? 'front' : 'back']: device
      }), {});

    return videoDevices;
  } catch (error) {
    console.log('ERROR => ', error);
  }
};

export const getLocalStream = async ({
  isFront = true,
  isCameraOn = true,
  isAudioOn = true,
  sourceId
}) => {
  const facingMode = isFront ? "user" : "environment";

  const constraints = {
    audio: isAudioOn,
    video: {
      mandatory: {
        minWidth: 500, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      },
      // facingMode,
      optional: sourceId ? [{ sourceId }] : [],
    },
  };

  try {
    const mediaStream = await mediaDevices.getUserMedia(constraints);

    if (!isCameraOn) {
      let videoTrack = await mediaStream.getVideoTracks()[0];
      videoTrack.enabled = false;
    };

    return mediaStream;
  } catch (error) {
    console.log('ERROR => ', error);
  };
};

export const sendLocalStream = ({ connection, localStream }) => {
  localStream.getTracks().forEach((track) => {
    connection.addTrack(track, localStream);
  });
};

export const getRemoteStream = (connection) => {
  const remoteStream = new MediaStream();

  connection.ontrack = ({ streams }) => {
    streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  return remoteStream;
};
