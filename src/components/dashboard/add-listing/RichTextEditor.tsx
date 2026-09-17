'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {Table} from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { useEffect, useRef, useState } from 'react';
import {
  ImagePlus,
  Loader2,
  Link as LinkIcon,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  Combine,
  SplitSquareHorizontal,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
}

const InsertParagraphAfterHeading = Extension.create({
  name: 'insertParagraphAfterHeading',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { editor } = this;
        if (editor.isActive('heading')) {
          editor.chain().focus().splitBlock().setParagraph().run();
          return true;
        }
        return false;
      },
    };
  },
});

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Describe your business...',
  error,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'max-h-80 w-auto rounded-md',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      InsertParagraphAfterHeading,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-4 py-3',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const triggerImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) {
      return;
    }

    setImageUploadError('');
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(
        API_ENDPOINTS.UPLOAD.IMAGE,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const imageUrl = response.data?.data?.imageUrl;
      if (!imageUrl) {
        throw new Error('Image URL missing from upload response.');
      }

      editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
    } catch (uploadError: any) {
      setImageUploadError(
        uploadError?.message || 'Failed to upload image. Please try again.'
      );
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLinkClick = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    // Check if link is already active
    if (editor.isActive('link')) {
      const attrs = editor.getAttributes('link');
      setLinkUrl(attrs.href || '');
    } else {
      setLinkUrl(selectedText || '');
    }

    setShowLinkInput(true);
  };

  const handleLinkSubmit = () => {
    if (!editor || !linkUrl.trim()) return;

    const url = linkUrl.trim().startsWith('http://') || linkUrl.trim().startsWith('https://')
      ? linkUrl.trim()
      : `https://${linkUrl.trim()}`;

    // If text is selected, convert it to a link
    // Otherwise, insert the URL as a link
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (selectedText) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
    }

    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handleUnlink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  // Current block type shown in the paragraph/heading dropdown
  const getCurrentBlockType = () => {
    if (!editor) return 'paragraph';
    for (const level of HEADING_LEVELS) {
      if (editor.isActive('heading', { level })) return `h${level}`;
    }
    return 'paragraph';
  };

  const handleBlockTypeChange = (value: string) => {
    if (!editor) return;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number(value.replace('h', '')) as (typeof HEADING_LEVELS)[number];
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const insertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const isInTable = editor?.isActive('table');

  return (
    <div>
      <div className={`border rounded-lg ${
        error ? 'border-red-500' : 'border-gray-300 focus-within:ring-2 focus-within:ring-[#1c4233] focus-within:border-transparent'
      }`}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
          {/* Paragraph / Heading dropdown (covers paragraph + H1-H6) */}
          <select
            value={getCurrentBlockType()}
            onChange={(e) => handleBlockTypeChange(e.target.value)}
            className="p-2 rounded border border-transparent hover:bg-gray-200 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1c4233]"
            title="Text style"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('strike') ? 'bg-gray-200' : ''}`}
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
            title="Quote"
          >
            "
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={triggerImagePicker}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Image"
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
            ) : (
              <ImagePlus className="h-4 w-4 text-gray-600" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={handleLinkClick}
            className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('link') ? 'bg-gray-200' : ''}`}
            title="Insert/Edit Link"
          >
            <LinkIcon className="h-4 w-4 text-gray-600" />
          </button>

          {editor?.isActive('link') && (
            <button
              type="button"
              onClick={handleUnlink}
              className="p-2 rounded hover:bg-gray-200"
              title="Remove Link"
            >
              <span className="text-xs text-gray-600">Unlink</span>
            </button>
          )}

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Table controls */}
          <button
            type="button"
            onClick={insertTable}
            className={`p-2 rounded hover:bg-gray-200 ${isInTable ? 'bg-gray-200' : ''}`}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4 text-gray-600" />
          </button>

          {isInTable && (
            <>
              <button
                type="button"
                onClick={() => editor?.chain().focus().addColumnBefore().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Add Column Before"
              >
                <Columns className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().addColumnAfter().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Add Column After"
              >
                <Columns className="h-4 w-4 text-gray-600 scale-x-[-1]" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().deleteColumn().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Delete Column"
              >
                <Columns className="h-4 w-4 text-red-500" />
              </button>

              <button
                type="button"
                onClick={() => editor?.chain().focus().addRowBefore().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Add Row Before"
              >
                <Rows className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().addRowAfter().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Add Row After"
              >
                <Rows className="h-4 w-4 text-gray-600 scale-y-[-1]" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().deleteRow().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Delete Row"
              >
                <Rows className="h-4 w-4 text-red-500" />
              </button>

              <button
                type="button"
                onClick={() => editor?.chain().focus().mergeCells().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Merge Cells"
              >
                <Combine className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().splitCell().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Split Cell"
              >
                <SplitSquareHorizontal className="h-4 w-4 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
                className="p-2 rounded hover:bg-gray-200 text-xs font-medium text-gray-600"
                title="Toggle Header Row"
              >
                Hdr
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().deleteTable().run()}
                className="p-2 rounded hover:bg-gray-200"
                title="Delete Table"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </>
          )}

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo()}
            title="Undo"
            className={`p-2 rounded hover:bg-gray-200 ${!editor?.can().undo() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo()}
            title="Redo"
            className={`p-2 rounded hover:bg-gray-200 ${!editor?.can().redo() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ↷
          </button>
        </div>

        {/* Link Input - Inside Editor */}
        {showLinkInput && (
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLinkSubmit();
                  } else if (e.key === 'Escape') {
                    setShowLinkInput(false);
                    setLinkUrl('');
                    editor?.chain().focus().run();
                  }
                }}
                placeholder="Enter URL (e.g., https://example.com)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c4233] focus:border-transparent text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-[#1c4233] text-white rounded-lg hover:bg-[#1c4233]/90 text-sm font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl('');
                  editor?.chain().focus().run();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>

      {imageUploadError ? (
        <p className="mt-2 text-sm text-red-600">{imageUploadError}</p>
      ) : null}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
