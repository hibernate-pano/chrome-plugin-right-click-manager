# Right Click Searcher

一个Chrome扩展，允许用户通过右键菜单使用不同搜索引擎搜索选中的文本。

## 功能

- 使用右键菜单通过各种搜索引擎搜索选中的文本
- 添加、编辑和删除自定义搜索引擎
- 设置默认搜索引擎
- 自动获取网站图标
- 所有数据保存在本地，无需云同步

## 技术栈

- TypeScript
- React
- Vite
- Zustand (状态管理)
- Tailwind CSS (样式)
- Chrome Extension API

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建扩展

```bash
npm run build
```

构建后的文件将位于 `dist` 目录中。

## 安装扩展

1. 打开 Chrome 浏览器，导航到 `chrome://extensions/`
2. 开启开发者模式
3. 点击 "加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

## 使用方法

1. 在网页上选中文本
2. 右键点击，选择 "使用搜索引擎搜索"
3. 从子菜单中选择要使用的搜索引擎
4. 点击扩展图标可以管理搜索引擎列表

## 项目结构

```
├── public/              # 静态资源
│   └── images/          # 图标资源
├── src/                 # 源代码
│   ├── background/      # 后台服务
│   │   └── index.ts     # 后台服务入口
│   ├── popup/           # 弹出窗口
│   │   ├── components/  # UI组件
│   │   ├── hooks/       # 自定义Hooks
│   │   └── services/    # API服务
│   └── shared/          # 共享代码
│       └── types/       # 类型定义
├── manifest.json        # 插件配置
└── package.json         # 项目依赖
```

## 更新日志

### v2.0.0

- 使用React + TypeScript重构整个项目
- 采用Vite作为构建工具
- 使用Tailwind CSS优化UI
- 引入Zustand进行状态管理
- 移除了Supabase依赖和登录相关功能
- 简化了数据存储，现在仅使用Chrome存储API
- 添加了设置默认搜索引擎功能

### v1.0.0

- 初始版本发布
- 支持基本的右键搜索功能
- 支持自定义搜索引擎

## 许可证

MIT License
