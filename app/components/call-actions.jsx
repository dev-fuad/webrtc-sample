import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { usePeerConnection } from '../services/peer-connection';
import { createRoom, deleteRoom } from '../services/rooms';
import { RoomsList } from './rooms-list';
import { stopSendingStream } from '../services/streams';

export const CallActions = () => {
  const [roomId, setRoomId] = useState();
  const [isJoinee, setIsJoinee] = useState(false);

  const { connection, localStream, setLocalStream, setRemoteStream, closeConnection } = usePeerConnection();

  const makeCall = () => {
    createRoom(connection, setRoomId, localStream, setRemoteStream);
  };

  const join = () => setIsJoinee(true);

  // TODO: add a way to invite other
  // like send a link to join call
  const invite = () => { };

  const endCall = async () => {
    stopSendingStream(connection, closeConnection);

    await deleteRoom(roomId);

    setLocalStream();
    setRemoteStream();
  };

  if (isJoinee && !roomId) {
    return (
      <SafeAreaView style={styles.actionBar}>
        <RoomsList setRoomId={setRoomId} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.actionBar}>
      {!roomId && (
        <>
          <Pressable style={styles.button} onPress={makeCall}>
            <Icon name="call-outline" size={32} />
          </Pressable>
          <Pressable style={styles.button} onPress={join}>
            <Icon name="list-outline" size={32} />
          </Pressable>
        </>
      )}

      {roomId && (
        <>
          <Pressable style={styles.button} onPress={invite}>
            <Icon name="person-add-outline" size={32} />
          </Pressable>
          <Pressable style={styles.button} onPress={endCall}>
            <Icon name="call" size={32} color="red" />
          </Pressable>
        </>
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
