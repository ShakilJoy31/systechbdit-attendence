import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextStyle from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CodeBlock from "@tiptap/extension-code-block";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Code from "@tiptap/extension-code";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading from "@tiptap/extension-heading";
import HeadingButtons from "./HeadingButton";
import BoldButton from "./BoldButton";
import ItalicButton from "./ItalicButton";
import UnderlineButton from "./UnderlineButton";
import AlignmentButtons from "./AlignmentButton";
import LinkButton from "./LinkButton";
import TableButton from "./TableButton";
import ImageButton from "./ImageButton";
import ListButtons from "./ListButton";
import { FC } from "react";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";
import { CustomImage } from "@/utils/common/customImage";

interface TipTapEditorProps {
  content?: string;
  value?: string;
  onUpdate: (content: string) => void;
  onChange?: (content: string) => void;
}

const TipTapEditor: FC<TipTapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
     CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: "Write your content here...",
      }),
      Underline,

      CodeBlock,
      TaskList,
      TaskItem,
      HorizontalRule,
      Code,
      Dropcursor.configure({
        width: 2,
        color: "rgba(0, 0, 0, 0.2)",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
       class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none [&_li]:my-1",
      },
      handlePaste: (view, event) => {
        // Handle paste event to maintain formatting
        const items = Array.from(event.clipboardData?.items || []);
        const { state } = view;

        // Check if any of the pasted items is an image
        const imageItem = items.find(
          (item) => item.type.indexOf("image") !== -1
        );

        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          const reader = new FileReader();

          reader.onload = (readerEvent) => {
            const node = state.schema.nodes.image.create({
              src: readerEvent.target?.result,
            });
            const transaction = state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          };

          reader.readAsDataURL(file as File);
          return true;
        }
        // 2. Handle HTML/table pasting

        return false;
      },
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full mx-auto p-4 bg-white dark:bg-background rounded-lg shadow-lg">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b dark:border border-gray-200">
        <HeadingButtons editor={editor} />
          <ImageButton editor={editor} />
        <BoldButton editor={editor} />
        <ItalicButton editor={editor} />
        <UnderlineButton editor={editor} />
        <AlignmentButtons editor={editor} />
        <LinkButton editor={editor} />
        <TableButton editor={editor} />
        <ListButtons editor={editor} />
        <UndoButton editor={editor} />
        <RedoButton editor={editor} />
      </div>

      {/* Floating Menu for quick actions */}
      {editor && (
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex gap-1 p-1 bg-white dark:bg-background rounded shadow-lg border border-gray-200">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-1 rounded ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-blue-100 dark:bg-background"
                  : "hover:bg-gray-100 hover:dark:bg-background"
              }`}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-1 rounded ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-blue-100"
                  : "hover:bg-gray-100 hover:dark:bg-background"
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1 rounded ${
                editor.isActive("bulletList")
                  ? "bg-blue-100"
                  : "hover:bg-gray-100 hover:dark:bg-background"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-1 rounded ${
                editor.isActive("taskList")
                  ? "bg-blue-100"
                  : "hover:bg-gray-100 hover:dark:bg-background"
              }`}
            >
              Tasks
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-1 rounded ${
                editor.isActive("codeBlock")
                  ? "bg-blue-100"
                  : "hover:bg-gray-100 hover:dark:bg-background"
              }`}
            >
              Code
            </button>
          </div>
        </FloatingMenu>
      )}

      {/* Bubble Menu for selected text */}
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex gap-1 p-1 bg-white dark:bg-background rounded shadow-lg border border-gray-200">
            <HeadingButtons editor={editor} />
            {/* <BoldButton editor={editor} />
            <ItalicButton editor={editor} />
            <UnderlineButton editor={editor} />
            <LinkButton editor={editor} /> */}
          </div>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="max-h-[400px] overflow-y-auto"
      />
    </div>
  );
};

export default TipTapEditor;
