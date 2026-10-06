---
title: Redis 常用数据结构与底层实现
category: 数据库
tags: [Redis, 数据结构]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

说说 Redis 五种基本类型各自的典型使用场景？
它们的底层编码是怎么实现的，为什么 zset 用跳表而不是红黑树？

## 核心答案

- **String**：缓存对象、计数器、分布式锁；
  底层 SDS 简单动态字符串，O(1) 取长度、二进制安全；
- **Hash**：存对象、购物车；
  元素少用 listpack（旧版 ziplist），超阈值转为 dict 哈希表；
- **List**：消息队列、最新列表；
  底层 quicklist：双向链表串联多个 listpack 节点，兼顾内存与性能；
- **Set**：去重、抽奖、共同好友（SINTER 交集）；
  全整数且元素少用 intset，否则用 dict，SPOP 适合随机抽奖；
- **ZSet**：排行榜、延迟队列；
  元素少用 listpack，多了用 dict + skiplist 双结构：dict 按 member 查 score 是 O(1)，skiplist 按 score 排序和范围操作是 O(logN)；
- **dict 渐进式 rehash**：扩容时新旧两个哈希表并存；
  每次增删改查顺带搬迁一个桶，避免一次性搬迁阻塞主线程。

## 深度解析

- 跳表选型：范围查询天然有序（底层双向链表可顺序遍历），实现简单、插入删除只改指针；
  红黑树范围查询要中序遍历，实现复杂且旋转开销大；
- 跳表用多级稀疏索引实现 O(logN) 查找，节点层数按概率随机生成（每层晋升约 25%）；
  期望高度 O(logN)，无需像平衡树那样旋转维护；
- 编码转换阈值由配置控制（如 `hash-max-listpack-entries`、`zset-max-listpack-value`）；
  元素个数或单个值超限就从紧凑编码转标准编码，用 `OBJECT ENCODING key` 可实际查看；
- 追问点：SDS 相比 C 字符串的优势——长度字段 O(1)、空间预分配与惰性释放、二进制安全；
  listpack 彻底解决了 ziplist 的连锁更新（prevlen 级联变化）问题。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Redis 持久化机制（RDB 与 AOF）](/database/redis-persistence)
- [缓存穿透、击穿、雪崩](/database/redis-cache-issues)
- [用 Redis 实现分布式锁](/database/redis-distributed-lock)
