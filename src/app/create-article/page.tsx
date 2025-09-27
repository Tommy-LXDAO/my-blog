'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import MDEditor from '@uiw/react-md-editor';

// 模拟图片上传函数
// 在实际应用中，您需要将此函数替换为真实的上传逻辑
const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 这里应该实现真实的上传逻辑，例如：
    // 1. 将文件上传到服务器
    // 2. 上传到云存储服务（如 AWS S3、阿里云 OSS 等）
    // 3. 获取图片的公共访问 URL
    
    // 当前实现只是模拟上传过程
    setTimeout(() => {
      // 模拟上传成功，返回图片 URL
      // 在实际应用中，这里应该是服务器返回的图片 URL
      const imageUrl = URL.createObjectURL(file);
      resolve(imageUrl);
      
      // 如果需要模拟上传失败，可以使用以下代码：
      // reject(new Error('上传失败'));
    }, 100);
  });
};

export default function CreateArticlePage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef('');
  const contentRef = useRef("## 所见即所得（WYSIWYG）\n所见即所得模式对不熟悉 Markdown 的用户较为友好，熟悉 Markdown 的话也可以无缝使用。\n\n### 代码示例\n```javascript\nconsole.log('Hello, world!');\n```\n\n### 列示例\n- 项目 1\n- 项目 2\n- 项目 3\n\n> 这是一个引用块\n\n[链接示例](https://example.com)");
  
  const [title, setTitle] = useState(titleRef.current);
  const [content, setContent] = useState(contentRef.current);

  // 更新 ref 的值但不触发重新渲染
  const updateTitleRef = (value: string) => {
    titleRef.current = value;
    setTitle(value);
  };

 const updateContentRef = (value?: string) => {
    contentRef.current = value || '';
    setContent(value || '');
 };

 const handleSave = () => {
    console.log('保存文章:', { title: titleRef.current, content: contentRef.current });
    alert('文章已保存！');
  };

  const handleClear = () => {
    titleRef.current = '';
    contentRef.current = '';
    setTitle('');
    setContent('');
  };

  // 确保只在客户端设置 mounted，避免水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-grow p-4">
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
            onChange={(e) => updateTitleRef(e.target.value)}
            placeholder="输入文章标题"
          />
        </div>

        {/* MDEditor 编辑器 - 扩展以填充剩余空间 */}
        <div className="flex-grow border border-gray-30 rounded-md dark:border-gray-600 overflow-hidden h-[calc(100vh-200px)]">
          {mounted ? (
            <MDEditor
              value={content}
              onChange={updateContentRef}
              height="100%"
              data-color-mode={theme === 'dark' ? 'dark' : 'light'}
              previewOptions={{
                rehypePlugins: [],
                remarkPlugins: [],
                components: {
                  img: ({ node, ...props }) => {
                    // 处理空的 src 属性
                    if (!props.src || props.src === '') {
                      return <span style={{ color: 'red' }}>无效的图片链接</span>;
                    }
                    return <img {...props} />;
                  }
                }
              }}
              commandsFilter={(command) => {
                // 启用上传图片功能
                if (command.name === 'image') {
                  return {
                    ...command,
                    execute: (state, api) => {
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = 'image/*';
                      fileInput.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) {
                          const file = files[0];
                          
                          // 限制文件大小 (例如: 2MB)
                          const maxSize = 2 * 1024 * 1024;
                          if (file.size > maxSize) {
                            alert('图片大小不能超过 2MB');
                            return;
                          }
                          
                          // 显示加载提示
                          const loadingText = `![上传中...${file.name}]()`;
                          api.replaceSelection(loadingText);
                          
                          // 模拟真实的图片上传过程
                          // 在实际应用中，您需要将图片上传到服务器并获取 URL
                          // 这里我们提供一个示例实现
                          uploadImage(file)
                            .then((imageUrl) => {
                              // 替换加载提示为实际图片
                              const imageMarkdown = `![${file.name}](${imageUrl})`;
                              const currentValue = api.textArea.value;
                              const newValue = currentValue.replace(loadingText, imageMarkdown);
                              api.textArea.value = newValue;
                              updateContentRef(newValue);
                            })
                            .catch((error) => {
                              // 处理错误情况
                              console.error('图片上传失败:', error);
                              const errorText = `![上传失败: ${file.name}]()`;
                              const currentValue = api.textArea.value;
                              const newValue = currentValue.replace(loadingText, errorText);
                              api.textArea.value = newValue;
                              updateContentRef(newValue);
                            });
                        }
                      };
                      fileInput.click();
                    }
                  };
                }
                return command;
              }}
            />
          ) : (
            // 在组件未挂载时显示加载状态
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2">加载编辑器...</p>
              </div>
            </div>
          )}
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
    </div>
  )
}
