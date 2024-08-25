import React, { useReducer, useContext, createContext, type ReactNode } from 'react';

export interface Note {
  id: number;
  date_updated: Date;
  content: string;
}

export interface Notes {
  top_note: number | null
  list: Note[];
  selected: number | null;
  is_searching: boolean;
  search_string: string;
  searched_list: Note[];
  searched_selected: number | null;
  latest_note: number | null;
  oldest_note: number | null;
}

type NotesAction =
  | { type: 'CREATE'; list: Note[]; selected: number | null }
  | { type: 'UPDATE'; updatedNote: Note; }
  | { type: 'DELETE'; }
  | { type: 'DELETE_SEARCH'; }
  | { type: 'LIST'; list: Note[]; }
  | { type: 'SEARCHED_LIST'; searched_list: Note[]; }
  | { type: 'SELECT'; selected: number | null }
  | { type: 'SEARCHED_SELECT'; searched_selected: number | null }
  | { type: 'RESET'; }
  | { type: 'RESET_SEARCH'; }
  | { type: 'SEARCH'; search_string: string }
  | { type: 'UPDATE_TOP_NOTE'; id: number }
  | { type: 'UPDATE_LATEST_NOTE'; id: number }
  | { type: 'UPDATE_OLDEST_NOTE'; id: number }


const initialNotes: Notes = {
  top_note: null,
  list: [],
  selected: null,
  is_searching: false,
  search_string: '',
  searched_list: [],
  searched_selected: null,
  latest_note: null,
  oldest_note: null
};

// Create context with appropriate types
const NotesContext = createContext<Notes | undefined>(undefined);
const NotesDispatchContext = createContext<React.Dispatch<NotesAction> | undefined>(undefined);

// NotesProvider component with typed props
export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, dispatch] = useReducer(notesReducer, initialNotes);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const useNotesDispatch = () => {
  const context = useContext(NotesDispatchContext);
  if (context === undefined) {
    throw new Error('useNotesDispatch must be used within a NotesProvider');
  }
  return context;
};

const notesReducer = (state: Notes, action: NotesAction): Notes => {
  switch (action.type) {
    case 'CREATE':
      return {
        ...state,
        list: [...action.list],
        selected: action.selected,
      };
    case 'UPDATE': {
      const updatedNotes = state.list.filter(note => note.id !== action.updatedNote?.id)
      return {
        ...state,
        list: [action.updatedNote, ...updatedNotes],
      };
    }
    case 'DELETE': {
      const updatedNotes = state.list.filter(note => note.id !== state.selected)
      return {
        ...state,
        list: [...updatedNotes],
        selected: null
      };
    }
    case 'DELETE_SEARCH': {
      const updatedNotes = state.searched_list.filter(note => note.id !== state.searched_selected)
      return {
        ...state,
        searched_list: [...updatedNotes],
        searched_selected: null
      };
    }
    case 'LIST':
      return {
        ...state,
        list: [...action.list],
      };
    case 'SEARCHED_LIST':
      return {
        ...state,
        searched_list: [...action.searched_list],
      };
    case 'SELECT':
      return {
        ...state,
        selected: action.selected
      };
    case 'SEARCHED_SELECT':
      return {
        ...state,
        searched_selected: action.searched_selected
      };
    case 'SEARCH': {
      return {
        ...state,
        search_string: action.search_string,
        is_searching: action.search_string.length > 0
      };
    }
    case 'UPDATE_TOP_NOTE':
      return {
        ...state,
        top_note: action.id,
      };
    case 'UPDATE_LATEST_NOTE':
      return {
        ...state,
        latest_note: action.id,
      };
    case 'UPDATE_OLDEST_NOTE':
      return {
        ...state,
        oldest_note: action.id,
      };
    case 'RESET':
      return initialNotes;
    case 'RESET_SEARCH':
      return {
        ...state,
        searched_list: [],
        searched_selected: null
      };
    default:
      return state;
  }
};
