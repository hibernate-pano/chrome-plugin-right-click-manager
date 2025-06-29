import { createClient } from '@supabase/supabase-js';
import { User, UserConfig } from '@/shared/types';

// 从环境变量获取Supabase配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 获取当前登录用户
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * 微信登录
 */
export async function wechatLogin(): Promise<string> {
  const wechatAppId = import.meta.env.VITE_WECHAT_APP_ID;
  const redirectUri = import.meta.env.VITE_WECHAT_REDIRECT_URI;
  const state = Math.random().toString(36).substring(7);
  
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${wechatAppId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=snsapi_login&state=${state}`;
}

/**
 * 发送邮箱验证码
 */
export async function sendVerificationCode(email: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return false;
  }
}

/**
 * 邮箱验证码登录
 */
export async function verifyEmailCode(email: string, code: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error verifying email code:', error);
    return null;
  }
}

/**
 * 退出登录
 */
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

/**
 * 获取用户配置
 */
export async function getUserConfig(): Promise<Partial<UserConfig> | null> {
  try {
    const { data, error } = await supabase
      .from('user_configs')
      .select('config')
      .single();

    if (error) throw error;
    return data?.config || null;
  } catch (error) {
    console.error('Error getting user config:', error);
    return null;
  }
}

/**
 * 保存用户配置
 */
export async function saveUserConfig(userId: string, config: UserConfig): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_configs').upsert({
      user_id: userId,
      config,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving user config:', error);
    return false;
  }
} 