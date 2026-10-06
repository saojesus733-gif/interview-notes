---
title: AQS 的原理与 ReentrantLock
category: 编程语言
tags: [AQS, 并发, 锁]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

AQS 的核心结构是什么？ReentrantLock 的加锁流程是怎样的，公平锁和非公平锁差在哪里？

## 核心答案

- **AQS 核心**：一个 volatile int state（同步状态）+ 一条 CLH 变体的双向等待队列 + 模板方法模式（tryAcquire/tryRelease 等留给子类实现）；
- **获取骨架**：acquire 先 tryAcquire，失败则入队，入队后自旋判断——前驱是头节点才再次尝试，否则 LockSupport.park 挂起，等前驱释放时 unpark 唤醒；
- **两种模式**：独占模式同一时刻只有一个线程持有（ReentrantLock）；共享模式允许多线程同时通过（Semaphore、CountDownLatch、读写锁的读锁）；
- **ReentrantLock 语义**：state 表示重入次数，重入一次 +1、释放一次 -1，减到 0 才真正释放锁；
- **公平 vs 非公平**：非公平上来直接 CAS 抢锁，抢不到才排队（吞吐高、可能饥饿）；公平锁先检查队列中有没有前驱节点，有就老实排队；
- **Condition**：await/signal 对应 wait/notify，一个 Lock 可创建多个 Condition 队列（如 ArrayBlockingQueue 的 notFull/notEmpty）。

## 深度解析

- 基于 AQS 实现同步器只需重写 tryAcquire/tryRelease（独占）或 tryAcquireShared/tryReleaseShared（共享）：CountDownLatch 把 state 当剩余计数、Semaphore 把 state 当许可数，排队/挂起/唤醒全部复用 AQS。
- 非公平锁吞吐高的原因：省掉了线程挂起和唤醒的内核态切换；代价是队列中的线程可能一直抢不过新来的线程。

```java
// ReentrantLock 非公平加锁核心：先抢一次，失败才走 AQS 排队
final void lock() {
    if (compareAndSetState(0, 1))
        setExclusiveOwnerThread(Thread.currentThread());
    else
        acquire(1);
}
```

- 唤醒机制：release 后 LockSupport.unpark 队头节点的后继线程，这就是排队线程被逐个唤醒获取锁的过程，也是「可重入、可排队」的底层支撑。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [synchronized 的原理与锁升级](/language/synchronized-principle)
- [线程池的核心参数与工作流程](/language/threadpool-params)
