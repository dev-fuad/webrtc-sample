import { useEffect, useState } from "react";
import { RTCView } from "react-native-webrtc";
import { getLocalStream } from "../services/web-rtc";
import { StyleSheet } from "react-native";

export const LocalStream = () => {
  const [localMediaStream, setLocalMediaStream] = useState();

  useEffect(() => {
    async function setLocalStream() {
      const localStream = await getLocalStream({});
      setLocalMediaStream(localStream);
    }
    setLocalStream();

    return () => {
      localMediaStream?.getTracks().forEach(
        track => track.stop()
      );
      setLocalMediaStream(null);
    };
  }, []);

  return (
    <RTCView
      style={StyleSheet.absoluteFill}
      mirror={true}
      objectFit={'cover'}
      streamURL={localMediaStream?.toURL()}
      zOrder={0}
    />
  );
};