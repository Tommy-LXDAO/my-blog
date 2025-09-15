'use client';

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React, { useEffect, useState } from 'react';

import { useApi } from '@/hooks/useApi';

// 详情页，通过接口获取文章的markdown raw data，并转换为样式
export default function BlogPage({ params }: { params: Promise<{ blogId: string }> }) {

  const [datas, setDatas] = useState<{id: string, title: string, rawData: string}>();

  const { fetchApi } = useApi();

  const { blogId } = React.use(params);  // 解 Promise

  console.log(`###render BlogPage datas=${datas}`)

  useEffect(() => {
    async function fetchBlogRawDatas() {
      try {
        // const res = await fetch(`/mock/article_1.json`); // 从 public 目录读取
        const res = await fetchApi(`/articles/detail/${blogId}`); // 从 public 目录读取
        if (!res.ok) throw new Error("获取文章数据失败");
        const data = await res.json();
        console.log(`data=${data.rawData}`)
        setDatas(data);
      } catch (err) {
        console.error("获取文章失败:", err);
      }
    }

    fetchBlogRawDatas();
  }, [fetchApi, blogId])

  return (
    <div className='flex justify-center items-center'>
      <div className='prose dark:prose-invert max-w-400 min-w-200'>
        <h1 className="text-3xl font-bold">Blog ID: {blogId}</h1>
        {/* Here you can fetch and display the blog content based on the blogId */}
        <div className="fade-in-700">
          <Markdown remarkPlugins={[remarkGfm]}>
            {datas ? datas.rawData : ""}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
