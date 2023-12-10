import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { usePeerConnection } from "../services/peer-connection";
import { getRooms, joinRoom } from "../services/rooms";

const RoomListItem = ({ room, setRoomId }) => {
  const { connection, localStream, setRemoteStream } = usePeerConnection();
  const onPress = () => {
    joinRoom(connection, room, localStream, setRemoteStream);
    setRoomId(room);
  };
  return (
    <Pressable onPress={onPress}>
      <Text style={styles.item}>{room}</Text>
    </Pressable>
  );
};

export const RoomsList = ({ setRoomId }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    (async function () {
      const _rooms = await getRooms();
      setRooms(_rooms);
    })();
  }, []);

  return (
    <FlatList
      data={rooms}
      keyExtractor={(room) => room}
      renderItem={({ item }) => <RoomListItem room={item} setRoomId={setRoomId} />}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 5,
    padding: 5,
  },
});
