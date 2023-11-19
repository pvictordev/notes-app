import { useState } from "react";
import { useMemo } from "react";

export default function ({
  newNote,
  notes,
  currentNote,
  setCurNoteId,
  deleteNote,
}) {
  const [numberOfItemShown, setNumberOfItemShown] = useState(7);

  const showMore = () => {
    if (numberOfItemShown <= notes.length) {
      setNumberOfItemShown(numberOfItemShown + 5);
    } else {
      setNumberOfItemShown(notes.length);
    }
  };

  const noteElements = useMemo(() =>
    notes.slice(0, numberOfItemShown).map((note, index) => (
      <div key={note.id}>
        <div
          className={`title ${
            note.id === currentNote.id ? "selected-note" : ""
          }`}
          onClick={() => setCurNoteId(note.id)}
        >
          <img src="" />
          <h4 className="text-snippet">{note.body.split("\n")[0]} </h4>

          <button
            className="delete-btn"
            onClick={(event) => deleteNote(event, note.id)}
          >
            <i className="gg-trash trash-icon"></i>
          </button>
        </div>
      </div>
    ))
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
