'use client';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
    const router = useRouter();
    return (
        <header className="h-10 w-dvw border-solid border-black border-b box-border flex justify-around">
        <div className="w-1/5 flex justify-center-safe items-center">
            <div className="h-5">
                <Image src='/Icon_laptop_code.png' height={10} width={24} alt="Icon"/>
            </div>
            <div className=""><span className="">GeekSphere</span></div>
        </div>
        <nav className="flex w-1/5 items-center justify-evenly">
          <div><button onClick={() => {router.push(`/`)}}>Home</button></div>
          <div><button onClick={() => {router.push(`/classification`)}}>Blog</button></div>
          <div><button onClick={() => {router.push(`/article`)}}>Community</button></div>
          {/* <div><button onClick={() => {router.push(`/`)}}>社区</button></div> */}
          <div><button onClick={() => {router.push(`/`)}}>Friends</button></div>
          {/* <div><button onClick={() => {router.push(`/`)}}>联系方式</button></div> */}
        </nav>
      </header>
    )
}