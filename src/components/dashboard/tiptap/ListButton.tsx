import { Editor } from "@tiptap/react";

interface ImageButtonProps {
  editor: Editor;
}
const ListButtons = ({ editor }:ImageButtonProps) => {
  return (
    <div className="flex border-r border-gray-200 pr-2">
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zM3 5a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
        title="Numbered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zM3 7a1 1 0 011-1h1V5h1v1h1v1H5v1H4V8H3V7zm0 6a1 1 0 011-1h1v1H4v1h1v1H3v-1H2v-1h1v-1zm1 4a1 1 0 100-2H3v1h1z" clipRule="evenodd" />
        </svg>
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-2 rounded ${editor.isActive('taskList') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
        title="Task List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zm0 6a1 1 0 011-1h10a1 1 0 110 2H6a1 1 0 01-1-1zM3 7a1 1 0 011-1h1v1H4v1h1v1H3V7zm0 6a1 1 0 011-1h1v1H4v1h1v1H3v-1H2v-1h1v-1zm1 4a1 1 0 100-2H3v1h1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

export default ListButtons