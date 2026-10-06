---
title: 线程池的核心参数与工作流程
category: 编程语言
tags: [线程池, 并发, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

线程池有哪几个核心参数？任务提交后的执行流程是怎样的？为什么规范不建议用 Executors 直接创建线程池？

## 核心答案

- **七个参数**：corePoolSize、maximumPoolSize、keepAliveTime + unit、workQueue、threadFactory、handler（拒绝策略）；
- **执行流程**：提交任务 → 核心线程未满则创建核心线程 → 满了先入队列 → 队列满再创建非核心线程直到 maximumPoolSize → 都满了执行拒绝策略；
- **四种拒绝策略**：AbortPolicy（抛异常，默认）、CallerRunsPolicy（提交者自己执行，天然反压削峰）、DiscardPolicy（静默丢弃）、DiscardOldestPolicy（丢最老任务再提交）；
- **队列选择**：ArrayBlockingQueue 有界可控资源；SynchronousQueue 不存储直接交接（CachedThreadPool 在用）；LinkedBlockingQueue 近似无界要慎用；
- **不建议 Executors**：newFixedThreadPool/newSingleThreadExecutor 用无界队列会堆积任务导致 OOM；newCachedThreadPool 最大线程数是 Integer.MAX_VALUE，可能创建海量线程 OOM；
- **线程数估算**：CPU 密集型 ≈ N + 1；IO 密集型 ≈ N × (1 + 等待时间/计算时间)，经验值 2N 起步，最终以压测为准。

## 深度解析

- 注意顺序坑：队列满了才扩到最大线程数——所以 LinkedBlockingQueue（近似无界）永远不满，maximumPoolSize 形同虚设，这也是它容易 OOM 的根源。
- 状态控制：ctl 用一个 AtomicInteger 同时编码 runState（RUNNING/SHUTDOWN/STOP 等）和 workerCount，高 3 位是状态、低 29 位是线程数。
- 线程复用原理：Worker 内部 while 循环不断 getTask() 从队列取任务执行，核心线程取不到任务时阻塞等待，所以线程不会被销毁，实现复用。

```java
// 手动创建线程池的标准姿势：明确全部参数
new ThreadPoolExecutor(2, 4, 60, TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(100),
        new ThreadFactoryBuilder().setNameFormat("biz-%d").build(),
        new ThreadPoolExecutor.CallerRunsPolicy());
```

- 参数动态化：setCorePoolSize 等方法运行时生效，生产上可把参数做成配置中心可调 + 监控告警，避免调参要发版。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [AQS 的原理与 ReentrantLock](/language/aqs-reentrantlock)
- [ConcurrentHashMap 如何保证线程安全](/language/concurrenthashmap-principle)
