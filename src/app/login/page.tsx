'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { JSEncrypt } from 'jsencrypt';

export default function LoginPage() {
  const router = useRouter();
  const { fetchApi } = useApi();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicKey, setPublicKey] = useState('');

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
    setIsLoading(true);
    setError('');
    
    // 获取email和password的值
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    
    try {
      // 使用RSA公钥加密密码
      let encryptedPassword = password;
      if (publicKey) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const result = encrypt.encrypt(password);
        if (result === false) {
          // 直接中断登录，增加提示
          setError('密码加密失败，请稍后重试');
          setIsLoading(false);
          return;
        }
        encryptedPassword = result;
      }
      
      // 调用登录API
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: email,
          password: encryptedPassword
        })
      });
      
      // 解析响应数据
      const data = await response.json();
      
      // 检查登录结果
      if (data.result === false) {
        // 处理登录失败，显示failureMsg
        setError(data.failureMsg || '登录失败，请检查您的凭据');
        return;
      }
      
      // 登录成功后的逻辑
      console.log('Login successful:', data);
      
      // 保存token到localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // 登录成功后重定向到首页
      router.push('/');
      // 触发自定义事件通知user_info组件重新检查token
      window.dispatchEvent(new CustomEvent('tokenChanged'));
    } catch (err) {
      console.error('Login failed:', err);
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
            登录到您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            请输入您的凭据以访问您的账户
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
                  ref={emailRef}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  密码
                </label>
                <div className="text-sm">
                  <Link href="#" className="font-medium text-primary hover:text-primary/80">
                    忘记密码?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  ref={passwordRef}
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !publicKey}
              >
                {isLoading ? (
                  <span>登录中...</span>
                ) : (
                  <span>登录</span>
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
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            还没有账户?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
