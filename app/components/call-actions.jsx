import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { usePeerConnection } from '../services/peer-connection';
import { createRoom } from '../services/rooms';

export const CallActions = () => {
  const [roomId, setRoomId] = useState();
  const { connection } = usePeerConnection();

  const makeCall = () => {
    createRoom(connection, setRoomId);
  };

  // TODO: add a way to invite other
  // like send a link to join call
  const invite = () => { };

  return (
    <SafeAreaView style={styles.actionBar}>
      <Pressable style={styles.button} onPress={makeCall}>
        <Icon name="call-outline" size={32} />
      </Pressable>

      {roomId && (
        <Pressable style={styles.button} onPress={invite}>
          <Icon name="person-add-sharp" size={32} />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#FFF5',

    width: '100%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    borderWidth: 2,
    borderRadius: 25,
    aspectRatio: 1,
    padding: 5,
    margin: 10,
  },
});
