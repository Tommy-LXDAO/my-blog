'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleCard from "./content";
import { useApi } from "../../hooks/useApi"

export default function ContentList() {
  const [articles, setArticles] = useState<
    { id: number; title: string; introduction: string }[]
  >([]);
  const router = useRouter()

  const { fetchApi } = useApi();

   useEffect(() => {
    async function fetchArticles() {
      try {
        // const res = await fetchApi("/mock/articles.json"); // 从 public 目录读取
        // 改为POST请求，参数为offset、limit和isPrivate
        const res = await fetchApi("/articles/list", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset: 0,
            limit: 10, // 可以根据需要调整limit值
            isPrivate: false, // 默认为false
          }),
        });
        if (!res.ok) throw new Error("加载失败");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("获取文章失败:", err);
      }
    }

    fetchArticles();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-80 pl-20 pr-20 space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.introduction}
            onClick={() => router.push(`/article/${article.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
