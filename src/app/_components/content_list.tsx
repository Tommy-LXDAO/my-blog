'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleCard from "./content";

export default function ContentList() {
  const [articles, setArticles] = useState<
    { id: number; title: string; excerpt: string }[]
  >([]);
  const router = useRouter()

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/mock/articles.json"); // 从 public 目录读取
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
      <div className="max-w-800 pl-20 pr-20 space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            onClick={() => router.push(`/article/${article.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
