import { PiTextBBold, PiTextItalic, PiTextUnderline, PiTextStrikethrough, PiTextAa } from "react-icons/pi"
import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react'
import { Editor } from "@tiptap/react"
import { Button } from "../../../components"

export default function EditorOptions({editor, selected}: {editor: Editor | null, selected: boolean}) {
  return (
    <div>
      <Popover>
        <PopoverButton disabled={!selected} className="outline-none">
          <div className={`${!selected && 'opacity-50 pointer-events-none'} py-2 px-3 text-gray-600 hover:bg-gray-200 rounded focus:outline-none text focus:shadow-outline flex justify-center text-center border-gray text-sm`}><PiTextAa size={20} /></div>
        </PopoverButton>
        <PopoverPanel
          transition
          anchor="bottom"
          className="mt-1 w-52 divide-y divide-black/5 rounded-lg border-2 bg-stone-100 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
        >
          <div className="flex justify-evenly p-2">
            <CloseButton as={() => (
              <Button 
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('bold') ? 'bg-amber-200' : ''} ${selected ? 'opacity-100' : 'opacity-50'}`}
                disabled={!selected}
                label={<PiTextBBold size={20} />} 
                onClick={() => editor?.chain().focus().toggleBold().run()} 
              /> 
            )}/>
            <CloseButton as={() => (
              <Button 
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('italic') ? 'bg-amber-200' : ''}`}
                disabled={!selected}
                label={<PiTextItalic size={20} />} 
                onClick={() => editor?.chain().focus().toggleItalic().run()} 
              /> 
            )}/>
            <CloseButton as={() => (
              <Button 
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('underline') ? 'bg-amber-200' : ''}`}
                disabled={!selected}
                label={<PiTextUnderline size={20} />} 
                onClick={() => editor?.chain().focus().toggleUnderline().run()} 
              /> 
            )}/>
            <CloseButton as={() => (
              <Button 
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('strike') ? 'bg-amber-200' : ''}`}
                disabled={!selected}
                label={<PiTextStrikethrough size={20} />} 
                onClick={() => editor?.chain().focus().toggleStrike().run()} 
              /> 
            )}/>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <CloseButton as={() => (
              <Button 
                block
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('bulletList') ? 'bg-amber-200' : ''}`}
                disabled={!selected}
                label="Bulleted List" 
                onClick={() => editor?.chain().focus().toggleBulletList().run()} 
              /> 
            )}/>
            <CloseButton as={() => (
              <Button 
                block
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('orderedList') ? 'bg-amber-200' : ''}`}
                disabled={!selected}
                label="Numbered List" 
                onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
              /> 
            )}/>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <CloseButton disabled={!editor?.can().setBlockquote()} as={() => (
              <Button 
                block
                color="transparent-gray-no-hover" 
                className={`${editor?.isActive('blockquote') ? 'bg-amber-200' : ''}`}
                disabled={!selected || !editor?.can().setBlockquote()}
                label="Block Quote" 
                onClick={() => editor?.chain().focus().toggleBlockquote().run()} 
              /> 
            )}/>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}