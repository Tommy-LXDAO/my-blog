// components/ArticleCard.tsx
'use client';

type Props = {
  title: string;
  excerpt: string;
  onClick?: () => void;
};

export default function ArticleCard({ title, excerpt, onClick }: Props) {
  return (
    <article
      className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition-shadow animate-fadeIn"
    >
      {/* 第一层：标题 */}
      <h2
        className="text-2xl md:text-3xl font-semibold underline underline-offset-4 cursor-pointer"
        onClick={onClick}
        title={title}
      >
        {title}
      </h2>

      {/* 第二层：节选 */}
      <p className="mt-2 text-gray-600 leading-relaxed clamp-2" title={excerpt}>
        {excerpt}
      </p>
    </article>
  );
}
