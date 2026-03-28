import { Editor } from "@tiptap/react";
import { useState } from "react";


interface ImageButtonProps {
  editor: Editor;
}
const TableButton = ({ editor }:ImageButtonProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        className={`p-2 rounded ${
          editor.isActive("table")
            ? "bg-blue-100 text-blue-800"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        title="Table"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5zm0 2h10v2H5V6zm0 4h10v2H5v-2zm0 4h10v2H5v-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showOptions && (
        <div className="absolute z-10 mt-1 p-2 bg-white dark:bg-background rounded shadow-lg border border-gray-200 w-48">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={addTable}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                setShowOptions(false);
              }}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              disabled={!editor.can().deleteTable()}
            >
              Delete
            </button>
          </div>
          {editor.isActive("table") && (
            <div className="grid grid-cols-2 gap-1 mt-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={!editor.can().addColumnAfter()}
              >
                Add Column
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={!editor.can().addRowAfter()}
              >
                Add Row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={!editor.can().deleteColumn()}
              >
                Delete Column
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                disabled={!editor.can().deleteRow()}
              >
                Delete Row
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TableButton;
