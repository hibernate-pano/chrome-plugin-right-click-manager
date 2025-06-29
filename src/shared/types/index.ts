export interface SearchEngine {
  id: string;
  name: string;
  url: string;
  icon: string;
  isDefault: boolean;
}

export interface SearchEngines {
  [url: string]: SearchEngine;
}

export interface UserConfig {
  searchEngines: SearchEngines;
  engineOrder: string[];
}

export interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  avatar_url?: string;
}

export type LoginMethod = 'wechat' | 'email';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface SearchEngineState {
  searchEngines: SearchEngines;
  engineOrder: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SyncState {
  isSyncing: boolean;
  lastSynced: Date | null;
  syncError: string | null;
}

export type SearchEngineStore = {
  engines: SearchEngine[];
  isLoading: boolean;
  error: string | null;
  fetchEngines: () => Promise<void>;
  addEngine: (engine: SearchEngine) => Promise<void>;
  updateEngine: (engine: SearchEngine) => Promise<void>;
  deleteEngine: (id: string) => Promise<void>;
  setDefaultEngine: (id: string) => Promise<void>;
}; 