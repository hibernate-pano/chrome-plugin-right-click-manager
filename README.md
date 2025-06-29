# Right Click Searcher

一个强大的 Chrome 浏览器扩展，让您能够快速使用不同的搜索引擎搜索选中的文本。

## 功能特性

- 🔍 支持多个搜索引擎的快速切换
- 🎯 右键菜单快速搜索选中文本
- ⚙️ 自定义搜索引擎配置
- 🔄 云端配置同步
- 👤 支持用户账户系统
- 📱 微信扫码登录
- �� 邮箱验证码登录

## 安装说明

### 从源码安装

1. 克隆项目代码
   ```
   git clone https://github.com/yourusername/chrome-plugin-right-click-manager.git
   cd chrome-plugin-right-click-manager
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 构建项目
   ```
   npm run build
   ```

4. 在Chrome浏览器中加载扩展
   - 打开 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 文件夹

### 开发模式

1. 启动开发服务器
   ```
   npm run dev
   ```

2. 在Chrome浏览器中加载扩展
   - 打开 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 文件夹

## 使用方法

1. **基本使用**

   - 选中网页上的任意文本
   - 右键点击，选择 "Search with..."
   - 从弹出的子菜单中选择想要使用的搜索引擎

2. **自定义搜索引擎**

   - 点击浏览器工具栏中的扩展图标
   - 在弹出的设置面板中添加、编辑或删除搜索引擎
   - 可以调整搜索引擎的显示顺序

3. **账户功能**
   - 支持邮箱验证码登录
   - 支持微信扫码登录
   - 登录后可以跨设备同步搜索引擎配置

## 技术架构

- 前端：React + TypeScript + Tailwind CSS
- 构建工具：Vite + CRXJS
- 状态管理：Zustand
- 存储：Chrome Storage API
- 后端：Supabase
- 认证：邮箱验证码 + 微信扫码登录

## 默认搜索引擎

插件预置了多个常用搜索引擎，包括：

- Google
- Baidu
- DuckDuckGo
- Bing
- Perplexity
- ChatGPT
- Claude AI
- 等其他搜索引擎

用户可以根据需要自行添加、删除或修改搜索引擎。

## 数据同步

- 用户配置数据存储在 Chrome 本地存储中
- 登录后的用户可以将配置同步到云端
- 支持多设备之间的配置同步

## 隐私说明

- 插件不会收集用户的搜索内容
- 仅在用户主动登录后同步配置数据
- 所有数据传输采用安全加密方式

## 项目结构

```
├── public/              # 静态资源
│   └── images/          # 图标资源
├── src/                 # 源代码
│   ├── background/      # 后台服务
│   │   └── index.ts    # 后台服务入口
│   ├── popup/           # 弹出窗口
│   │   ├── components/  # UI组件
│   │   ├── hooks/       # 自定义Hooks
│   │   └── services/    # API服务
│   └── shared/          # 共享代码
│       └── types/       # 类型定义
├── .env                 # 环境变量
├── manifest.json        # 插件配置
└── package.json         # 项目依赖
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License

## 更新日志

### v2.0.0

- 使用React + TypeScript重构整个项目
- 采用Vite作为构建工具
- 使用Tailwind CSS优化UI
- 引入Zustand进行状态管理
- 改进错误处理和用户体验

### v1.1.0

- 添加用户账户系统
- 支持配置云端同步
- 新增微信登录功能

### v1.0.0

- 初始版本发布
- 支持基本的右键搜索功能
- 支持自定义搜索引擎
