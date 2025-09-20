import React, { useEffect, useRef } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Navigate, useLoaderData, useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import dayjs from "dayjs"
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import Underline from "@tiptap/extension-underline"
import StarterKit from '@tiptap/starter-kit';
import { useDebouncedCallback } from 'use-debounce';
import { PiNotePencilLight, PiTrashLight, PiSignOutLight } from "react-icons/pi"
import { Button, Head, Input } from "../../components"
import { logout } from "../../apis/authentication"
import useScrollStatusOnResize from "../../hooks/useScrollStatusOnResize"
import { useNotes, useNotesDispatch } from "../../providers/NotesProvider"
import { createNote, updateNote, getNotes, deleteNote, searchNote, preloadNotes, loadMoreNotes } from "../../apis/notes"
import EditorOptions from "./components/EditorOptions"
import LoadMoreIndicator from "./components/LoadMoreIndicator"
import NoteList from "./components/NoteList"

type UserAuthentication = {
  authenticated: boolean
  email: string
}

export const Notes = () => {
  const isScrollingEnabled = useScrollStatusOnResize();
  const user = useLoaderData() as UserAuthentication;
  const notes = useNotes()
  const notesDispatch = useNotesDispatch()
  const navigate = useNavigate()
  const itemRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null)
  const selectedNotes = notes.list.find((note) => note._id === notes.selected)
  const searchedSelectedNotes =  notes.searched_list.find((note) => note._id === notes.searched_selected)

  const scrollToTop = () => {
    setTimeout(() => {
      itemRef.current?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'nearest',
      });
    }, 10)
  }

  const { data, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    retry: false,
    enabled: user.authenticated,
    refetchOnWindowFocus: false
  })

  const { mutate: updateNoteMutate } = useMutation({
    mutationFn: updateNote,
    onSuccess: async (response) => {
      const latestNoteVisible = notes.list.find((note) => note._id === notes.top_note)
      if(latestNoteVisible) {
        const updatedNote = response.data.data
        notesDispatch({type: "UPDATE", updatedNote})
        notesDispatch({type: "UPDATE_TOP_NOTE", _id: updatedNote?._id})
        notesDispatch({type: "UPDATE_LATEST_NOTE", _id: updatedNote?._id})
        if(notes.is_searching) {
          const updatedNotes = notes.searched_list.map((note) => {
            if(note._id === notes?.searched_selected) {
              return updatedNote
            }
            return { ...note }
          })
          notesDispatch({type: "SEARCHED_LIST", searched_list: [...updatedNotes]})
        } 
      } else {
        refetch()
      }
      scrollToTop()
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    }
  })

  const { mutate: loadMoreNotesMutate, isPending: loadMoreNotesIsPending} = useMutation({
    mutationFn: loadMoreNotes,
    onSuccess: async (response, variable) => {
      if(variable.position === "BOTTOM") {
        notesDispatch({type: "LIST", list: [...notes.list, ...response.data.data]})
        notesDispatch({type: "UPDATE_OLDEST_NOTE", _id: response.data.oldest_note._id})
      } else {
        notesDispatch({type: "LIST", list: [...response.data.data, ...notes.list]})
        notesDispatch({type: "UPDATE_LATEST_NOTE", _id: response.data.latest_note._id})
      }
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    },
  })

  const { mutate: preloadNotesMutate, isPending: preloadNotesIsPending } = useMutation({
    mutationFn: preloadNotes,
    onSuccess: async ({ data }) => {
      notesDispatch({type: "LIST", list: [...data.data]})
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    }, onSettled: () => {
      scrollToTop()
    }
  })

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingEnabled && !preloadNotesIsPending && !loadMoreNotesIsPending) {
      const target = e.currentTarget;

      const threshold = 1
      const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight * (1 + threshold);
      const isAtTop = target.scrollTop === 0;

      if (isAtBottom) {
        if(notes?.is_searching) {

        } else {
          const lastElement = notes.list[notes.list.length - 1]
          if(lastElement._id !== notes.oldest_note) {
            loadMoreNotesMutate({position: "BOTTOM", date: lastElement.date_updated})
          }
        }
      }

      if (isAtTop) {
        if(notes.is_searching) {

        } else {
          const firstElement = notes.list[0]
          if(firstElement._id !== notes.latest_note) {
            loadMoreNotesMutate({position: "TOP", date: firstElement.date_updated})
          }
        }
      }
    }
  };

  const handleChange = (noteId: string) => {
    if(notes.is_searching) {
      notesDispatch({type: "SEARCHED_SELECT", searched_selected: noteId})
    }
    notesDispatch({type: "SELECT", selected: noteId})
  }

  const debouncedOnUpdate = useDebouncedCallback(({ editor }) => {
    updateNoteMutate({content: editor.getHTML(), content_plain_text: editor.getText(), noteId: notes.selected})
  }, 500);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
    onUpdate: debouncedOnUpdate,
  });

  useEffect(() => {
    if(!editor) {
      return;
    }
    
    if(notes.is_searching) {
      editor.commands.setContent(searchedSelectedNotes?.content ?? "", false);
    } else {
      editor.commands.setContent(selectedNotes?.content ?? "", false);
    }

    dateRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'start',
      inline: 'nearest',
    });
  
    // notes.selected is added to dependency array. If there are 2 long identical notes (same content), it should scroll to top.
	}, [notes.selected]);

  useEffect(() => {
    if(data?.data?.data) {
      notesDispatch({type: "LIST", list: data?.data?.data})
      notesDispatch({type: "UPDATE_TOP_NOTE", _id: data?.data?.data[0]?._id})
      notesDispatch({type: "UPDATE_LATEST_NOTE", _id: data?.data?.data[0]?._id})
    }
  }, [data?.data?.data])

  if(!user.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Head title="Notes" />     
      <TopMenu preloadNotesMutate={preloadNotesMutate} scrollToTop={scrollToTop} editor={editor} />
      {notes.is_searching ? (
        <div className="flex flex-grow overflow-hidden">
          <div onScroll={handleScroll} className="w-1/3 max-w-[200px] min-w-[200px] overflow-y-auto border border-gray-200">
            {loadMoreNotesIsPending && <LoadMoreIndicator />}
            <NoteList notes={notes} itemRef={itemRef} handleChange={handleChange}/>
            {loadMoreNotesIsPending && <LoadMoreIndicator />}
          </div>
          <div className="w-2/3 flex-grow overflow-y-auto bg-white px-4 border border-gray-50">
            {notes.searched_selected && <div ref={dateRef} className="select-none flex justify-center"><span className="text-xs">{dayjs(searchedSelectedNotes?.date_updated).format("MMMM DD, YYYY [at] hh:mm A")}</span></div>}
            {notes.searched_selected && <EditorContent key={searchedSelectedNotes?._id} editor={editor} />}
          </div>
        </div>
      ) : (
      <div className="flex flex-grow overflow-hidden">
        <div onScroll={handleScroll} className="w-1/3 max-w-[200px] min-w-[200px] overflow-y-auto border border-gray-200">
          {loadMoreNotesIsPending && <LoadMoreIndicator />}
          <NoteList notes={notes} itemRef={itemRef} handleChange={handleChange}/>
          {loadMoreNotesIsPending && <LoadMoreIndicator />}
        </div>
        <div className="w-2/3 flex-grow overflow-y-auto bg-white px-4 border border-gray-50">
          {notes.selected && <div ref={dateRef} className="select-none flex justify-center"><span className="text-xs font-light text-gray-400">{dayjs(selectedNotes?.date_updated).format("MMMM DD, YYYY [at] hh:mm A")}</span></div>}
          {notes.selected && <EditorContent key={selectedNotes?._id} editor={editor} />}
        </div>
      </div>
      )}
    </div>
  )
}

const TopMenu = ({preloadNotesMutate, scrollToTop, editor}: {preloadNotesMutate: ({date}: {date: Date}) => void, scrollToTop: () => void, editor: Editor | null}) => {
  const notes = useNotes()
  const notesDispatch = useNotesDispatch()
  const navigate = useNavigate()

  const { mutate: logoutMutate, isPending: logoutIsPending } = useMutation({
    mutationFn: logout,
    onSuccess: async ({ data }) => {
      console.log(data)
    }, onError: (error: unknown) => {
      console.log('Error', error)
    }, onSettled: () => {
      notesDispatch({type:"RESET"})
      navigate('/login')
    },
  })

  const { mutate: createNoteMutate, isPending: createNoteisPending } = useMutation({
    mutationFn: createNote,
    onSuccess: async ({ data }) => {
      const newNote = data.data
      notesDispatch({type: "CREATE", list: [newNote, ...notes.list], selected: newNote._id})
      scrollToTop()
      setTimeout(() => editor?.view.dom.focus(), 100)
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    },
  })

  const { mutate: deleteNoteMutate, isPending: deleteNoteisPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
        //delete on both
        notesDispatch({type: "DELETE_SEARCH"})
        notesDispatch({type: "DELETE"})
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    }
  })

  const { mutate: searchNoteMutate } = useMutation({
    mutationFn: searchNote,
    onSuccess: async ({ data }) => {
      console.log(data?.data)
      notesDispatch({type: "SEARCHED_LIST", searched_list: data?.data})
    }, onError: (error: AxiosError) => {
      if(error?.response?.status === 401) {
        notesDispatch({type:"RESET"})
        navigate('/login')
      }
    }
  })

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if(notes.is_searching && notes.search_string.length) {
        searchNoteMutate(notes.search_string)
      }
    }, 500)

    if(!notes.is_searching) {
      //if user select a note from search result then emptied out the search bar
      if(notes.searched_selected) {
        const noteExist = notes.list.find((note) => note._id === notes.searched_selected)
        if(!noteExist) {
          const date = notes.searched_list.find((note) => note._id === notes.searched_selected)?.date_updated
          if(date) {
            preloadNotesMutate({date})
          }
        } else {
          scrollToTop()
        }
      } else {
        scrollToTop()
      }
      notesDispatch({type:"RESET_SEARCH"})
    }

    return () => clearTimeout(timeOut)
  }, [notes.search_string])

  return (
    <div className="flex p-1 items-center border border-b-1 top-menu gap-4">
      <div className="w-1/3 flex justify-between">
        <div className="flex gap-2">
          {!notes.is_searching && <Button color="transparent-gray" disabled={createNoteisPending} loading={createNoteisPending} label={<PiNotePencilLight size={20} />} onClick={() => createNoteMutate()} />}
          {!notes.is_searching && <Button color="transparent-gray" className={notes.selected === null ? "opacity-25" : ""} disabled={deleteNoteisPending || notes.selected === null } loading={deleteNoteisPending} label={<PiTrashLight size={20} />} onClick={() => deleteNoteMutate(notes.selected)} />}
          {notes.is_searching && notes.searched_list.length > 0 && <Button className={notes.searched_selected === null ? "opacity-25" : ""} color="transparent-gray" disabled={deleteNoteisPending || notes.searched_selected === null} loading={deleteNoteisPending} label={<PiTrashLight size={20} />} onClick={() => deleteNoteMutate(notes.selected)} />}
        </div>
        <EditorOptions editor={editor} selected={(!notes.is_searching && notes.selected !== null) || (notes.is_searching && notes.searched_selected !== null)}/>
      </div>

      <div className="w-1/3 bg-gray-400">
        <Input size="sm" placeholder="Search" value={notes.search_string} onChange={(e) => notesDispatch({type: "SEARCH", search_string: e.target.value})} />
      </div>

      <div className="w-1/3 flex justify-end">
        <Button color="white" disabled={logoutIsPending} loading={logoutIsPending} label={<PiSignOutLight size={20} />} onClick={() => logoutMutate()}/>
      </div>
    </div>
  )
}