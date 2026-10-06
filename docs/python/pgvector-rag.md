---
title: pgvector 做向量检索的原理与边界
category: Python 栈
tags: [pgvector, PostgreSQL, 向量检索, RAG]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

你的 RAG 项目用 pgvector 存向量。它内部怎么支持相似度检索？和专用向量库（Milvus/Qdrant）比，边界在哪里？

## 核心答案

**pgvector 工作原理**：

1. 向量存为 `vector` 列（固定维度浮点数组），支持 `<->`（L2）、`<=>`（余弦）、`<#>`（内积）距离算子；
2. **索引两种**：IVFFlat（先聚类分桶，查询只搜最近 nprobe 个桶，建索引快、需训练数据）与 **HNSW**（分层图，召回高、查询快、建索引慢占内存大）——原理与通用向量检索一致（呼应向量检索原理题）；
3. **最大价值是和业务数据同库**：一条 SQL 完成"元数据过滤（WHERE 文档状态=现行 AND 租户=X）+ 向量近邻"——预过滤天然融合，不用在两套系统间对齐数据。

**边界（什么时候换专用向量库）**：

- 向量规模到亿级、需要分布式分片与多副本高可用；
- 需要丰富的高级特性（稠密+稀疏混合、标量量化压缩、多租户强隔离的开箱支持）；
- 写入吞吐极大（pgvector 索引更新成本较高）。

**经验值**：百万级以内、过滤条件复杂的 RAG——pgvector 通常是**总成本最低**的方案；先单库起步，规模驱动拆分。

## 深度解析

- 实操注意：HNSW 的 m/ef_construction 与查询 ef_search 权衡；改 Embedding 模型 = 维度变 = 重建列与索引；`internal` schema 的索引维护要进迁移脚本；
- 加分点：结合简历——"办公助手选 pgvector 是因为文档量几十万级、过滤条件多，一个 PG 备份策略覆盖全部数据"；
- 雷区：无索引全表暴力扫（数据量一大延迟爆炸）；把 pgvector 当"只能玩玩"——它已支撑生产级 RAG。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [向量检索原理](/rag/vector-search-principle)
- [PostgreSQL 与 MySQL 怎么选](/python/postgres-vs-mysql)
- [企业级 RAG 系统设计](/system-design/enterprise-rag-design)
