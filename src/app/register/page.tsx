'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

export default function RegisterPage() {
  const router = useRouter();
  const { fetchApi } = useApi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (password !== confirmPassword) {
      setError('密码不匹配');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 调用注册API
      const response = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          username: email,
          password: password
        })
      });
      
      // 解析响应数据
      const data = await response.json();
      
      // 检查注册结果
      if (data.result === false) {
        // 处理注册失败，显示failureMsg
        setError(data.failureMsg || '注册失败，请重试');
        return;
      }
      
      // 注册成功后的逻辑
      console.log('Register successful:', data);
      
      // 注册成功后重定向到登录页面
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Register failed:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            创建账户
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            填写以下信息以创建您的账户
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                姓名
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                邮箱地址
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                密码
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                确认密码
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>注册中...</span>
                ) : (
                  <span>注册</span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  或者
                </span>
              </div>
            </div>

            {/* <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button variant="outline" className="w-full">
                  <span>GitHub</span>
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <span>Google</span>
                </Button>
              </div>
            </div> */}
          
            <div className="mt-6 text-center text-sm text-muted-foreground">
              已有账户?{' '}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
