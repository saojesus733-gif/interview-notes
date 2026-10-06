---
title: 用 Redis 在 Python 服务里做什么？
category: Python 栈
tags: [Redis, Python, 缓存, LLM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Redis 在你的 LLM 应用里承担哪些职责？分别用什么数据结构和策略？

## 核心答案

LLM 应用里 Redis 的五个典型角色：

1. **会话/短期记忆缓存**：活跃会话的最近上下文用 String/Hash 存，TTL 控制生命周期（呼应记忆持久化）——读写毫秒级，避免每轮打数据库；
2. **语义缓存**：query 向量化后相似匹配直接返回历史答案（精确缓存用 String SETNX 即可）；省 LLM 调用费；
3. **限流与配额**：INCR + EXPIRE 实现滑动窗口计数，Lua 脚本保证原子；按租户/接口分级限流（呼应限流算法题）；
4. **分布式锁**：SET NX PX + 唯一值 + Lua 释放——Agent 任务去重、防止并发重建缓存（呼应分布式锁对比题）；
5. **任务队列轻量版**：List（LPUSH/BRPOP）或 Stream 做简单异步任务分发；重调度需求才上专用 MQ。

**Python 侧**：redis-py（同步）+ redis.asyncio（异步，配 FastAPI/asyncio）；连接池必开；大 value 拆分防大 key。

## 深度解析

- 缓存一致性与 TTL 设计呼应缓存三兄弟题（穿透/击穿/雪崩的对策都在这里落地）；
- 加分点：**语义缓存的键设计**——向量存 Redis 不如放 PG/专用库，Redis 只存"向量 id → 答案"映射或用 RediSearch 模块；
- 雷区：把 Redis 当持久存储（RDB/AOF 也可能丢尾部数据，关键数据落 PG）；大 key（百 KB+ 的对话历史整串存）引发慢查询——拆 hash 或压缩。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [缓存穿透、击穿、雪崩](/database/redis-cache-issues)
- [分布式锁方案对比](/distributed/distributed-lock-compare)
- [对话记忆持久化](/agent-memory-tools/memory-persistence)
