import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CallActions } from '../components/call-actions';
import { LocalStream } from '../components/local-stream';
import { RemoteStream } from '../components/remote-stream';

const CallScreen = () => {
  
  return (
    <View style={StyleSheet.absoluteFill}>
      <LocalStream />
      <RemoteStream />
      <CallActions />
    </View>
  );
};

export default CallScreen;
