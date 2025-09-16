'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState("## 所见即所得（WYSIWYG）\n所见即所得模式对不熟悉 Markdown 的用户较为友好，熟悉 Markdown 的话也可以无缝使用。\n\n### 代码示例\n```javascript\nconsole.log('Hello, world!');\n```\n\n### 列表示例\n- 项目 1\n- 项目 2\n- 项目 3\n\n> 这是一个引用块\n\n[链接示例](https://example.com)");

  const handleSave = () => {
    console.log('保存文章:', { title, content });
    alert('文章已保存！');
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="w-full mx-auto p-4 h-[85vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">创建新文章</h1>
      
      {/* 标题输入 */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium mb-2">
          文章标题
        </label>
        <input
          type="text"
          id="title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题"
        />
      </div>

      {/* MDEditor 编辑器 - 扩展以填充剩余空间 */}
      <div className="flex-grow border border-gray-300 rounded-md dark:border-gray-600 overflow-hidden">
        <MDEditor
          value={content}
          onChange={(value) => setContent(value || '')}
          height="100%"
          previewOptions={{
            rehypePlugins: [],
            remarkPlugins: [],
          }}
        />
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 flex space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleSave}
        >
          保存文章
        </button>
        <button
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          onClick={handleClear}
        >
          清空
        </button>
      </div>
    </div>
  );
}
