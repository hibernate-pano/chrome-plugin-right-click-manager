import { create } from 'zustand';
import { SearchEngineState, User } from '@/shared/types';
import * as storageService from '../services/storage';
import * as supabaseService from '../services/supabase';
import { mergeConfigurations } from '@/shared/utils';

interface SearchEngineStore extends SearchEngineState {
  initializeEngines: () => Promise<void>;
  syncWithCloud: (user: User) => Promise<boolean>;
  addEngine: (url: string, name: string) => Promise<void>;
  deleteEngine: (url: string) => Promise<void>;
  toggleEngine: (url: string, enabled: boolean) => Promise<void>;
  updateOrder: (newOrder: string[]) => Promise<void>;
  clearError: () => void;
}

export const useSearchEngineStore = create<SearchEngineStore>((set, get) => ({
  searchEngines: {},
  engineOrder: [],
  isLoading: false,
  error: null,
  
  initializeEngines: async () => {
    set({ isLoading: true });
    try {
      const { searchEngines, engineOrder } = await storageService.getSearchEngines();
      set({ searchEngines, engineOrder, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  syncWithCloud: async (user) => {
    set({ isLoading: true, error: null });
    try {
      // 获取本地配置
      const localConfig = await storageService.getAllConfig();
      
      // 获取云端配置
      const remoteConfig = await supabaseService.getUserConfig();
      
      // 合并配置
      const mergedConfig = mergeConfigurations(localConfig, remoteConfig || {});
      
      // 保存到本地
      await storageService.saveFullConfig(mergedConfig);
      
      // 保存到云端
      await supabaseService.saveUserConfig(user.id, mergedConfig);
      
      // 更新状态
      set({
        searchEngines: mergedConfig.searchEngines,
        engineOrder: mergedConfig.engineOrder,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return false;
    }
  },
  
  addEngine: async (url, name) => {
    set({ isLoading: true, error: null });
    try {
      await storageService.addSearchEngine(url, name);
      
      // 重新加载搜索引擎列表
      const { searchEngines, engineOrder } = await storageService.getSearchEngines();
      set({ searchEngines, engineOrder, isLoading: false });
      
      // 通知后台更新上下文菜单
      chrome.runtime.sendMessage({ type: 'updateContextMenus' });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  deleteEngine: async (url) => {
    set({ isLoading: true, error: null });
    try {
      await storageService.deleteSearchEngine(url);
      
      // 重新加载搜索引擎列表
      const { searchEngines, engineOrder } = await storageService.getSearchEngines();
      set({ searchEngines, engineOrder, isLoading: false });
      
      // 通知后台更新上下文菜单
      chrome.runtime.sendMessage({ type: 'updateContextMenus' });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  toggleEngine: async (url, enabled) => {
    set({ isLoading: true, error: null });
    try {
      await storageService.updateSearchEngineStatus(url, enabled);
      
      // 更新本地状态
      const { searchEngines } = get();
      const updatedEngines = { ...searchEngines };
      if (updatedEngines[url]) {
        updatedEngines[url].enabled = enabled;
      }
      set({ searchEngines: updatedEngines, isLoading: false });
      
      // 通知后台更新上下文菜单
      chrome.runtime.sendMessage({ type: 'updateContextMenus' });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  updateOrder: async (newOrder) => {
    set({ isLoading: true, error: null });
    try {
      await storageService.updateEngineOrder(newOrder);
      set({ engineOrder: newOrder, isLoading: false });
      
      // 通知后台更新上下文菜单
      chrome.runtime.sendMessage({ type: 'updateContextMenus' });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 