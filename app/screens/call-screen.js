import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LocalStream } from '../components/local-stream';
import { RemoteStream } from '../components/remote-stream';
import { usePeerConnection } from '../services/peer-connection';

const CallScreen = () => {
  const { peer } = usePeerConnection();

  return (
    <View style={StyleSheet.absoluteFill}>
      <LocalStream />
      {!!peer && <RemoteStream />}
    </View>
  );
};

export default CallScreen;
