// components/ArticleCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';

type Props = {
  id: number; // 添加文章ID
  title: string;
 excerpt: string;
 onClick?: () => void;
  showActions?: boolean; // 是否显示操作按钮
  isPrivate?: boolean; // 是否为私有文章
};

export default function ArticleCard({ id, title, excerpt, onClick, showActions = false, isPrivate = false }: Props) {
  const router = useRouter();
  const { fetchApi } = useApi();

  const handleEdit = () => {
    // 跳转到编辑页面，需要创建一个编辑页面或复用创建文章页面
    router.push(`/create-article?id=${id}&edit=true`);
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('请先登录');
        router.push('/login');
        return;
      }

      const response = await fetchApi(`/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`删除失败: ${response.status} ${response.statusText}`);
      }

      // 删除成功后刷新页面
      router.refresh();
    } catch (error) {
      console.error('删除文章失败:', error);
      alert(`删除失败: ${(error as Error).message}`);
    }
 };

  return (
    <article
      className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow animate-fadeIn text-center"
    >
      {/* 第一层：标题 */}
      <h2
        className="text-2xl md:text-3xl font-semibold underline underline-offset-4 cursor-pointer text-blue-500"
        onClick={onClick}
        title={title}
      >
        {title}
      </h2>

      {/* 第二层：节选 */}
      <p className="mt-2 text-gray-600 leading-relaxed clamp-2" title={excerpt}>
        {excerpt}
      </p>

      {/* 第三层：操作按钮 - 仅在showActions为true时显示 */}
      {showActions && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // 防止点击事件冒泡到父元素
              handleEdit();
            }}
          >
            编辑
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // 防止点击事件冒泡到父元素
              handleDelete();
            }}
          >
            删除
          </Button>
        </div>
      )}
    </article>
  );
}
