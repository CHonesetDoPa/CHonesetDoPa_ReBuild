# CH's HomePage

基于原生 JavaScript 和 Vite 构建的轻量交互式个人主页，重构自原项目。

## 技术栈

- 核心: HTML5, CSS3, Vanilla JavaScript (ES Modules)
- 构建工具: Vite
- 主要依赖:
  - `typed.js` - 打字动画
  - `sweetalert` - 弹窗美化
  - `@fortawesome/fontawesome-free` - 图标
  - `instant.page` - 链接预加载

（详见 `package.json` 的 `dependencies`）

## 快速开始

### 前置要求

- Node.js（建议 LTS）
- pnpm（推荐），或 npm/yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/CHonesetDoPa/CHonesetDoPa.git
cd CHonesetDoPa

# 使用 pnpm 安装依赖（或 npm/yarn）
pnpm install
```

### 可用脚本（来自 `package.json`）

- `pnpm dev` — 启动开发服务器（Vite），默认地址 http://localhost:5173
- `pnpm build` — 构建生产包，输出到 `dist/`
- `pnpm preview` — 本地预览构建产物
- `pnpm clear` — 清理 `dist/`（脚本名为 `clear`）

示例：

```bash
pnpm dev
pnpm build
pnpm preview
```

## 配置指南

- 管理链接：编辑 `config/links.js`（这是一个导出链接数据的 JS 模块），页面会通过站点脚本读取并渲染。
- 语言文件：在 `config/i18n/` 下添加新的语言模块（例如 `fr.js`），模块应导出对应的翻译对象，然后在 `js/i18n-system.js` 或项目的国际化入口中注册该语言。
- 前端脚本：常见逻辑文件位于根目录 `js/`，页面入口脚本在 `src/` 下（`main.js`、`sponsor.js` 等）。

示例：添加新语言文件 `config/i18n/fr.js`：

```js
export default {
  welcome: 'Bonjour',
  // ...其它键
}
```

然后在国际化系统注册并在语言选择中添加该选项。

## 许可证

本项目主体采用 CC0-1.0（见 [LICENSE](LICENSE)）  
部分非源代码资源另见 [LICENSE-Personal.md](LICENSE-Personal.md)  

---

*Built By CH*
