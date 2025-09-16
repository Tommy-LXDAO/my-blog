'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode_toggle";
import UserInfo from "./user_info";

export default function Header() {
    const router = useRouter();
    return (
        <header className="h-10 w-dvw border-solid border-black border-b box-border flex justify-around">
        <div className="w-1/5 flex justify-center-safe items-center">
            <div className="h-5">
                <Image src='/Icon_laptop_code.png' height={10} width={24} alt="Icon"/>
            </div>
            <div className=""><span className="">极客园地</span></div>
        </div>
        <nav className="flex w-1/3 items-center justify-evenly">
          <ModeToggle />
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/`)}}>首页</button></div>
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/classification`)}}>分类</button></div>
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/article`)}}>博客</button></div>
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/create-article`)}}>创建文章</button></div>
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/community`)}}>社区</button></div>
          <div><button className='hover:cursor-pointer' onClick={() => {router.push(`/`)}}>好朋友们</button></div>
          <div><UserInfo /></div>
        </nav>
      </header>
    )
}
