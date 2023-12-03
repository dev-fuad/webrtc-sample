// firebase side of calling

import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { createAnswer, createOffer, listenForCandidates, saveAnswer } from "./call";
import { db } from "./firebase";

export const createRoom = async (connection, setRoomId) => {
  const room = doc(collection(db, "rooms"));

  setRoomId?.(room.id);

  const offerCandidates = collection(room, 'offerCandidates');
  const answerCandidates = collection(room, 'answerCandidates');

  listenForCandidates(connection, (candidate) => addDoc(offerCandidates, candidate));

  const offer = await createOffer(connection);

  await setDoc(room, { offer });

  // listen for answer
  onSnapshot(room, (snapshot) => {
    const data = snapshot.data();
    if (data?.answer) {
      saveAnswer(connection, data.answer);
    }
  });

  // add candidate when answered
  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        saveCandidate(connection, change.doc.data());
      }
    });
  });
};

export const getRooms = async () => {
  const roomsSnapshot = await getDocs(collection(db, "rooms"));

  const rooms = [];
  roomsSnapshot.forEach((doc) => rooms.push(doc.id));
  return rooms;
};

export const joinRoom = async (connection, roomId) => {
  const room = doc(db, "rooms", roomId);

  const offerCandidates = collection(room, 'offerCandidates');
  const answerCandidates = collection(room, 'answerCandidates');

  listenForCandidates(connection, (candidate) => addDoc(answerCandidates, candidate));

  const roomSnapshot = await getDoc(room);
  if (!roomSnapshot.exists) return;
  const answer = await createAnswer(connection, roomSnapshot.data());
  await updateDoc(room, { answer });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        saveCandidate(connection, change.doc.data());
      }
    });
  });
};
