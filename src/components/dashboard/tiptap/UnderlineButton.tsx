import { Editor } from "@tiptap/react";

interface ImageButtonProps {
  editor: Editor;
}
const UnderlineButton = ({ editor }:ImageButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      className={`p-2 rounded ${
        editor.isActive("underline")
          ? "bg-blue-100 text-blue-800"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      title="Underline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5 3a1 1 0 011-1h8a1 1 0 110 2H8v11a3 3 0 11-6 0V4H6a1 1 0 011-1zm5 16a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default UnderlineButton;
