'use client';
import GithubIcon from "./_components/githubsvg";
import ContentList from "./_components/content_list";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="h-40 flex justify-center items-center">
        <span className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-wide">极客园地</span>
      </div>
      {/* <div className="h-40 flex justify-center items-center">
        <img src="/Image.png" className="h-40" alt="Image" />
      </div> */}
      <div className="flex flex-col justify-center items-center border-b-20 border-transparent h-20">
        <GithubIcon />
        <span className="block">contact me</span>
      </div>
      {/* 内容区域，具有最大宽度，通过弹性布局，每一行展示两个格子，每个格子展示两个 */}
      <ContentList />
    </div>
  );
}
