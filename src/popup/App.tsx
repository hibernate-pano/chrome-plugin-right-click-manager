import React, { useEffect, useState } from 'react';
import { useAuthStore } from './hooks/useAuthStore';
import { useSearchEngineStore } from './hooks/useSearchEngineStore';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import SearchEngineList from './components/SearchEngineList';
import AddEngineForm from './components/AddEngineForm';

const App: React.FC = () => {
  const { user, checkLoginStatus, isLoading: authLoading } = useAuthStore();
  const {
    searchEngines,
    engineOrder,
    initializeEngines,
    addEngine,
    deleteEngine,
    toggleEngine,
    isLoading: engineLoading,
  } = useSearchEngineStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);
  
  // 检查登录状态并初始化搜索引擎
  useEffect(() => {
    const init = async () => {
      await checkLoginStatus();
      await initializeEngines();
    };
    
    init();
  }, []);
  
  // 显示通知
  const showNotification = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // 添加搜索引擎
  const handleAddEngine = async (url: string, name: string) => {
    try {
      await addEngine(url, name);
      setShowAddForm(false);
      showNotification(`已添加搜索引擎: ${name}`, 'success');
    } catch (error) {
      showNotification(`添加失败: ${(error as Error).message}`, 'error');
    }
  };
  
  // 删除搜索引擎
  const handleDeleteEngine = async (url: string) => {
    try {
      await deleteEngine(url);
      showNotification('已删除搜索引擎', 'info');
    } catch (error) {
      showNotification(`删除失败: ${(error as Error).message}`, 'error');
    }
  };
  
  // 切换搜索引擎状态
  const handleToggleEngine = async (url: string, enabled: boolean) => {
    try {
      await toggleEngine(url, enabled);
    } catch (error) {
      showNotification(`操作失败: ${(error as Error).message}`, 'error');
    }
  };
  
  const isLoading = authLoading || engineLoading;
  
  return (
    <div className="p-4">
      <h1 className="text-lg font-medium mb-4">Right Click Searcher</h1>
      
      {/* 用户区域 */}
      {user ? <UserProfile user={user} /> : <LoginForm />}
      
      {/* 搜索引擎区域 */}
      <div className="mt-4">
        <h2 className="text-sm font-medium text-disabled uppercase tracking-wider mb-2">
          搜索引擎
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <SearchEngineList
              searchEngines={searchEngines}
              engineOrder={engineOrder}
              onToggle={handleToggleEngine}
              onDelete={handleDeleteEngine}
            />
            
            {showAddForm ? (
              <AddEngineForm
                onAdd={handleAddEngine}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <button
                className="mt-3 w-full py-2 text-sm bg-transparent text-primary hover:bg-background-hover rounded-md border border-primary"
                onClick={() => setShowAddForm(true)}
              >
                添加自定义搜索引擎
              </button>
            )}
          </>
        )}
      </div>
      
      {/* 通知 */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App; 