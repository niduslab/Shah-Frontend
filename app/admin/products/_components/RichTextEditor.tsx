'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Heading3,
  Link2,
  ImageIcon,
  Table as TableIcon,
  Code,
  FileCode
} from 'lucide-react';
import './editor-styles.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  // Only update editor content when value changes externally (not from typing)
  useEffect(() => {
    if (!isTypingRef.current && editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        // Save cursor position
        const selection = window.getSelection();
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        const cursorOffset = range ? range.startOffset : 0;
        const cursorNode = range ? range.startContainer : null;

        editorRef.current.innerHTML = value || '';

        // Restore cursor position if possible
        if (cursorNode && editorRef.current.contains(cursorNode)) {
          try {
            const newRange = document.createRange();
            newRange.setStart(cursorNode, Math.min(cursorOffset, cursorNode.textContent?.length || 0));
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
          } catch (e) {
            // Cursor restoration failed, ignore
          }
        }
      }
    }
    isTypingRef.current = false;
  }, [value]);

  const handleContentChange = (newContent: string) => {
    isTypingRef.current = true;
    onChange(newContent);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get HTML content from clipboard
    const html = e.clipboardData.getData('text/html');
    
    if (html) {
      // Get the current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        // If no selection, append to end
        const currentContent = editorRef.current?.innerHTML || '';
        const newContent = currentContent + html;
        handleContentChange(newContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = newContent;
        }
        return;
      }
      
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create a temporary container to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Insert the HTML content at cursor position
      const fragment = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = tempDiv.firstChild)) {
        lastNode = fragment.appendChild(node);
      }
      range.insertNode(fragment);
      
      // Update the content from the editor
      const editorDiv = e.currentTarget;
      handleContentChange(editorDiv.innerHTML);
      
      // Move cursor to end of inserted content
      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // Fallback to plain text
      const text = e.clipboardData.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
        const editorDiv = e.currentTarget;
        handleContentChange(editorDiv.innerHTML);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    handleContentChange(e.currentTarget.innerHTML);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorDiv) {
      handleContentChange(editorDiv.innerHTML);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertTable = () => {
    const rows = 3;
    const cols = 3;
    let tableHtml = '<table border="1" style="border-collapse: collapse; width: 100%;"><thead><tr>';
    
    for (let i = 0; i < cols; i++) {
      tableHtml += '<th style="border: 1px solid #ddd; padding: 8px;">Header ' + (i + 1) + '</th>';
    }
    tableHtml += '</tr></thead><tbody>';
    
    for (let i = 0; i < rows - 1; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += '<td style="border: 1px solid #ddd; padding: 8px;">Cell</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';
    
    execCommand('insertHTML', tableHtml);
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<code>')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Code"
        >
          <Code className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Insert Elements */}
        <button
          type="button"
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Add Link"
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* HTML Mode Toggle */}
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${
            isHtmlMode ? 'bg-gray-200' : ''
          }`}
          title="Toggle HTML Mode"
        >
          <FileCode className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full min-h-[200px] px-4 py-3 font-mono text-sm focus:outline-none border-0 resize-none"
            placeholder="HTML code..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            className="min-h-[200px] px-4 py-3 focus:outline-none"
            suppressContentEditableWarning
            style={{ 
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          />
        )}
      </div>
    </div>
  );
}
