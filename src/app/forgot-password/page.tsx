'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { fetchApi } = useApi();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      // 调用修改密码API
      const response = await fetchApi('/auth/applyChangePassword', {
        method: 'POST',
        body: JSON.stringify({
          email: email
        })
      });
      
      // 解析响应数据
      const data = await response.json();
      
      // 检查结果
      if (data.result === true) {
        // 显示成功信息
        setMessage(data.msg || '如果该邮箱已注册，稍后会收到一封邮件');
      } else {
        // 显示错误信息
        setError(data.msg || '您输入的email有误');
      }
    } catch (err) {
      console.error('Request failed:', err);
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
            找回密码
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            输入您的邮箱地址，我们将发送一封邮件帮助您重置密码
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md border border-border">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm rounded-md">
              {message}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>发送中...</span>
                ) : (
                  <span>发送重置邮件</span>
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

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                返回登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
