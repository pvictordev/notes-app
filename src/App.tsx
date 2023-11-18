import React, { useState } from "react";
import "./App.css";

interface Note {
  id: number;
  title: string;
  content: string;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = () => {
    const newNote: Note = {
      id: notes.length + 1,
      title: "New Note",
      content: "Write your content here",
    };
    setNotes([...notes, newNote]);
  };

  return (
    <div className="app">
      <button onClick={addNote}>Add Note</button>
      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
