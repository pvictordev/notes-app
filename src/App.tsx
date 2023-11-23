import { useEffect, useState } from "react";
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
  createdAt: number;
  updatedAt: number;
}

export default function App(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [curNoteId, setCurNoteId] = useState<string>("");

  const currentNote = notes.find((note) => note.id === curNoteId) || notes[0];

  const sortedNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
      const notesArr: Note[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Note),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!curNoteId && notes.length > 0) {
      setCurNoteId(notes[0].id);
    }
  }, [notes, curNoteId]);

  //refactored for firebase
  async function createNewNote() {
    const newNote: Note = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: nanoid(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurNoteId(newNoteRef.id);
  }

  //refactored for firebase
  async function updateNote(text: string) {
    const docRef = doc(db, "notes", curNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  //refactored for firebase
  async function deleteNote(noteId: string) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurNoteId={setCurNoteId}
            newNote={createNewNote}
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
