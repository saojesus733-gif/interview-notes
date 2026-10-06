---
title: 手写语义缓存
category: 手写编程
tags: [手写题, 缓存, Embedding, 成本]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

手写一个语义缓存：相同/相似的问题直接返回缓存答案，而不是再次调用 LLM。给出核心结构与匹配逻辑。

## 核心答案

1. **结构**：缓存表 = [{question, embedding, answer}]，可放内存或向量库；
2. **查询流程**：query → 向量化 → 与缓存中所有 embedding 算余弦相似度 → 最大值 ≥ 阈值（如 0.92）→ 返回对应 answer；否则调用 LLM 并把 (query, embedding, answer) 写入缓存；
3. **复杂度**：朴素实现 O(N·d) 线性扫描；量大时换 ANN 索引；
4. **必配要素**：相似度阈值、缓存容量与淘汰（LRU/TTL）、失效策略（知识更新后清空相关条目）。

## 深度解析

参考实现（Python，向量检索用暴力循环示意）：

```python
import numpy as np

class SemanticCache:
    def __init__(self, embed, threshold=0.92):
        self.embed, self.threshold = embed, threshold
        self.keys, self.vals = [], []            # keys: 向量, vals: answer

    def lookup(self, query):
        qv = np.array(self.embed(query))
        for kv, answer in zip(self.keys, self.vals):
            if float(qv @ kv / (np.linalg.norm(qv) * np.linalg.norm(kv))) >= self.threshold:
                return answer                     # 命中
        return None

    def put(self, query, answer):
        self.keys.append(np.array(self.embed(query)))
        self.vals.append(answer)
```

- 追问一：为什么阈值不能太低？→ 不同问题被误命中，返回错答案比慢更糟；阈值需要用"相似问/不同问"样本对校准；
- 追问二：知识库更新了怎么办？→ 版本化缓存键（知识库版本号参与 key），更新即失效；
- 延伸：生产版 = 向量库（ANN）+ 精确缓存分层 + 按租户隔离，防串数据。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [企业级 RAG 系统设计](/system-design/enterprise-rag-design)
- [LLM 应用成本控制](/evaluation-deployment/cost-optimization)
