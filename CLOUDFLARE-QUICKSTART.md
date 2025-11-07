# ⚡ Cloudflare Pages 快速开始

**3 分钟快速部署指南**

## 📦 1. 安装依赖

```bash
pnpm install
```

## 🔧 2. 配置环境变量

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars`，填入你的配置：

```env
# 必填项
POSTGRES_URL=你的数据库连接字符串
CLOUDFLARE_R2_ACCOUNT_ID=你的账户ID
CLOUDFLARE_R2_ACCESS_KEY_ID=你的访问密钥
CLOUDFLARE_R2_SECRET_ACCESS_KEY=你的密钥
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN=你的R2域名.com
AUTH_SECRET=生成一个随机密钥
```

## 🧪 3. 本地测试

```bash
# 构建并预览
pnpm build
pnpm pages:build
pnpm pages:preview

# 访问 http://localhost:8788
```

## 🚀 4. 部署到 Cloudflare

### 方式一：命令行部署

```bash
pnpm wrangler login
pnpm pages:deploy
```

### 方式二：Dashboard 部署（推荐）

1. 访问 https://dash.cloudflare.com
2. **Workers & Pages** → **Create** → **Connect to Git**
3. 选择仓库并配置：
   - **Build command**: `pnpm build && pnpm pages:build`
   - **Build directory**: `.vercel/output/static`
   - **Node version**: 18+
4. 添加环境变量（从 `.dev.vars` 复制）
5. 部署！

## ✅ 验证部署

- [ ] 访问你的 `.pages.dev` 域名
- [ ] 测试照片上传
- [ ] 检查 EXIF 信息显示
- [ ] 验证数据库连接

## 📋 常用命令

```bash
# 开发
pnpm dev                  # Next.js 开发服务器

# 构建
pnpm build                # Next.js 构建
pnpm pages:build          # Cloudflare 适配

# 预览
pnpm pages:preview        # 本地预览 Cloudflare 版本

# 部署
pnpm pages:deploy         # 部署到 Cloudflare
```

## 🔄 完整迁移

查看 [CLOUDFLARE-MIGRATION.md](./CLOUDFLARE-MIGRATION.md) 了解详细说明。

## 🆘 遇到问题？

1. 检查 `.dev.vars` 配置是否正确
2. 确认 R2 bucket 已创建
3. 查看 Cloudflare Dashboard 日志
4. 参考完整迁移指南

---

**需要帮助？** 查看 [完整迁移指南](./CLOUDFLARE-MIGRATION.md)


