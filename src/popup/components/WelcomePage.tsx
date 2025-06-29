import React from 'react';
import { APP_NAME, APP_VERSION } from '../../shared/constants';

const WelcomePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{APP_NAME}</h1>
        <p className="text-sm text-gray-500">版本 {APP_VERSION}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-blue-800">欢迎使用！</h2>
          <p className="mt-2 text-sm text-blue-700">
            感谢您安装 {APP_NAME}，这是一个帮助您快速搜索选中文本的工具。
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">如何使用：</h3>
          <ol className="mt-2 space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>在网页上<strong>选中任意文本</strong></li>
            <li><strong>右键点击</strong>选中的文本</li>
            <li>从菜单中选择<strong>"使用搜索引擎搜索"</strong></li>
            <li>选择您想要使用的搜索引擎</li>
          </ol>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">功能亮点：</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>添加自定义搜索引擎</li>
            <li>设置默认搜索引擎</li>
            <li>拖拽排序搜索引擎</li>
            <li>一键删除不需要的搜索引擎</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700">开始使用：</h3>
          <p className="mt-2 text-sm text-gray-600">
            点击扩展图标可以管理您的搜索引擎列表。我们已经预设了几个常用的搜索引擎供您使用。
          </p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          开始使用
        </button>
      </div>
    </div>
  );
};

export default WelcomePage; 