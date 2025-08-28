'use client';
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    console.log(`header re-render`)
    return (
        <header className="h-10 w-dvw border-solid border-black dark:border-white border-b box-border flex justify-around">
        <div className="w-1/5 flex justify-center-safe items-center"><span className="">程序员小屋</span></div>
        <nav className="flex w-1/5 items-center justify-evenly">
          <div><button onClick={() => {router.push(`/`)}}>首页</button></div>
          <div><button onClick={() => {router.push(`/classification`)}}>分类</button></div>
          <div><button onClick={() => {router.push(`/article`)}}>文章</button></div>
          <div><button onClick={() => {router.push(`/`)}}>社区</button></div>
          <div><button onClick={() => {router.push(`/`)}}>友链</button></div>
          <div><button onClick={() => {router.push(`/`)}}>联系方式</button></div>
        </nav>
      </header>
    )
}