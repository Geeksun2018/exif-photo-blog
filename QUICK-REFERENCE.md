# 快速参考 - 常用命令和决策

## 🚨 紧急问题解决

### ETIMEDOUT 错误 → 检查数据库连接数
```bash
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:'postgresql://exif_user:ExifPhoto2025_SecurePass123@47.100.31.42:5432/exif_photo_blog'});p.connect().then(c=>c.query('SELECT COUNT(*) as total FROM pg_stat_activity WHERE datname=\\'exif_photo_blog\\'').then(r=>{console.log('连接数:',r.rows[0].count);c.release();p.end()}))"
```

如果 > 50，清理空闲连接：
```bash
node -e "const {Pool}=require('pg');const p=new Pool({connectionString:'postgresql://exif_user:ExifPhoto2025_SecurePass123@47.100.31.42:5432/exif_photo_blog'});p.connect().then(c=>c.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=\\'exif_photo_blog\\' AND state=\\'idle\\' AND NOW()-state_change>interval\\'5 minutes\\'').then(()=>{console.log('已清理');c.release();p.end()}))"
```

### Server Action 错误 → 清除缓存
1. Vercel → Settings → Caches → Purge Everything
2. 浏览器 Ctrl + Shift + R
3. Redeploy (不勾选 Use existing Build Cache)

---

## 📊 正常数值参考

```
数据库连接: 20-30 个
响应时间: < 500ms
Fast Origin Transfer: < 10 GB/月
```

---

## 🎯 决策参考

| 情况 | 行动 |
|-----|-----|
| 超额费用 > $5/月 | 升级 Vercel Pro 或迁移 Cloudflare |
| ETIMEDOUT > 10% | 必须升级 Vercel Pro |
| 一切正常 | 保持现状，每月检查 |

---

**详细说明**: PROJECT-NOTES.md

