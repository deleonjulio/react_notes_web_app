import { POST, PUT, GET, DELETE } from "../utils/request"

export const createNote = () => POST('/note')

export const getNotes = () => GET('/getNotes')

export const updateNote = (data: {content: string, noteId: number | null}) => PUT('/note', data)

export const deleteNote = (noteId: number | null) => DELETE(`/note/${noteId}`)

export const searchNote = (searchString: string) => GET(`/note?search_string=${searchString}`)

export const preloadNotes = (data: {date: Date}) => POST(`/preloadNotes`, data)

export const loadMoreNotes = (data: {position: string, date: Date}) => POST(`/loadMoreNotes`, data)