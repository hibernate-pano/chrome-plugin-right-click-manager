import { create } from 'zustand';
import { SearchEngine, SearchEngineStore } from '../../shared/types';
import { 
  getSearchEngines, 
  addSearchEngine as addEngineToStorage, 
  updateSearchEngine as updateEngineInStorage,
  deleteSearchEngine as deleteEngineFromStorage,
  reorderSearchEngines as reorderEnginesInStorage
} from '../services/storage';

export const useSearchEngineStore = create<SearchEngineStore>((set) => ({
  engines: [],
  isLoading: false,
  error: null,

  fetchEngines: async () => {
    set({ isLoading: true, error: null });
    try {
      const engines = await getSearchEngines();
      set({ engines, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取搜索引擎失败', 
        isLoading: false 
      });
    }
  },

  addEngine: async (engine: SearchEngine) => {
    set({ isLoading: true, error: null });
    try {
      // 生成唯一ID
      const newEngine = {
        ...engine,
        id: Date.now().toString()
      };
      const engines = await addEngineToStorage(newEngine);
      set({ engines, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '添加搜索引擎失败', 
        isLoading: false 
      });
    }
  },

  updateEngine: async (engine: SearchEngine) => {
    set({ isLoading: true, error: null });
    try {
      const engines = await updateEngineInStorage(engine);
      set({ engines, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '更新搜索引擎失败', 
        isLoading: false 
      });
    }
  },

  deleteEngine: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const engines = await deleteEngineFromStorage(id);
      set({ engines, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '删除搜索引擎失败', 
        isLoading: false 
      });
    }
  },

  reorderEngines: async (engineIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const engines = await reorderEnginesInStorage(engineIds);
      set({ engines, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '重新排序搜索引擎失败', 
        isLoading: false 
      });
    }
  }
})); 