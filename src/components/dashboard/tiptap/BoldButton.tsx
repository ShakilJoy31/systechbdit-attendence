import { Editor } from "@tiptap/react";
import { MdOutlineFormatBold } from "react-icons/md"

interface ImageButtonProps {
  editor: Editor;
}
const BoldButton = ({ editor }:ImageButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={`p-2 rounded ${editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
      title="Bold"
    >
     <MdOutlineFormatBold size={25} />
    </button>
  )
}

export default BoldButton