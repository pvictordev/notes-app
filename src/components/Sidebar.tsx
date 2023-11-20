import React, { useState, useMemo } from "react";
import notesIcon from "../assets/notes-icon.png";

interface Note {
  id: string;
  body: string;
}

interface Props {
  newNote: () => void;
  notes: Note[];
  currentNote: Note;
  setCurNoteId: (id: string) => void;
  deleteNote: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default function Sidebar({
  newNote,
  notes,
  currentNote,
  setCurNoteId,
  deleteNote,
}: Props): JSX.Element {
  const [numberOfItemShown, setNumberOfItemShown] = useState<number>(7);

  const showMore = () => {
    if (numberOfItemShown <= notes.length) {
      setNumberOfItemShown(numberOfItemShown + 5);
    } else {
      setNumberOfItemShown(notes.length);
    }
  };

  const noteElements = useMemo(
    () =>
      notes.slice(0, numberOfItemShown).map((note) => (
        <div key={note.id}>
          <div
            className={`title ${
              note.id === currentNote.id ? "selected-note" : ""
            }`}
            onClick={() => setCurNoteId(note.id)}
          >
            <img style={{width:"20px", height:"20px"}} src={notesIcon} alt="" />
            <h4 className="text-snippet">{note.body.split("\n")[0]} </h4>
            <button
              className="delete-btn"
              onClick={(event) => deleteNote(event, note.id)}
            >
              <i className="gg-trash trash-icon"></i>
            </button>
          </div>
        </div>
      )),
    [currentNote.id, deleteNote, notes, numberOfItemShown, setCurNoteId]
  );

  return (
    <aside className="sidebar pane">
      <div>
        <div className="sidebar__header">
          <button className="sidebar__new-note" onClick={newNote}>
            + New Note
          </button>
        </div>
        {noteElements.length ? noteElements : "loading..."}
        <button className="show-more" onClick={showMore}>
          show more
        </button>
      </div>
    </aside>
  );
}
