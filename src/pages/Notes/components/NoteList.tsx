import { useMemo, LegacyRef } from "react"
import dayjs from "dayjs";
import { generateJSONHelper, generateTextHelper, truncateString } from "../../../utils/helper"
import { Notes } from "../../../providers/NotesProvider";

interface Props { 
  notes: Notes; 
  itemRef: LegacyRef<HTMLDivElement>;
  handleChange: (id: number) => void;
}

export default function NoteList ({ notes, itemRef, handleChange }: Readonly<Props>) {
  const noteItems = useMemo(() => {
    if(notes.is_searching) {
      return notes.searched_list.map((data) => (
        <button 
          key={data.id}
          onClick={() => handleChange(data.id)}
          className="w-full text-left"
        >
          <div
            ref={data.id === notes.searched_selected ? itemRef : null}
            className={`select-none px-4 py-2 border-b ${
              notes.searched_selected === data.id ? 'bg-amber-200' : 'cursor-pointer'
            }`}
          >
            <span className="text-xs font-bold">
              {truncateString(generateTextHelper(generateJSONHelper(data.content || ""))) || "Untitled"}
            </span>
            <div className="flex gap-x-4">
              <span className="text-xs">{dayjs(data.date_updated).format('MM/DD/YYYY')}</span>
            </div>
          </div>
        </button>
      ));
    }
    
    return notes.list.map((data) => (
      <button 
        key={data.id}
        onClick={() => handleChange(data.id)}
        className="w-full text-left"
      >
        <div
          ref={data.id === notes.selected ? itemRef : null}
          key={data.id}
          className={`select-none px-4 py-2 border-b ${
            notes.selected === data.id ? 'bg-amber-200' : 'cursor-pointer'
          }`}
        >
          <span className="text-xs font-bold">
            {truncateString(generateTextHelper(generateJSONHelper(data.content || ""))) || "Untitled"}
          </span>
          <div className="flex gap-x-4">
            <span className="text-xs">{dayjs(data.date_updated).format('MM/DD/YYYY')}</span>
          </div>
        </div>
      </button>
    ));
  }, [notes]);

  return <ul>{noteItems}</ul>;
}