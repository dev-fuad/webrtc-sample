import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";
import { usePeerConnection } from "../services/peer-connection";

export const RemoteStream = () => {
  const {
    remoteStream,
    initiateIO,
  } = usePeerConnection();

  useEffect(() => {
    initiateIO();
  }, []);

  return (
    <SafeAreaView>
      <RTCView
        style={styles.remoteView}
        mirror={true}
        objectFit={'cover'}
        streamURL={remoteStream?.toURL()}
        zOrder={0}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  remoteView: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: '10%',
    height: '10%',
    backgroundColor: 'black'
  },
});
