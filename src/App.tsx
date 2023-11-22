import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import Split from "react-split";
import { nanoid } from "nanoid";
import { addDoc, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

// React MDE style
import "react-mde/lib/styles/css/react-mde-all.css";

interface Note {
  id: string;
  body: string;
}

export default function App(): JSX.Element {
  //removed because i will no longer save data on localStorage
  const [notes, setNotes] = useState<Note[]>([]);

  //is still working but replaced with the optional chaining operator bellow
  // const [curNoteId, setCurNoteId] = useState<string | undefined>(notes[0]?.id);
  const [curNoteId, setCurNoteId] = useState<string>("");

  //removed because i will no longer save data on localStorage
  useEffect(() => {
    //created websocket connection to firebase
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      setCurNoteId(notes[0].id);
    }
  }, [notes]);

  //refactored for firebase
  const updateNote = async (text: string) => {
    const docRef = doc(db, "notes", curNoteId);
    await setDoc(docRef, { body: text, updateAt: Date.now() }, { merge: true });
  };

  //refactored for firebase
  const deleteNote = async (noteId: string) => {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  };

  //refactored for firebase
  async function createNewNote() {
    const newNote: Note = {
      body: "# Type your markdown note title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);

    setCurNoteId(newNoteRef.id);
  }

  //replaced for performance with the line bellow
  const currentNote = notes.find((note) => note.id === curNoteId) || notes[0];

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[25, 75]} direction="horizontal" className="split">
          <Sidebar
            newNote={createNewNote}
            currentNote={currentNote}
            setCurNoteId={setCurNoteId}
            notes={notes}
            deleteNote={deleteNote}
          />

          <Editor currentNote={currentNote} updateNote={updateNote} />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
