'use client';
import GithubIcon from "./_components/githubsvg";

export default function Home() {
  return (
    <div>
      <div className="h-40 flex justify-center items-center">
        <span className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg tracking-wide">程序员小屋</span>
      </div>
      <div className="h-10 flex flex-col justify-center items-center">
        <GithubIcon />
        <span className="block">contact me</span>
      </div>
    </div>
  );
}
