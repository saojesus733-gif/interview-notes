---
title: 抓面经
category: 工具页
---

# 抓面经

一键把牛客网的面经抓进知识库。粘贴帖子链接直接入库，或输入关键词搜索后挑选。

<InterviewFetcher />

## 使用说明

1. **前置条件**：本地采集服务需要处于运行状态（页面上方有连接状态提示）。如果显示未启动，在终端运行：
   ```
   cd D:\codex_work\工具\newcoder-mcp-server && node interview-service.mjs
   ```
2. **粘贴链接**（形如 `https://www.nowcoder.com/discuss/xxx` 或 `/feed/main/detail/xxx`）：点「一键抓取入库」，服务会自动完成抓全文 → 脱敏存档到 `docs/interview/` → 更新面经索引 → 重建站点 → 重启预览，全程约 2-3 分钟。
3. **关键词搜索**：输入关键词拿到候选列表，逐篇挑选入库。
4. **拆题**：按钮负责把面经「存档 + 上架」；想把某篇拆成题目进刷题题库（按追问链分组、标重要度、关联已有题），在 ZCode 里说一声即可。
5. 该页面仅本地使用；部署到 GitHub Pages 后按钮无法工作（抓取依赖本机服务）。
