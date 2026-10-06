---
title: PostgreSQL 与 MySQL 怎么选？你的项目为什么用 PG？
category: Python 栈
tags: [PostgreSQL, MySQL, 数据库, 选型]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

你的项目用 PostgreSQL。相比 MySQL 它强在哪？什么场景我会反过来选 MySQL？

## 核心答案

**PG 的差异化优势（AI 应用相关的高频点）**：

1. **JSONB**：二进制 JSON 类型支持索引（GIN）与查询——存 LLM 的半结构化输出、会话元数据不用建满表字段；
2. **pgvector 扩展**：数据库内直接做**向量存储与相似度检索**——小中型 RAG 一库搞定业务数据 + 向量，不用再引入专用向量库（呼应向量检索原理）；
3. **全量事务与约束更强**：DDL 可回滚、更严格的约束体系、丰富的索引类型（B-tree/GIN/部分索引）；
4. **复杂查询与 CTE/窗口函数**能力公认更强。

**MySQL 的优势**：生态与运维人才储备更广、主从复制方案成熟、读多写少的经典 Web 场景足够；团队已有 MySQL 运维体系时切换成本不划算。

**选型原则**：需要 JSONB/pgvector/复杂查询 → PG；纯 CRUD + 现成 MySQL 运维 → 别为了技术新颖性换库。

## 深度解析

- 加分点：**pgvector 的能力边界**——HNSW/IVFFlat 索引、支持百万到千万级向量没问题，但超大规模、需要丰富标量过滤+分布式时，专用向量库（Milvus 类）更合适——"先用 PG 起步，规模到了再拆"是务实路线；
- 结合简历：办公 AI 助手用 PostgreSQL + pgvector 存文档向量——一条 SQL 完成元数据过滤 + 向量检索；
- 雷区：把 PG 说成"比 MySQL 全面碾压"——两者都是成熟系统，差异是特性取向。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [向量检索原理](/rag/vector-search-principle)
- [记忆的存储方案](/agent-memory-tools/memory-storage-solutions)
- [Embedding 模型选型](/rag/embedding-selection)
