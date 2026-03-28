import { Editor } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";

interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  width?: string;
  align?: "left" | "center" | "right";
}

interface ImageButtonProps {
  editor: Editor;
}
const ImageButton = ({ editor }: ImageButtonProps) => {
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageAttributes | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if an image is selected
  useEffect(() => {
    const updateSelection = () => {
      if (editor.isActive("image")) {
        const node = editor.getAttributes("image");
        setSelectedImage({
          src: node.src,
          width: node.width || "100%",
          align: (node.align as "left" | "center" | "right") || "left",
        });
      } else {
        setSelectedImage(null);
      }
    };

    // Set up event listeners
    editor.on("selectionUpdate", updateSelection);
    editor.on("transaction", updateSelection);

    // Initial update
    updateSelection();

    // Cleanup
    return () => {
      editor.off("selectionUpdate", updateSelection);
      editor.off("transaction", updateSelection);
    };
  }, [editor]);

  const addImage = () => {
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          width: "100%",
          align: "left",
        } as ImageAttributes)
        .run();
      closeDropdown();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        editor
          .chain()
          .focus()
          .setImage({
            src: e.target?.result as string,
            width: selectedImage?.width || "100%",
          } as ImageAttributes)
          .run();
        closeDropdown();
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImageAttributes = (attributes: Partial<ImageAttributes>) => {
    editor.chain().focus().updateAttributes("image", attributes).run();
  };

  const closeDropdown = () => {
    setShowInput(false);
    setUrl("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setShowInput(!showInput)}
        className={`p-2 rounded ${editor.isActive("image")
            ? "bg-blue-100 text-blue-800"
            : "text-gray-700 hover:bg-gray-100"
          }`}
        title="Image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showInput && (
        <div className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-1 p-2 bg-white dark:bg-background rounded shadow-lg border border-gray-200 w-64">
          <input
            type="text"
            placeholder="Enter image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addImage()}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
            autoFocus
          />
          <div className="flex justify-between mb-2">
            <button
              type="button"
              onClick={addImage}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Image
            </button>
            <button
              type="button"
              onClick={closeDropdown}
              className="px-2 py-1 text-sm bg-gray-200 dark:bg-background dark:border text-gray-700 rounded hover:bg-gray-300 hover:dark:bg-background"
            >
              Cancel
            </button>
          </div>
          <div className="relative mb-2">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="image-upload"
              className="block w-full px-2 py-1 text-sm text-center bg-gray-100 dark:bg-background text-gray-700 dark:text-gray-300 rounded border border-gray-300 hover:bg-gray-200 cursor-pointer"
            >
              Upload Image
            </label>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="absolute z-10 mt-1 p-2 bg-white rounded shadow-lg border border-gray-200 w-64">
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <select
              value={selectedImage.width || "100%"}
              onChange={(e) => updateImageAttributes({ width: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
              <option value="auto">Original Size</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">
              Alignment
            </label>
            <div className="flex space-x-1">
              {(["left", "center", "right"] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => updateImageAttributes({ align })}
                  className={`p-1 flex-1 text-sm rounded ${selectedImage?.align === align
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {align.charAt(0).toUpperCase() + align.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteSelection().run()}
            className="w-full px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageButton;
