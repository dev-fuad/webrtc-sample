import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { RTCView } from "../services/web-rtc";
import { usePeerConnection } from "../services/peer-connection";

export const RemoteStream = () => {
  const {
    remoteStream,
    initiateIO,
  } = usePeerConnection();

  useEffect(() => {
    initiateIO();
  }, []);

  const options = Platform.select({
    native: () => ({ streamURL: remoteStream?.toURL() }),
    web: () => ({ stream: remoteStream }),
  });

  return (
    <SafeAreaView>
      <RTCView
        style={styles.remoteView}
        mirror={true}
        objectFit={'cover'}
        zOrder={0}
        {...options()}
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
