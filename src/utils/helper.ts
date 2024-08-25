import StarterKit from '@tiptap/starter-kit'
import { generateJSON } from '@tiptap/html'
import { generateText, HTMLContent, JSONContent } from '@tiptap/react'

export const generateJSONHelper = (html: HTMLContent) => generateJSON(html, [StarterKit])

export const generateTextHelper = (json: JSONContent) => generateText(json, [StarterKit ])

export const truncateString = (str: string, maxLength = 18) => {
  if (str && str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
}