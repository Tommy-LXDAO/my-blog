'use client';

import Item from "./_components/classification_item";

export default function Home() {
    return (
      <div className="flex justify-center p-10">
        <div className="flex gap-6 flex-wrap justify-center max-w-4xl">
          <Item image="/java-ar21.svg" description="Java" color="#60A5FA" />
          <Item image="/ISO_C++_Logo.svg" description="C++" color="#F97316" />
          <Item image="/html_css_javascript.png" description="前端" color="#111827" />
          <Item image="/next.svg" description="Next.js" color="#34D399" />
          <Item image="/next.svg" description="Next.js" color="#3B82F6" />
          <Item image="/next.svg" description="Next.js" color="#92400E" />
          <Item image="/next.svg" description="Next.js" color="#2563EB" />
          <Item image="/next.svg" description="Next.js" color="#9333EA" />
        </div>
      </div>
    )
}