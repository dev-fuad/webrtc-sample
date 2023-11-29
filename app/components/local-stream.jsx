import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";
import { usePeerConnection } from "../services/peer-connection";
import { getLocalStream } from "../services/streams";

export const LocalStream = () => {
  const {
    localStream,
    setLocalStream,
  } = usePeerConnection();

  useEffect(() => {
    async function setLocalMediaStream() {
      const localStream = await getLocalStream({});
      setLocalStream(localStream);
    }
    setLocalMediaStream();

    return () => {
      localStream?.getTracks().forEach(
        track => track.stop()
      );
      setLocalStream(null);
    };
  }, []);

  return (
    <RTCView
      style={StyleSheet.absoluteFill}
      mirror={true}
      objectFit={'cover'}
      streamURL={localStream?.toURL()}
      zOrder={0}
    />
  );
};