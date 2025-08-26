'use client';
import Image from "next/image";

export default function Item({image, description, color}) {
  return (
    <div className="flex flex-col justify-center items-center h-40 w-15 rounded-xl border-transparent" style={{
        color: color
    }}>
        <Image src={image} alt="category icon" width={10} height={10}/>
        <span>{description}</span>
    </div>
  )
}