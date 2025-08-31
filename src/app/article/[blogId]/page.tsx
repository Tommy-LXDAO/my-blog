'use client';

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, { useEffect, useState } from 'react';
import { div } from 'framer-motion/client';

const demoDatas = `# Title 1
## Title 2
hello *world*
- test
- test2 nihao
`

// 详情页，通过接口获取文章的markdown raw data，并转换为样式
export default function BlogPage({ params }: { params: Promise<{ blogId: string }> }) {

  const [datas, setDatas] = useState<{item_id: string, raw_data: string}>();

  const { blogId } = React.use(params);  // 解 Promise
  useEffect(() => {
    async function fetchBlogRawDatas() {
      try {
        const res = await fetch(`/mock/article_${blogId}.json`); // 从 public 目录读取
        if (!res.ok) throw new Error("获取文章数据失败");
        const data = await res.json();
        setDatas(data);
      } catch (err) {
        console.error("获取文章失败:", err);
      }
    }

    fetchBlogRawDatas();
  }, [])

  return (
    <div className='flex justify-center items-center'>
      <div className='prose dark:prose-invert max-w-400 min-w-200'>
        <h1 className="text-3xl font-bold">Blog ID: {blogId}</h1>
        {/* Here you can fetch and display the blog content based on the blogId */}
        <div className="fade-in-700">
          <Markdown remarkPlugins={[remarkGfm]}>
            {datas ? datas.raw_data : ""}
          </Markdown>
        </div>
      </div>
    </div>
  );
}