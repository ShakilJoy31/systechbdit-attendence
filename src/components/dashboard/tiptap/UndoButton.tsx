import { Editor } from "@tiptap/react";

// UndoButton.tsx
interface ImageButtonProps {
  editor: Editor;
}
const UndoButton = ({ editor }:ImageButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().undo()}
      className={`p-2 rounded ${
        !editor.can().undo()
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      title="Undo"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v1a1 1 0 11-2 0v-1a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default UndoButton;
