import { useRef, useState } from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  ClearOutlined,
} from '@ant-design/icons';

const RichTextEditor = ({ value = '', onChange, placeholder = 'Nhập nội dung...' }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value);

  const executeCommand = (command, arg = null) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
  };

  const handleInput = (e) => {
    const html = editorRef.current.innerHTML;
    setContent(html);
    onChange?.(html);
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const clearFormatting = () => {
    executeCommand('removeFormat');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-2">
        <Space size="small" wrap>
          <Tooltip title="Bold (Ctrl+B)">
            <Button
              type="text"
              size="small"
              icon={<BoldOutlined />}
              onClick={() => executeCommand('bold')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <Tooltip title="Italic (Ctrl+I)">
            <Button
              type="text"
              size="small"
              icon={<ItalicOutlined />}
              onClick={() => executeCommand('italic')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <Tooltip title="Underline (Ctrl+U)">
            <Button
              type="text"
              size="small"
              icon={<UnderlineOutlined />}
              onClick={() => executeCommand('underline')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <Tooltip title="Strikethrough">
            <Button
              type="text"
              size="small"
              icon={<StrikethroughOutlined />}
              onClick={() => executeCommand('strikethrough')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <div className="w-px bg-gray-300"></div>

          <Tooltip title="Unordered List">
            <Button
              type="text"
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => executeCommand('insertUnorderedList')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <Tooltip title="Ordered List">
            <Button
              type="text"
              size="small"
              icon={<OrderedListOutlined />}
              onClick={() => executeCommand('insertOrderedList')}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <div className="w-px bg-gray-300"></div>

          <Tooltip title="Link">
            <Button
              type="text"
              size="small"
              icon={<LinkOutlined />}
              onClick={insertLink}
              className="hover:bg-gray-200"
            />
          </Tooltip>

          <Tooltip title="Clear Formatting">
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={clearFormatting}
              danger
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className={`
          w-full min-h-[200px] p-4 outline-none text-base
          focus:outline-none focus:ring-0
          [&:empty:before]:content-[attr(data-placeholder)]
          [&:empty:before]:text-gray-400
        `}
        data-placeholder={placeholder}
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Character count */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 text-right">
        ~{content?.replace(/<[^>]*>/g, '').length || 0} ký tự
      </div>
    </div>
  );
};

export default RichTextEditor;
