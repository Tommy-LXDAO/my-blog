'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import ArticleCard from '@/app/_components/content';

interface Article {
  id: number;
  title: string;
 introduction: string;
 category?: string; // 假设文章有分类字段
}

interface Category {
  id: string;
  name: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchApi } = useApi();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 检查URL参数来确定是否查看我的文章
 const isMyArticles = searchParams.get('myArticles') === 'true';

  // 模拟分类数据，实际项目中应该从API获取
  useEffect(() => {
    // 模拟获取分类数据
    const mockCategories: Category[] = [
      { id: 'all', name: '全部' },
      { id: 'java', name: 'Java' },
      { id: 'cpp', name: 'C++' },
      { id: 'frontend', name: '前端' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'react', name: 'React' },
      { id: 'nodejs', name: 'Node.js' },
      { id: 'python', name: 'Python' },
    ];
    setCategories(mockCategories);
    setSelectedCategory('all');
  }, []);

  // 获取文章列表
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetchApi("/articles/list", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset: 0,
            limit: 50, // 可以根据需要调整limit值
            isPrivate: isMyArticles, // 根据URL参数确定是否获取私有文章
          }),
        });
        if (!res.ok) throw new Error("加载失败");
        const data = await res.json();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error("获取文章失败:", err);
      }
    };

    fetchArticles();
  }, [isMyArticles]);

  // 根据分类和搜索词过滤文章
 useEffect(() => {
    let result = articles;

    // 按分类过滤
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(article => 
        article.category && article.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // 按搜索词过滤
    if (searchTerm) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.introduction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(result);
  }, [selectedCategory, searchTerm, articles]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <h1 className="text-3xl font-bold text-center mb-8">博客文章</h1>

        {/* 分类筛选区域 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">分类</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">搜索</h2>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="搜索文章标题或内容..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* 文章列表 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory && selectedCategory !== 'all' 
              ? `${categories.find(c => c.id === selectedCategory)?.name}文章` 
              : '全部文章'}
            <span className="text-gray-500 text-base font-normal ml-2">({filteredArticles.length} 篇)</span>
          </h2>
          
          {filteredArticles.length > 0 ? (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.introduction}
                  onClick={() => router.push(`/article/${article.id}`)}
                  showActions={isMyArticles} // 仅在我的文章页面显示操作按钮
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到相关文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
