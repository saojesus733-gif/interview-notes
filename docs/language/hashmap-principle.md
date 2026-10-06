---
title: HashMap 的底层实现原理
category: 编程语言
tags: [HashMap, 集合, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

讲讲 HashMap 的底层实现原理？put 一个元素的完整流程是怎样的，什么时候链表会转成红黑树？

## 核心答案

- **底层结构**：数组 + 链表 + 红黑树（JDK 1.8+），数组每个位置称为一个桶（bucket）；
- **put 流程**：对 key 的 hashCode 做扰动（高 16 位异或低 16 位），用 `(n-1) & hash` 计算桶下标；冲突则拉链，key 相同则覆盖；
- **树化阈值**：链表长度 ≥ 8 且数组长度 ≥ 64 才转红黑树，否则优先扩容；节点减到 6 退化回链表；
- **扩容**：默认容量 16、负载因子 0.75，元素数超过 `容量 × 0.75` 时扩容为 2 倍并 rehash；
- **rehash 优化**：容量是 2 的幂，扩容后元素要么留在原下标，要么落到「原下标 + 旧容量」，无需重新计算 hash；
- **线程不安全**：1.7 头插法并发扩容可能成环导致 CPU 100%；1.8 改尾插解决了成环，但仍可能丢数据，并发要用 ConcurrentHashMap。

## 深度解析

- 扰动函数 `(h = key.hashCode()) ^ (h >>> 16)` 让高位参与下标运算，因为 `(n-1) & hash` 只用低位，不加扰动时低位相近的 key 更容易碰撞。
- 树化阈值取 8 符合泊松分布：负载因子 0.75 时链表长度达到 8 的概率约千万分之一，正常使用几乎不会树化，树化只是冲突恶化时的兜底。
- 为什么容量必须是 2 的幂：`(n-1) & hash` 等价于 `hash % n` 但位运算更快，且保证下标分布均匀；手动 new HashMap 时会向上取整为最近的 2 的幂。

```java
// 扰动函数：高 16 位与低 16 位异或，让高位也参与索引计算
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

- 1.7 与 1.8 的核心差异：1.7 是头插法 + 数组 + 链表，扩容时需重算 hash；1.8 改为尾插法并引入红黑树，查询从 O(n) 优化到 O(log n)。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [ConcurrentHashMap 如何保证线程安全](/language/concurrenthashmap-principle)
- [JVM 内存区域划分](/language/jvm-memory-areas)
