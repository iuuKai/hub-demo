# apps/ck-notes — 成考专升本备考资料库

Vue 3 + TypeScript + Vite 构建的成人高考专升本备考资料阅读器，支持 Web 与移动端（mb）响应式布局。

内容源在 `content/ck-notes`（monorepo 根目录），通过 sync 脚本拷贝到本目录的 `.temp-content/`（不参与提交），dev 时由 Vite 插件按 `/ck-notes/*` 伺服，build 时随 `dist/` 一起产出。

## 功能

- **讲义（classes）**：每日课程，每章节同时有 HTML 与 PNG 两种形态
  - HTML：iframe 渲染（保持原页面样式与 MathJax 公式）
  - 图片：支持「滚动」（IntersectionObserver 懒加载，进入可视区域附近才加载）与「翻页」（一次一页，键盘 ←/→ 或按钮切换）
  - 按科目（政治 / 英语 / 高数二）切换，章节按「第 N 天」选择
- **错题集（mistakes）**：按科目渲染对应 HTML（只读）
- **考试大纲（outlines）**：按科目渲染对应 HTML（只读）
- **背诵要点（recites）**：目前为空，未接入

## 开发

```bash
# 在仓库根目录先安装依赖
pnpm install

# 开发（自动 sync 内容 + 启动 vite，端口 5175，访问 http://localhost:5175/ck-notes/）
pnpm --filter @hub/ck-notes dev

# 构建（sync + vue-tsc 类型检查 + vite build，产物含学习资料静态资源）
pnpm --filter @hub/ck-notes build

# 仅同步内容并生成索引（.temp-content/notes-index.json）
pnpm --filter @hub/ck-notes sync
```

## 构建产物与部署

- `dist/index.html` + `dist/assets/*`：应用本体
- `dist/classes|mistakes|outlines|images/*`：学习资料静态资源（含 `dist/notes-index.json` 索引）
- `vercel.json` 已配置 `/ck-notes` 路由：带扩展名请求指向对应静态文件，其余回退到 `index.html`
- `turbo.json`：无需改动；本包通过 `package.json` 的 `turbo.build.inputs` 把 `content/ck-notes/**` 纳入构建缓存指纹，内容变更会触发重新构建

## 目录结构

```
apps/ck-notes
├── content-plugin.ts      # Vite 插件：dev 伺服 + build 拷贝内容到 dist
├── scripts/gen-index.cjs  # 扫描 .temp-content 生成 notes-index.json
├── src
│   ├── components/        # FeatureTabs / SubjectBar / ChapterPicker / ClassView / DocView / HtmlViewer / ImageViewer
│   ├── composables/       # useNotesStore（索引加载 + 状态 + localStorage 记忆）
│   └── data/types.ts      # 索引类型定义
```
