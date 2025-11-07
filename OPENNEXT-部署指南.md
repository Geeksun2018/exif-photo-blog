# 🚀 OpenNext Cloudflare 部署指南

**更新时间**: 2025-11-07  
**状态**: ✅ 代码已推送到 cloudflare-pages 分支

---

## ✅ 已完成的工作

1. ✅ 卸载了已弃用的 `@cloudflare/next-on-pages`
2. ✅ 安装了 `@opennextjs/cloudflare` (支持 Next.js 16)
3. ✅ 创建了 `open-next.config.ts` 配置文件
4. ✅ 更新了构建脚本
5. ✅ 推送到 GitHub

---

## 🔧 需要在 Cloudflare Dashboard 更新的配置

### 第一步：删除之前失败的部署（如果有）

1. 访问 Cloudflare Dashboard
2. Workers & Pages → 找到您刚创建的项目
3. Settings → 删除项目（或者继续使用，重新配置）

### 第二步：更新构建配置

如果项目还在，更新构建设置：

1. 进入项目 → **Settings** → **Builds & deployments**
2. 点击 **Configure Production deployments**

#### 重要：更新构建命令

**旧的构建命令**（删除）：
```bash
pnpm install && pnpm build && npx @cloudflare/next-on-pages
```

**新的构建命令**（使用这个）：
```bash
pnpm install && pnpm build && pnpm pages:build
```

#### 更新输出目录

**Build output directory**:
```
.worker-next
```

（从 `.vercel/output/static` 改成 `.worker-next`）

### 第三步：触发重新部署

1. 点击 **Save**
2. 进入 **Deployments** 标签
3. 点击 **Retry deployment** 或 **Create deployment**
4. 选择分支：`cloudflare-pages`

---

## 🆕 或者重新创建项目（推荐）

如果之前的项目配置太乱，可以重新创建：

### 1. 访问 Cloudflare Dashboard

🔗 https://dash.cloudflare.com

### 2. 创建新 Pages 项目

Workers & Pages → Create → Pages → Connect to Git

### 3. 选择仓库和分支

- 仓库：`exif-photo-blog`
- 分支：**cloudflare-pages** ⚠️

### 4. 配置构建设置

```
Project name: exif-photo-blog

Framework preset: Next.js

Build command:
pnpm install && pnpm build && pnpm pages:build

Build output directory:
.worker-next

Root directory: (留空)
```

### 5. 添加环境变量

**重要环境变量**（从之前保存的列表复制）：

```env
NODE_VERSION=18.17.0
POSTGRES_URL=你的数据库连接
AUTH_SECRET=你的密钥
AUTH_URL=https://exif-photo-blog-8df.pages.dev
NEXT_PUBLIC_PLATFORM=cloudflare

# 其他所有从 Vercel 复制的环境变量...
```

### 6. 部署！

点击 **Save and Deploy**

---

## 🎯 OpenNext vs 旧适配器的区别

| 特性 | @cloudflare/next-on-pages | @opennextjs/cloudflare |
|------|---------------------------|------------------------|
| Next.js 16 支持 | ❌ (仅到 15.5.2) | ✅ 完整支持 |
| Edge Runtime 要求 | ✅ 强制 | ❌ 可选（支持 Node.js） |
| 状态 | ❌ 已弃用 | ✅ 活跃维护 |
| 输出目录 | `.vercel/output/static` | `.worker-next` |
| 配置复杂度 | 简单 | 中等（需要配置文件） |

---

## ⚠️ 预期结果

OpenNext **可能**解决了之前的 Edge Runtime 问题，因为：
- ✅ 支持 Node.js Runtime
- ✅ 不强制所有路由使用 Edge Runtime
- ✅ 对 Next.js 16 支持更好

**但仍可能遇到问题**：
- 数据库连接
- 某些 Node.js API 兼容性
- 其他未知问题

---

## 📋 部署检查清单

- [x] 代码已推送到 cloudflare-pages 分支
- [ ] 更新 Cloudflare 构建命令
- [ ] 更新输出目录为 `.worker-next`
- [ ] 环境变量已配置
- [ ] 触发重新部署
- [ ] 查看构建日志
- [ ] 等待构建完成

---

## 🆘 如果还是失败

OpenNext 是我们能找到的**最好的 Cloudflare 适配器**了。

如果仍然失败，只剩下两个选择：

### 选择 1：手动添加 Edge Runtime 配置
- 修改 50+ 个路由文件
- 添加 `export const runtime = 'edge';`
- 调试 Edge Runtime 兼容性问题
- **预计 2-3 天工作量**

### 选择 2：放弃 Cloudflare，升级 Vercel Pro
- $20/月
- 5 分钟解决
- 零风险

---

## 🎯 下一步

**立即去 Cloudflare Dashboard 更新构建配置**：

1. 更新构建命令：`pnpm install && pnpm build && pnpm pages:build`
2. 更新输出目录：`.worker-next`
3. 触发重新部署

**然后告诉我构建结果！** 🚀

---

**祝这次成功！** 🙏

