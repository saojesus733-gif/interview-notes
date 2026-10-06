---
title: ConcurrentHashMap 如何保证线程安全
category: 编程语言
tags: [ConcurrentHashMap, 并发, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

ConcurrentHashMap 是如何在保证线程安全的同时兼顾性能的？相比 Hashtable 和 synchronizedMap 好在哪里？
它的 get 方法为什么可以不加锁？

## 核心答案

- **JDK 1.8 实现**：CAS + synchronized，锁粒度是单个桶的头节点，不同桶之间可以并发写入；
- **put 流程**：桶为空用 CAS 直接插入；不为空则 synchronized 锁住头节点，再走链表/红黑树插入；
- **get 不加锁**：Node 的 val 和 next 都用 volatile 修饰，保证读到最新值且可见；
- **size 统计**：baseCount + CounterCell[] 分散计数（思想同 LongAdder），避免自旋 CAS 单个计数的竞争热点；
- **并发扩容**：其他线程 put 时发现 ForwardingNode 会 helpTransfer 协助迁移，多线程分工搬桶；
- **对比 Hashtable**：Hashtable 锁整张表，Collections.synchronizedMap 也是一把大锁包所有操作，并发度极低。

## 深度解析

- key 不允许 null 的原因：并发环境下 get 返回 null 无法区分「key 不存在」还是「值就是 null」——单线程可以用 containsKey 二次确认，但多线程下两次调用之间值可能已被修改，存在二义性，索性在源头禁止。
- JDK 1.7 是分段锁 Segment（继承 ReentrantLock，默认 16 段），并发度固定为 16；1.8 摒弃分段，改为锁单个桶头，粒度更细、结构与 HashMap 对齐。
- 选 synchronized 而不是 ReentrantLock：1.6 后 synchronized 有锁升级优化，桶冲突少时开销接近 CAS，且不用为每个 Node 维护 AQS 队列对象，内存更省。
- 复合操作仍不原子：「不存在才放入」必须用 putIfAbsent / computeIfAbsent，自己写 if + put 依然有竞态。
- 高频追问「1.7 与 1.8 差异」：分段锁改为 CAS + synchronized；结构与 HashMap 对齐（数组 + 链表 + 红黑树）；size 从分段累加改为 CounterCell 分散计数。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [HashMap 的底层实现原理](/language/hashmap-principle)
- [线程池的核心参数与工作流程](/language/threadpool-params)
- [Java 内存模型（JMM）与 volatile](/language/java-memory-model-volatile)
