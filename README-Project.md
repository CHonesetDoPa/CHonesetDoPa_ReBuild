# CH's HomePage (重构版)

基于原生 JavaScript 和 Vite 构建的现代交互式个人主页  
是重制版  

##  功能特性

- **高性能**: 基于 [Vite](https://vitejs.dev/) 构建，确保极速的开发体验和优化的生产环境构建。
- **国际化 (i18n)**: 内置多语言支持（目前支持中文、英文以及特色的 "Vampire" 语言）。
- **深色/浅色模式**: 支持自动检测系统主题，并提供手动切换开关。
- **动态链接管理**: 通过 JSON 文件集中配置社交媒体和推荐网站链接，易于维护。
- **打字特效**: 使用 `typed.js` 实现生动的打字机动画效果。
- **自定义光标**: 独特的交互式鼠标光标效果。
- **智能问候**: 基于时间段的自动问候系统。
- **预加载**: 集成 `instant.page` 实现链接预加载，提升页面跳转速度。

##  技术栈

- **核心**: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **构建工具**: Vite
- **依赖库**:
  - [Typed.js](https://github.com/mattboldt/typed.js/) (打字动画)
  - [SweetAlert](https://sweetalert.js.org/) (美化弹窗)
  - [FontAwesome](https://fontawesome.com/) (图标库)
  - [Instant.page](https://instant.page/) (链接预加载)

##  项目结构

```text
CHonesetDoPa_ReBuild/
├── public/                 # 静态资源目录
├── src/
│   ├── assets/             # 资源文件 (图片, 字体, 光标)
│   ├── config/             # 配置文件
│   │   ├── links.json      # 社交链接数据配置
│   │   └── i18n/           # 翻译文件 (en.json, zh.json 等)
│   ├── js/                 # 核心逻辑代码
│   │   ├── i18n-system.js      # 国际化逻辑
│   │   ├── dark-mode-manager.js # 主题模式管理
│   │   ├── link-manager.js     # 链接渲染逻辑
│   │   └── ...
│   ├── style/              # CSS 样式文件
│   ├── main.js             # 主入口文件
│   └── sponsor.js          # 赞助页入口文件
├── index.html              # 主页入口 HTML
├── sponsor.html            # 赞助页入口 HTML
└── vite.config.js          # Vite 配置文件
```

##  快速开始

### 前置要求

- Node.js (推荐最新的 LTS 版本)
- pnpm (推荐) 或 npm/yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/CHonesetDoPa/CHonesetDoPa_ReBuild.git

# 进入项目目录
cd CHonesetDoPa_ReBuild

# 安装依赖
pnpm install
```

### 开发模式

```bash

启动带有热重载功能的开发服务器：  
pnpm dev
访问地址：`http://localhost:5173`

### 构建生产版本  
构建用于生产环境的项目：  
pnpm build  
构建产物将输出到 `dist/` 目录。

### 预览  
在本地预览生产环境构建结果：  
pnpm preview  
```

##  配置指南

### 管理链接

编辑 `src/config/links.json` 文件即可更新您的社交媒体链接和推荐网站。该结构支持分类和单独的链接项配置。

### 添加新语言

1. 在 `src/config/i18n/` 目录下创建一个新的 JSON 文件（例如 `fr.json`）。
2. 更新 `src/js/i18n-system.js` 文件，在语言选择器中添加新的语言选项。

## 许可证

本项目采用 CC0-1.0 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

*Built By CH*
