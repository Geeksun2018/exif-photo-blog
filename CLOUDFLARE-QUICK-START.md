# ⚡ Cloudflare Pages 快速开始卡片

## 🎯 3 步部署

### 1️⃣ 提交代码

```bash
git add .
git commit -m "准备 Cloudflare Pages 部署"
git push origin main
```

### 2️⃣ Cloudflare Dashboard 配置

访问：https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Connect to Git**

**构建配置**：
```
Build command: pnpm install && pnpm build && npx @cloudflare/next-on-pages
Build directory: .vercel/output/static
Node version: 18.17.0
```

### 3️⃣ 添加环境变量

**必需的关键变量**（从 Vercel 复制，或新建）：

```env
POSTGRES_URL=你的数据库连接
CLOUDFLARE_R2_ACCOUNT_ID=你的R2账户ID
CLOUDFLARE_R2_ACCESS_KEY_ID=你的R2密钥
CLOUDFLARE_R2_SECRET_ACCESS_KEY=你的R2密钥
NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET=exif-photos
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN=你的R2域名
NEXT_PUBLIC_STORAGE_PREFERENCE=cloudflare-r2
NEXT_PUBLIC_PLATFORM=cloudflare
AUTH_URL=https://你的项目.pages.dev
AUTH_SECRET=运行 openssl rand -base64 32 生成
```

---

## ⚠️ 如果构建失败

### Next.js 16 不兼容问题

降级到 Next.js 15：

```bash
pnpm add next@15.5.2
git add package.json pnpm-lock.yaml
git commit -m "降级 Next.js 15"
git push
```

### vercel CLI 缺失

修改构建命令：
```bash
pnpm add -D vercel && pnpm build && npx @cloudflare/next-on-pages
```

---

## 📋 部署检查清单

- [ ] GitHub 仓库已更新
- [ ] R2 已创建并获取密钥
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 站点可访问
- [ ] 功能测试通过

---

## 🔗 重要链接

- **完整指南**: 见 `CLOUDFLARE-DEPLOY-GUIDE.md`
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **生成密钥**: `openssl rand -base64 32`

---

**当前状态**: 准备就绪，可以开始部署！ 🚀

