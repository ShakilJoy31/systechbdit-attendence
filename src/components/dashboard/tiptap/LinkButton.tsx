import { useState } from 'react'
import { Editor } from "@tiptap/core";
interface ImageButtonProps {
  editor: Editor;
}
const LinkButton = ({ editor }:ImageButtonProps) => {
  const [showInput, setShowInput] = useState(false)
  const [linkData, setLinkData] = useState({
    url: '',
    text: '',
    openInNewTab: false
  })

  const addLink = () => {
    if (linkData.url) {
      const { from, to } = editor.state.selection
      const selectedText = editor.state.doc.textBetween(from, to, ' ')
      const linkText = linkData.text || selectedText || linkData.url

      // Create the link with the current checkbox state
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .insertContent({
          type: 'text',
          text: linkText,
          marks: [
            {
              type: 'link',
              attrs: {
                href: linkData.url,
                target: linkData.openInNewTab ? '_blank' : null, // Explicit null
                rel: linkData.openInNewTab ? 'noopener noreferrer' : null
              }
            }
          ]
        })
        .run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    setShowInput(false)
    setLinkData({
      url: '',
      text: '',
      openInNewTab: false // Reset to false after applying
    })
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLinkData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleButtonClick = () => {
    if (editor.isActive('link')) {
      const attrs = editor.getAttributes('link')
      setLinkData({
        url: attrs.href || '',
        text: editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          ' '
        ),
        openInNewTab: attrs.target === '_blank' // Correctly sync checkbox state
      })
    }
    setShowInput(!showInput)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleButtonClick}
        className={`p-2 rounded ${editor.isActive('link') ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
        title="Link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
      </button>

      {showInput && (
        <div className="absolute z-10 mt-1 p-4 bg-white dark:bg-background rounded shadow-lg border border-gray-200 w-64">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
              <input
                type="text"
                name="text"
                placeholder="Display text"
                value={linkData.text}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input
                type="text"
                name="url"
                placeholder="https://example.com"
                value={linkData.url}
                onChange={handleInputChange}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                autoFocus
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="openInNewTab"
                name="openInNewTab"
                checked={linkData.openInNewTab}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:bg-background border-gray-300 rounded"
              />
              <label htmlFor="openInNewTab" className="ml-2 block text-sm text-gray-700">
                Open in new tab
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInput(false)
                setLinkData({
                  url: '',
                  text: '',
                  openInNewTab: false
                })
              }}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-background text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 hover:dark:bg-background dark:border"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkButton