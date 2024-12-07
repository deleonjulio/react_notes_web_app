import { POST, PUT, GET, DELETE } from "../utils/request"

export const createNote = () => POST('/note')

export const getNotes = () => GET('/getNotes')

export const updateNote = (data: {content: string, content_plain_text: string, noteId: string | null}) => PUT('/note', data)

export const deleteNote = (noteId: string | null) => DELETE(`/note/${noteId}`)

export const searchNote = (searchString: string) => GET(`/note?search_string=${searchString}`)

export const preloadNotes = (data: {date: Date}) => POST(`/preloadNotes`, data)

export const loadMoreNotes = (data: {position: string, date: Date}) => POST(`/loadMoreNotes`, data)