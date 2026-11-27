# 文档站（website/）

G.影视 的静态文档站：首页、爬虫接入、配置字典、本地 API、App 功能、播放指令，共六页。Next.js 在构建时生成 HTML、CSS、JavaScript，成品是纯静态文件，部署后不需要 Node.js、Worker、数据库或登录。搜索、筛选、多语言示例切换与复制都在浏览器里完成。

文档内容基于上游 FongMi/TV 的公开指南整理，接口名、字段与功能说明与上游一致。

## 本地运行

需要 Node.js 22.18+（22.x）或 Node.js 24+。

```sh
cd website
npm ci
npm run dev
```

验证并预览真正的静态产物：

```sh
npm run lint
npm run build
npm start
```

`npm run build` 会构建静态站点并执行 TypeScript 类型检查。`npm start` 按 `.next/routes-manifest.json` 的构建路径提供 `out/` 里的文件，默认地址为 `http://localhost:3000/`；它不是正式部署用的服务器。请通过 HTTP 预览，不要直接双击 HTML。

只想检查类型、不做完整构建时，用 `npm run typecheck`；它会执行 `next typegen` 与 `tsc --noEmit`，不产生静态输出。

## GitHub Pages

站点源码在本仓库 `website/` 目录，用 Actions 自动部署，不需要另建仓库。

1. 在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 把 `website/` 的改动推送到 `fongmi` 分支，或在 Actions 里手动运行 **Publish website to GitHub Pages**。
3. 流程会安装依赖、执行 Lint、类型检查与静态构建，然后发布 `website/out/`。

构建产物不包含 Android 工程、`node_modules` 或本地环境文件；只改 App 代码不会触发站点发布。

流程通过 `actions/configure-pages` 取得部署地址，并用 `SITE_URL` 统一设置页面路径、Logo 与分享预览图，支持账号首页、项目子目录以及已在 Pages 里配置的自定义域名。

本地构建不会自动推送或发布；推送文档改动前，先确认差异里只有可以公开的内容。

### 指定部署地址

PowerShell 子目录测试：

```powershell
$env:SITE_URL = 'https://gongwenjia666.github.io/App_TVBox/'
npm run build
npm start
```

此时预览地址为 `http://localhost:3000/App_TVBox/`。`SITE_URL` 是构建期变量，`npm start` 会自动沿用构建结果里的路径，无需再设。更换域名或路径要重新构建并重启预览。测完后用 `Remove-Item Env:SITE_URL` 清除。

## 目录说明

- `app/`：页面、共用组件、文档字段与搜索索引。
- `app/globals.css`：样式与响应式规则。
- `public/`：SVG Logo、社交预览图与 `.nojekyll`。
- `../.github/workflows/pages.yml`：仓库根目录的 Pages 构建与发布流程。
- `app/local/page.tsx`、`app/local-api.ts`：本地 HTTP API 文档与示例，按源码逐项核对过。
- `app/commands/page.tsx`、`app/playback-commands.ts`：Exo 播放指令、按钮设置与示例，按 `ExoCommand` 核对过支持语法、数值范围与限制。

参考：[Next.js 静态导出](https://nextjs.org/docs/app/guides/static-exports)、[GitHub Pages 自定义流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
