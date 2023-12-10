import { SafeAreaView, StyleSheet } from "react-native";
import { usePeerConnection } from "../services/peer-connection";
import { RTCView } from "../services/web-rtc";

export const RemoteStream = () => {
  const { remoteStream } = usePeerConnection();

  const options = Platform.select({
    native: () => ({ streamURL: remoteStream?.toURL() }),
    web: () => ({ stream: remoteStream }),
  });

  if (!remoteStream) return null;
  
  return (
    <RTCView
      style={styles.remoteView}
      mirror={true}
      objectFit={'cover'}
      zOrder={1}
      {...options()}
    />
  );
};

const styles = StyleSheet.create({
  remoteView: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: '30%',
    aspectRatio: 9 / 16,
    backgroundColor: 'black'
  },
});
