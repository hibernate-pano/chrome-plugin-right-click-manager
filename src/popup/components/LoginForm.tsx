import React, { useState } from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { isValidEmail } from '@/shared/utils';
import QRCode from 'qrcode';
import { wechatLogin } from '../services/supabase';

const LoginForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wechat' | 'email'>('wechat');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  const { login, sendEmailCode, isLoading, error } = useAuthStore();
  
  // 切换登录方式
  const switchTab = (tab: 'wechat' | 'email') => {
    setActiveTab(tab);
  };
  
  // 生成微信登录二维码
  const generateWeChatQRCode = async () => {
    try {
      const url = await wechatLogin();
      
      // 生成二维码图片
      const dataUrl = await QRCode.toDataURL(url);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };
  
  // 发送验证码
  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      alert('请输入有效的邮箱地址');
      return;
    }
    
    const success = await sendEmailCode(email);
    
    if (success) {
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  // 邮箱登录
  const handleEmailLogin = async () => {
    if (!email || !code) {
      alert('请输入邮箱和验证码');
      return;
    }
    
    await login('email', email, code);
  };
  
  // 微信登录
  const handleWechatLogin = async () => {
    await generateWeChatQRCode();
  };
  
  return (
    <div className="space-y-4">
      {/* 登录方式选项卡 */}
      <div className="flex border-b border-border">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'wechat'
              ? 'text-primary border-b-2 border-primary'
              : 'text-disabled'
          }`}
          onClick={() => switchTab('wechat')}
        >
          微信登录
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === 'email'
              ? 'text-primary border-b-2 border-primary'
              : 'text-disabled'
          }`}
          onClick={() => switchTab('email')}
        >
          邮箱登录
        </button>
      </div>
      
      {/* 微信登录面板 */}
      {activeTab === 'wechat' && (
        <div className="flex flex-col items-center py-4">
          {qrCodeDataUrl ? (
            <img src={qrCodeDataUrl} alt="微信二维码" className="w-48 h-48" />
          ) : (
            <button
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50"
              onClick={handleWechatLogin}
              disabled={isLoading}
            >
              {isLoading ? '加载中...' : '微信扫码登录'}
            </button>
          )}
          {qrCodeDataUrl && <p className="mt-2 text-sm text-center">请使用微信扫码登录</p>}
        </div>
      )}
      
      {/* 邮箱登录面板 */}
      {activeTab === 'email' && (
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              className="w-full p-2 border border-border rounded-md text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="验证码"
              className="flex-1 p-2 border border-border rounded-md text-sm"
            />
            <button
              className="px-2 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-hover disabled:opacity-50"
              onClick={handleSendCode}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0 ? `${countdown}秒后重试` : '发送验证码'}
            </button>
          </div>
          <button
            className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-50"
            onClick={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </div>
      )}
      
      {/* 错误信息 */}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default LoginForm; 