import { Editor } from "@tiptap/react";
import { Level } from "@tiptap/extension-heading"; // Import Level type

interface HeadingButtonProps {
  editor: Editor;
}

type HeadingItem =
  | { type: 'paragraph'; label: string }
  | { type: 'heading'; level: Level; label: string };

const HeadingButtons = ({ editor }: HeadingButtonProps) => {
  if (!editor) return null;

  const items: HeadingItem[] = [
    { type: "heading", level: 1, label: "H1" },
    { type: "heading", level: 2, label: "H2" },
    { type: "heading", level: 3, label: "H3" },
    { type: "heading", level: 4, label: "H4" },
    { type: "paragraph", label: "P" },
  ];

  return (
    <div className="flex border-r border-gray-200 pr-2">
      {items.map((item, index) => {
        const isActive =
          item.type === "paragraph"
            ? editor.isActive("paragraph")
            : editor.isActive("heading", { level: item.level });

        const canToggle =
          item.type === "paragraph"
            ? editor.can().setParagraph()
            : editor.can().toggleHeading({ level: item.level });

        return (
          <button
            type="button"
            key={index}
            onClick={() => {
              if (item.type === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: item.level }).run();
              }
            }}
            className={`p-2 rounded ${
              isActive
                ? "bg-blue-100 text-blue-800"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            title={
              item.type === "paragraph"
                ? "Paragraph"
                : `Heading ${item.level}`
            }
            disabled={!canToggle}
          >
            <span className="text-base">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default HeadingButtons;
