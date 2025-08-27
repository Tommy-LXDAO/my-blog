// Item.tsx
import Image from "next/image";
import { motion } from "framer-motion";

export default function Item({ image, description, color }: { image: string; description: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}   // 初始状态（透明，稍微往下偏移）
      animate={{ opacity: 1, y: 0 }}    // 动画到（完全可见，回到正常位置）
      transition={{ duration: 0.5, ease: "easeOut" }} // 动画时间 & 曲线
      className="flex flex-col justify-center items-center h-60 w-48 rounded-2xl shadow-md hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ background: color }}
    >
      <div className="flex justify-center items-center h-28 w-28 bg-white/70 rounded-full mb-4 shadow-inner">
        <Image src={image} alt="category icon" width={80} height={80} />
      </div>
      <span className="text-lg font-semibold text-white tracking-wide hover:text-gray-200">
        {description}
      </span>
    </motion.div>
  );
}
