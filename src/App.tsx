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
  // const [notes, setNotes] = useState<Note[]>(() =>
  //   JSON.parse(localStorage.getItem("notes") || "[]")
  // );
  const [notes, setNotes] = useState<Note[]>([]);

  //is still working but replaced with the optional chaining operator bellow
  // const [curNoteId, setCurNoteId] = useState<string>(
  //   (notes[0] && notes[0].id) || ""
  // );
  // const [curNoteId, setCurNoteId] = useState<string | undefined>(notes[0]?.id);
  const [curNoteId, setCurNoteId] = useState<string>("");

  //removed because i will no longer save data on localStorage
  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes));
  // }, [notes]);

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
  // const updateNote = (text: string) => {
  //   //doest not put updated note at the top of the list
  //   // setNotes((oldNotes) => {
  //   //   const updatedArr = oldNotes.map((oldNote) =>
  //   //     oldNote.id === curNoteId ? { ...oldNote, body: text } : oldNote
  //   //   );
  //   //   return updatedArr;
  //   // });

  //   //puts updated note at the top of the list
  //   // setNotes((oldNotes) => {
  //   //   const newArray = [];
  //   //   for (let i = 0; i < oldNotes.length; i++) {
  //   //     const oldNote = oldNotes[i];
  //   //     if (oldNote.id === curNoteId) {
  //   //       newArray.unshift({ ...oldNote, body: text });
  //   //     } else {
  //   //       newArray.push(oldNote);
  //   //     }
  //   //   }
  //   //   return newArray;
  //   // });

  //   // puts updated note at the top of the list (modified)
  //   setNotes((oldNotes) => {
  //     const updatedNoteIndex = oldNotes.findIndex(
  //       (note) => note.id === curNoteId
  //     );
  //     if (updatedNoteIndex === -1) {
  //       return oldNotes;
  //     }

  //     const updatedNote = { ...oldNotes[updatedNoteIndex], body: text };
  //     const updatedNotes = [
  //       updatedNote,
  //       ...oldNotes.slice(0, updatedNoteIndex),
  //       ...oldNotes.slice(updatedNoteIndex + 1),
  //     ];

  //     return updatedNotes;
  //   });
  // };
  const updateNote = async (text: string) => {
    const docRef = doc(db, "notes", curNoteId);
    await setDoc(docRef, { body: text, updateAt: Date.now() }, { merge: true });
  };

  //refactored for firebase
  // const deleteNote = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   noteId: string
  // ) => {
  //   event.stopPropagation();
  //   setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  // };
  const deleteNote = async (noteId: string) => {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  };

  //refactored for firebase
  // const createNewNote = () => {
  //   const newNote: Note = {
  //     id: nanoid(),
  //     body: "# Type your markdown note title here",
  //   };
  //   setNotes((prevNotes) => {
  //     if (!Array.isArray(prevNotes)) {
  //       console.error("Notes is not an array:", prevNotes);
  //       return [newNote];
  //     }
  //     return [newNote, ...prevNotes];
  //   });

  //   setCurNoteId(newNote.id);
  // };
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
  // const findCurrentNote = (): Note => {
  //   return (
  //     notes.find((note) => note.id === curNoteId) ||
  //     notes[0] || { id: "", body: "" }
  //   );
  // };
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
