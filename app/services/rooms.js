// firebase side of calling

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { createAnswer, createOffer, listenForCandidates, saveAnswer, saveCandidate } from "./call";
import { db } from "./firebase";
import { getRemoteStream, sendLocalStream } from "./streams";

export const createRoom = async (connection, setRoomId, localStream, setRemoteStream) => {
  const room = doc(collection(db, "rooms"));

  setRoomId?.(room.id);

  const offerCandidates = collection(room, 'offerCandidates');
  const answerCandidates = collection(room, 'answerCandidates');

  listenForCandidates(connection, (candidate) => addDoc(offerCandidates, candidate));

  sendLocalStream({ connection, localStream });
  getRemoteStream(connection, setRemoteStream);

  const offer = await createOffer(connection);

  await setDoc(room, { offer }, { merge: true });

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

export const joinRoom = async (connection, roomId, localStream, setRemoteStream) => {
  const room = doc(db, "rooms", roomId);

  const offerCandidates = collection(room, 'offerCandidates');
  const answerCandidates = collection(room, 'answerCandidates');

  listenForCandidates(connection, (candidate) => addDoc(answerCandidates, candidate));

  const roomSnapshot = await getDoc(room);
  if (!roomSnapshot.exists) return;

  sendLocalStream({ connection, localStream });
  getRemoteStream(connection, setRemoteStream);

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

export const deleteRoom = async (roomId) => {
  const room = doc(db, "rooms", roomId);

  await deleteDoc(room);
};
