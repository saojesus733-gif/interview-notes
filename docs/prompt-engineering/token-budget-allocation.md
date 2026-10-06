---
title: 上下文窗口管理与 Token Budget 分配
category: Prompt 工程
tags: [上下文工程, Token, 上下文窗口]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

一次 LLM 调用的上下文由哪几部分组成？Token 预算应该如何分配？

## 核心答案

**一次请求的典型构成**：

```text
System Prompt（角色/规则/工具说明，稳定不变）
+ Few-shot 示例（可选）
+ 长期记忆/用户画像（检索注入）
+ RAG 检索资料（本次任务相关）
+ 对话历史（裁剪/摘要后的）
+ 当前用户输入
+ 输出预留（max_tokens）
```

**分配原则**：

1. **先给输出留够**：max_tokens 是硬截断，输出被砍是最常见的线上事故之一；
2. **System Prompt 精简且固定**：它是行为契约，但要防过度膨胀；
3. **相关性排序**：重要内容放头部（System 后）与尾部（紧邻问题），中间位置利用率最低；
4. **按任务特征倾斜**：知识问答把预算给 RAG 资料；多轮对话把预算给历史；格式敏感任务把预算给示例；
5. **动态裁剪**：接近上限时按优先级丢弃——先摘要历史，再缩 RAG 条数，最后才动 System；
6. **监控实际 token 消耗**：分类别打点，超预算告警。

## 深度解析

- Token 预算不只是「装得下」：塞满窗口会导致注意力稀释、延迟与成本上升，**利用率比容量重要**——这是 Context Engineering 与 Context Window 管理的核心区别。
- 分段打点建议：在网关层统计每次调用的 system / history / rag / user / completion 各占多少 token，作为优化依据。
- 与 KV Cache 的关联：稳定不变的前缀（System 等）若保持在开头，推理服务可复用前缀缓存，降低延迟与成本。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [上下文压缩与滚动摘要](/prompt-engineering/context-compression-rolling-summary)
- [上下文窗口与长上下文](/llm-basics/context-window-long-context)
- [Token 超限时的上下文裁剪策略](/agent-memory-tools/context-trimming)
