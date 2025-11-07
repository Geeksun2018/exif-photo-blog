# 🚀 Cloudflare Pages Dashboard 部署指南

**最后更新**: 2025-11-07  
**预计时间**: 15-30 分钟

---

## 📋 准备工作

### 1. 提交代码到 GitHub

```bash
git add .
git commit -m "准备 Cloudflare Pages 部署"
git push origin main
```

### 2. 获取 Cloudflare R2 配置

如果还没有 R2 bucket，需要先创建：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **R2** → **Create bucket**
3. 名称：`exif-photos`
4. 创建后记录：
   - Bucket 名称
   - 公开域名（如果配置了）
   - Account ID

### 3. 创建 R2 API Token

1. R2 页面 → **Manage R2 API Tokens**
2. **Create API Token**
3. 权限选择：**Object Read & Write**
4. 记录：
   - Access Key ID
   - Secret Access Key
   - ⚠️ Secret 只显示一次，务必保存！

---

## 🌐 在 Cloudflare Dashboard 部署

### 步骤 1: 创建 Pages 项目

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers & Pages**
3. 点击 **Create application** → **Pages**
4. 点击 **Connect to Git**

### 步骤 2: 连接 GitHub 仓库

1. 选择 **GitHub**
2. 授权 Cloudflare 访问你的 GitHub 账户
3. 选择仓库：`exif-photo-blog`
4. 点击 **Begin setup**

### 步骤 3: 配置构建设置

**⚠️ 重要：这里有兼容性风险（Next.js 16）**

#### 基本设置

- **Project name**: `exif-photo-blog`（或你想要的名字）
- **Production branch**: `main`

#### 构建配置

```
Framework preset: Next.js
Build command: pnpm install && pnpm build && npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: /
Node version: 18.17.0
```

**注意**：
- 如果构建失败，可能需要降级 Next.js 到 15.5.2
- Cloudflare 的 Linux 环境可能会成功构建（比 Windows 好）

### 步骤 4: 配置环境变量

点击 **Add environment variables**，添加以下变量：

#### 必需的环境变量

```env
# 数据库
POSTGRES_URL=postgresql://exif_user:ExifPhoto2025_SecurePass123@47.100.31.42:5432/exif_photo_blog?connect_timeout=10&statement_timeout=30000&idle_in_transaction_session_timeout=30000

# Cloudflare R2（填入你的实际值）
CLOUDFLARE_R2_ACCOUNT_ID=你的账户ID
CLOUDFLARE_R2_ACCESS_KEY_ID=你的R2访问密钥
CLOUDFLARE_R2_SECRET_ACCESS_KEY=你的R2密钥
NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET=exif-photos
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN=你的R2公开域名
NEXT_PUBLIC_CLOUDFLARE_R2_ACCOUNT_ID=你的账户ID

# 存储配置
NEXT_PUBLIC_STORAGE_PREFERENCE=cloudflare-r2

# 平台标识
NEXT_PUBLIC_PLATFORM=cloudflare

# Next Auth（重要！需要生成新的）
AUTH_URL=https://你的项目名.pages.dev
AUTH_SECRET=生成一个随机密钥

# 站点信息
NEXT_PUBLIC_SITE_TITLE=你的站点标题
NEXT_PUBLIC_SITE_DESCRIPTION=你的站点描述
NEXT_PUBLIC_SITE_DOMAIN=你的项目名.pages.dev
```

#### 如何生成 AUTH_SECRET

在本地运行：
```bash
openssl rand -base64 32
```

或者在线生成：https://generate-secret.vercel.app/32

#### 其他可能需要的变量

从 Vercel 复制所有其他环境变量：
- Vercel Dashboard → 你的项目 → Settings → Environment Variables
- 复制所有变量到 Cloudflare

### 步骤 5: 开始部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约 3-5 分钟）

---

## ⚠️ 可能遇到的问题

### 问题 1: 构建失败 - Next.js 版本不兼容

**错误信息**:
```
unmet peer next@">=14.3.0 && <=15.5.2": found 16.0.1
```

**解决方案**:
需要降级 Next.js 到 15.5.2

```bash
# 本地执行
pnpm add next@15.5.2

# 测试是否正常
pnpm build

# 提交并重新部署
git add package.json pnpm-lock.yaml
git commit -m "降级 Next.js 到 15.5.2 for Cloudflare 兼容性"
git push
```

### 问题 2: vercel CLI 未找到

**错误信息**:
```
missing peer vercel@">=30.0.0 && <=47.0.4"
```

**解决方案**:
修改构建命令：

```bash
# 安装 vercel CLI 并构建
pnpm add -D vercel && pnpm build && npx @cloudflare/next-on-pages
```

### 问题 3: 数据库连接失败

**检查**:
- 阿里云数据库是否允许 Cloudflare 的 IP 访问
- 环境变量是否正确配置
- 连接字符串是否包含超时配置

### 问题 4: R2 存储无法访问

**检查**:
- R2 API Token 权限是否正确
- Bucket 名称是否正确
- 公开域名是否配置

---

## 🔧 配置 R2 绑定（可选，推荐）

部署成功后，配置 R2 绑定可以获得更好的性能：

1. 进入你的 Pages 项目
2. **Settings** → **Functions** → **R2 bucket bindings**
3. 点击 **Add binding**
4. 配置：
   - **Variable name**: `PHOTO_BUCKET`
   - **R2 bucket**: `exif-photos`
5. **Save**
6. 触发重新部署

---

## ✅ 验证部署

部署成功后：

1. **访问站点**
   - URL: `https://你的项目名.pages.dev`
   - 检查首页是否正常显示

2. **测试功能**
   - [ ] 登录功能
   - [ ] 照片显示
   - [ ] EXIF 信息显示
   - [ ] 照片上传（如果有权限）
   - [ ] 数据库查询

3. **检查日志**
   - Pages 项目 → **Deployments** → 选择最新部署
   - 查看 **Functions** 日志
   - 检查是否有错误

---

## 🎨 配置自定义域名

如果要使用自己的域名：

1. Pages 项目 → **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如：`photos.yourdomain.com`）
4. 按照提示添加 DNS 记录：
   - 类型：CNAME
   - 名称：photos（或 @）
   - 内容：你的项目名.pages.dev
5. 等待 DNS 生效（几分钟到几小时）

**重要**: 配置自定义域名后，需要更新环境变量：

```env
AUTH_URL=https://你的自定义域名
NEXT_PUBLIC_SITE_DOMAIN=你的自定义域名
```

然后触发重新部署。

---

## 📊 监控和调试

### 查看构建日志

1. Pages 项目 → **Deployments**
2. 点击最新部署
3. 查看 **Build logs**

### 查看运行时日志

1. Pages 项目 → **Deployments** → 选择部署
2. 点击 **Functions**
3. 实时查看请求日志

### 性能监控

1. Pages 项目首页
2. 查看 **Analytics**
   - 请求数
   - 带宽使用
   - 错误率

---

## 🔄 后续更新流程

每次更新代码后：

```bash
git add .
git commit -m "更新描述"
git push origin main
```

Cloudflare 会自动检测并重新构建部署！

---

## 💰 费用监控

定期检查（每周/每月）：

1. **Cloudflare Dashboard** → **Workers & Pages**
2. 查看：
   - 请求数（100K/天 限制）
   - 函数调用次数
   - R2 用量（10GB 免费）

**当前预估**（根据您的使用情况）：
- 请求：约 13K/天，远低于限制 ✅
- R2 存储：需要监控
- Fast Data Transfer：R2 同网络免费 ✅

---

## 🆘 如果部署失败

### 立即回滚方案

1. **保持 Vercel 部署不动**
2. **DNS 不要切换**
3. **先在 Cloudflare 测试完全稳定后再切换**

### 降级到 Next.js 15

如果 Next.js 16 无法工作：

```bash
# 降级 Next.js
pnpm add next@15.5.2 react@19 react-dom@19

# 测试
pnpm build

# 提交
git add .
git commit -m "降级 Next.js 15 for Cloudflare"
git push
```

### 联系支持

- Cloudflare Community: https://community.cloudflare.com/
- GitHub Issues: https://github.com/cloudflare/next-on-pages/issues

---

## 📝 检查清单

部署前：
- [ ] 代码已提交到 GitHub
- [ ] 已获取 R2 配置（Account ID, Access Key, Secret）
- [ ] 已生成 AUTH_SECRET
- [ ] 已记录所有 Vercel 环境变量

部署中：
- [ ] 正确配置构建命令
- [ ] 所有环境变量已添加
- [ ] 构建成功完成

部署后：
- [ ] 站点可以访问
- [ ] 登录功能正常
- [ ] 照片显示正常
- [ ] 数据库连接正常
- [ ] R2 存储正常

---

**祝部署顺利！** 🎉

如果遇到问题，请查看构建日志并根据错误信息调整。

**下一步**: 如果部署成功，记得更新 `PROJECT-NOTES.md` 记录新的部署信息。

