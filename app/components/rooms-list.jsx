import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { usePeerConnection } from "../services/peer-connection";
import { getRooms, joinRoom } from "../services/rooms";

export const RoomsList = () => {
  const { connection } = usePeerConnection();
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
      renderItem={({ item }) => (
        <Pressable onPress={() => joinRoom(connection, item)}>
          <Text style={styles.item}>{item}</Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 5,
    padding: 5,
  },
});
