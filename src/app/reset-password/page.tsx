'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { JSEncrypt } from 'jsencrypt';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchApi } = useApi();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [userId, setUserId] = useState('');
  const [authToken, setAuthToken] = useState('');

  // 获取URL参数
  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    const authTokenParam = searchParams.get('auth_token');
    
    if (userIdParam && authTokenParam) {
      setUserId(userIdParam);
      setAuthToken(authTokenParam);
    } else {
      setError('缺少必要的参数');
    }
  }, [searchParams]);

  // 页面加载时获取RSA公钥
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await fetchApi('/auth/rsa_public_key');
        // 直接获取响应文本，因为返回的是公钥字符串而不是JSON
        const publicKeyText = await response.text();
        setPublicKey(publicKeyText);
      } catch (err) {
        console.error('Failed to fetch public key:', err);
        setError('获取加密密钥失败');
      }
    };

    fetchPublicKey();
  }, [fetchApi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (newPassword !== confirmPassword) {
      setError('密码不匹配');
      return;
    }
    
    if (!userId || !authToken) {
      setError('缺少必要的参数');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      // 使用RSA公钥加密新密码
      let encryptedPassword = newPassword;
      if (publicKey) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const result = encrypt.encrypt(newPassword);
        if (result === false) {
          // 直接中断操作，增加提示
          setError('密码加密失败，请稍后重试');
          setIsLoading(false);
          return;
        }
        encryptedPassword = result;
      }
      
      // 调用重置密码API
      const response = await fetchApi(`/auth/changePassword?userId=${userId}&auth_token=${authToken}`, {
        method: 'POST',
        body: JSON.stringify({
          newPassword: encryptedPassword
        })
      });
      
      // 解析响应数据
      const data = await response.json();
      
      // 检查结果
      if (data.success === true) {
        // 显示成功信息并跳转到登录页面
        setMessage('密码修改成功');
        setTimeout(() => {
          router.push('/login');
        }, 200);
      } else {
        // 显示错误信息
        setError(data.message || '密码重置失败');
      }
    } catch (err) {
      console.error('Request failed:', err);
      // 检查是否是401错误
      // 由于我们使用的是自定义的fetchApi，错误对象可能没有response属性
      // 我们需要检查错误信息来判断是否是401错误
      if (err instanceof Error) {
        // 如果错误信息包含401或Token无效相关的内容
        if (err.message.includes('401') || err.message.includes('Token')) {
          setError('Token无效');
        } else {
          setError('网络错误，请稍后重试');
        }
      } else {
        setError('网络错误，请稍后重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            重置密码
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            请输入您的新密码
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                新密码
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                确认新密码
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
                  <span>重置中...</span>
                ) : (
                  <span>重置密码</span>
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
