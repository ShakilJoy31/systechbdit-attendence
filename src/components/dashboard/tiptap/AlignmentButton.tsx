import { Editor } from "@tiptap/react";
import React from "react";

type Alignment = 'left' | 'center' | 'right';

interface ImageButtonProps {
  editor: Editor;
}

interface AlignmentButtonItem {
  align: Alignment;
  icon: React.ReactNode;
}

const AlignmentButtons: React.FC<ImageButtonProps> = ({ editor }) => {
  const items: AlignmentButtonItem[] = [
    {
      align: 'left',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      align: 'center',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM7 15a1 1 0 100-2H5a1 1 0 100 2h2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      align: 'right',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 100-2h6a1 1 0 100 2H9z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const applyAlignment = (align: Alignment) => {
    if (editor.isActive('image')) {
      const currentAlign = editor.getAttributes('image').align as Alignment | undefined;
      const newAlign: Alignment | null = currentAlign === align ? null : align;

      editor.chain().focus()
        .updateAttributes('image', { align: newAlign })
        .run();
    } else {
      if (align === 'left') {
        editor.chain().focus().unsetTextAlign().run();
      } else {
        editor.chain().focus().setTextAlign(align).run();
      }
    }
  };

  const getActiveAlignment = (): Alignment => {
    if (editor.isActive('image')) {
      return editor.getAttributes('image').align as Alignment ?? 'left';
    }
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    return 'left';
  };

  const currentAlign = getActiveAlignment();

  return (
    <div className="flex border-r border-gray-200 pr-2">
      {items.map((item) => (
        <button
          key={item.align}
          type="button"
          onClick={() => applyAlignment(item.align)}
          className={`p-2 rounded ${
            currentAlign === item.align
              ? 'bg-blue-100 text-blue-800'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title={`Align ${item.align}`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default AlignmentButtons;
