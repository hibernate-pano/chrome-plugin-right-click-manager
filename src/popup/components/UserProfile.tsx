import React from 'react';
import { User } from '@/shared/types';
import { useAuthStore } from '../hooks/useAuthStore';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const { logout } = useAuthStore();
  const { syncWithCloud } = useSearchEngineStore();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const handleSync = async () => {
    await syncWithCloud(user);
  };
  
  return (
    <div className="flex flex-col items-center p-3 border-b border-border mb-3">
      <div className="flex items-center w-full mb-3">
        <img
          src={user.avatar_url || 'https://via.placeholder.com/40'}
          alt="用户头像"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <p className="text-sm font-medium">{user.user_metadata?.full_name || '用户'}</p>
          <p className="text-xs text-disabled">{user.email || '未设置邮箱'}</p>
        </div>
      </div>
      
      <div className="flex w-full space-x-2">
        <button
          onClick={handleSync}
          className="flex-1 py-1.5 text-xs bg-primary text-white hover:bg-primary-hover rounded-md"
        >
          同步配置
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 py-1.5 text-xs bg-transparent text-primary hover:bg-background-hover rounded-md border border-primary"
        >
          退出登录
        </button>
      </div>
    </div>
  );
};

export default UserProfile; 