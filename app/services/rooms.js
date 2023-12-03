// firebase side of calling

import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { createOffer, listenForCandidates, saveAnswer, saveAnsweringCandidate } from "./call";
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
        saveAnsweringCandidate(connection, change.doc.data());
      }
    });
  });
};
