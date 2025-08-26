'use client';

import ArticleCard from "./content";

export default function ContentList() {
    return (
        <div className="flex justify-center">
          <div className="max-w-800 pl-20 pr-20">
            <ArticleCard
              title="程序员小屋：从零实现博客系统的踩坑与心得"
              excerpt="这是一段文章的节选内容，用于预览文章的主要信息。当文字超过两行时，会自动显示省略号，保持列表整洁美观，同时不影响阅读体验……"
              onClick={() => console.log('go to detail')}
            />
          </div>
        </div>
    )
}