import React, { useReducer, useContext, createContext, type ReactNode } from 'react';

export interface Note {
  _id: string;
  date_updated: Date;
  content: string;
}

export interface Notes {
  top_note: string | null
  list: Note[];
  selected: string | null;
  is_searching: boolean;
  search_string: string;
  searched_list: Note[];
  searched_selected: string | null;
  latest_note: string | null;
  oldest_note: string | null;
}

type NotesAction =
  | { type: 'CREATE'; list: Note[]; selected: string | null }
  | { type: 'UPDATE'; updatedNote: Note; }
  | { type: 'DELETE'; }
  | { type: 'DELETE_SEARCH'; }
  | { type: 'LIST'; list: Note[]; }
  | { type: 'SEARCHED_LIST'; searched_list: Note[]; }
  | { type: 'SELECT'; selected: string | null }
  | { type: 'SEARCHED_SELECT'; searched_selected: string | null }
  | { type: 'RESET'; }
  | { type: 'RESET_SEARCH'; }
  | { type: 'SEARCH'; search_string: string }
  | { type: 'UPDATE_TOP_NOTE'; _id: string }
  | { type: 'UPDATE_LATEST_NOTE'; _id: string }
  | { type: 'UPDATE_OLDEST_NOTE'; _id: string }


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

const NotesContext = createContext<Notes | undefined>(undefined);
const NotesDispatchContext = createContext<React.Dispatch<NotesAction> | undefined>(undefined);

interface NotesProviderProps {
  readonly children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
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
      const updatedNotes = state.list.filter(note => note._id !== action.updatedNote?._id)
      return {
        ...state,
        list: [action.updatedNote, ...updatedNotes],
      };
    }
    case 'DELETE': {
      const updatedNotes = state.list.filter(note => note._id !== state.selected)
      return {
        ...state,
        list: [...updatedNotes],
        selected: null
      };
    }
    case 'DELETE_SEARCH': {
      const updatedNotes = state.searched_list.filter(note => note._id !== state.searched_selected)
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
      // unselect note if user search again and the current selected searched note is not included from the list
      let currentSelectedExist = false
      if(action.searched_list.find((list) => list._id === state.searched_selected)) {
        currentSelectedExist = true
      }
      return {
        ...state,
        searched_list: [...action.searched_list],
        searched_selected: currentSelectedExist ? state.searched_selected : null,
        selected: currentSelectedExist ? state.searched_selected : null
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
        top_note: action._id,
      };
    case 'UPDATE_LATEST_NOTE':
      return {
        ...state,
        latest_note: action._id,
      };
    case 'UPDATE_OLDEST_NOTE':
      return {
        ...state,
        oldest_note: action._id,
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
