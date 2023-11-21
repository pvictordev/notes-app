import { useState, useEffect } from "react";
import Showdown from "showdown";
import ReactMde from "react-mde";

interface Note {
  id: string;
  body: string;
}

interface Props {
  currentNote: Note;
  updateNote: (value: string) => void;
}

export default function Editor({
  currentNote,
  updateNote,
}: Props): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [converter, setConverter] = useState<Showdown.Converter | null>(null);

  useEffect(() => {
    const converterInstance = new Showdown.Converter({
      tables: true,
      simplifiedAutoLink: true,
      strikethrough: true,
      tasklists: true,
    });
    setConverter(converterInstance);
  }, []);

  const generateMarkdownPreview = async (markdown: string) => {
    if (converter) {
      return converter.makeHtml(markdown);
    }
    return "";
  };

  return (
    <section className="pane editor">
      <ReactMde
        value={currentNote.body}
        onChange={updateNote}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={generateMarkdownPreview}
        minEditorHeight={80}
        heightUnits="vh"
      />
    </section>
  );
}
