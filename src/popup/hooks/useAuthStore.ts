import { create } from 'zustand';
import { AuthState, User } from '@/shared/types';
import * as supabaseService from '../services/supabase';

interface AuthStore extends AuthState {
  login: (method: 'wechat' | 'email', email?: string, code?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<boolean>;
  sendEmailCode: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (method, email, code) => {
    set({ isLoading: true, error: null });
    try {
      let user: User | null = null;
      
      if (method === 'wechat') {
        // 微信登录逻辑在UI层处理，这里只返回二维码URL
        return true;
      } else if (method === 'email' && email && code) {
        // 邮箱验证码登录
        user = await supabaseService.verifyEmailCode(email, code);
      }
      
      if (user) {
        set({ user, isLoading: false });
        return true;
      } else {
        set({ error: '登录失败，请重试', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabaseService.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  checkLoginStatus: async () => {
    set({ isLoading: true });
    try {
      const user = await supabaseService.getCurrentUser();
      set({ user, isLoading: false });
      return !!user;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
  
  sendEmailCode: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const result = await supabaseService.sendVerificationCode(email);
      set({ isLoading: false });
      return result;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 