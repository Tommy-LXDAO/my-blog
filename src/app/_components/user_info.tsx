'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserInfo {
  id: string;
  userName: string;
  email: string;
  avatarFileId: string;
}

export default function UserInfo() {
  const router = useRouter();
 const { fetchApi } = useApi();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      const fetchUserInfo = async () => {
        try {
          const response = await fetchApi('/auth/user_info');
          
          if (response.status === 401) {
            // Token无效，清除localStorage中的token
            localStorage.removeItem('token');
            setUserInfo(null);
          } else if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
          } else {
            // 其他错误
            localStorage.removeItem('token');
            setUserInfo(null);
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          // 出错时也清除token
          localStorage.removeItem('token');
          setUserInfo(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserInfo();
    };

    // 初始检查
    checkToken();

    // 监听自定义事件
    const handleTokenChanged = () => {
      setLoading(true);
      checkToken();
    };

    window.addEventListener('tokenChanged', handleTokenChanged);

    // 清理事件监听器
    return () => {
      window.removeEventListener('tokenChanged', handleTokenChanged);
    };
  }, [fetchApi]);

  const handleLogout = () => {
    console.log("handleLogout trigged")
    // 清除localStorage中的token
    localStorage.removeItem('token');
    // 重置用户信息
    setUserInfo(null);
    // 刷新页面以确保状态更新
    router.refresh();
  };

  if (loading) {
    return <div className="flex items-center">加载中...</div>;
  }

 if (userInfo) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-1">
              <span>欢迎, {userInfo.userName}!</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/reset-password')}>
              重置密码
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/articles?myArticles=true')}>
              查看我的文章
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              退出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" className="bg-blue-300 hover:cursor-pointer" onClick={() => router.push('/login')}>登录</Button>
      <Button variant="ghost" className="bg-orange-300 hover:cursor-pointer" onClick={() => router.push('/register')}>注册</Button>
    </div>
  );
}
