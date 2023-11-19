import React, { useEffect, useState } from "react";
import Editor from "./components/Editor";
import Sidebar from "./components/Sidebar";
import Split from "react-split";
import { nanoid } from "nanoid";

// React MDE style
import "react-mde/lib/styles/css/react-mde-all.css";

interface Note {
  id: string;
  body: string;
}

export default function App(): JSX.Element {
  // const [notes, setNotes] = useState<Note[]>(
  //   () => JSON.parse(localStorage.getItem("notes")) || []
  // );
  const [notes, setNotes] = useState<Note[]>(() =>
    JSON.parse(localStorage.getItem("notes") || "[]")
  );

  const [curNoteId, setCurNoteId] = useState<string>(
    (notes[0] && notes[0].id) || ""
  );

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const updateNote = (text: string) => {
    setNotes((oldNotes) => {
      const updatedArr = oldNotes.map((oldNote) =>
        oldNote.id === curNoteId ? { ...oldNote, body: text } : oldNote
      );
      return updatedArr;
    });
  };

  const deleteNote = (
    event: React.MouseEvent<HTMLButtonElement>,
    noteId: string
  ) => {
    event.stopPropagation();
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: nanoid(),
      body: "# Type your markdown note title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurNoteId(newNote.id);
  };

  const findCurrentNote = (): Note => {
    return (
      notes.find((note) => note.id === curNoteId) ||
      notes[0] || { id: "", body: "" }
    );
  };

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[25, 75]} direction="horizontal" className="split">
          <Sidebar
            newNote={createNewNote}
            currentNote={findCurrentNote()}
            setCurNoteId={setCurNoteId}
            notes={notes}
            deleteNote={deleteNote}
          />

          {curNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
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
