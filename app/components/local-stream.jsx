import { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { RTCView } from "../services/web-rtc";
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

  const options = Platform.select({
    native: () => ({ streamURL: localStream?.toURL() }),
    web: () => ({ stream: localStream }),
  });

  return (
    <RTCView
      style={StyleSheet.absoluteFill}
      mirror={true}
      objectFit={'cover'}
      zOrder={0}
      {...options()}
    />
  );
};