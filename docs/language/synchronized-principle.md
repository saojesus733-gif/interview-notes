---
title: synchronized 的原理与锁升级
category: 编程语言
tags: [synchronized, 并发, JVM]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

synchronized 在 JVM 层面是怎么实现的？锁升级的过程是怎样的？它和 ReentrantLock 有什么区别？

## 核心答案

- **字节码层面**：同步代码块编译为 monitorenter / monitorexit 两条指令，同步方法则靠 ACC_SYNCHRONIZED 标志，本质都是获取对象的 monitor（管程）；
- **monitor 实现**：HotSpot 中每个对象关联一个 ObjectMonitor，重量级互斥依赖操作系统的 mutex，线程阻塞涉及用户态/内核态切换，开销大；
- **对象头 Mark Word**：锁状态记录在 Mark Word 里（无锁/偏向/轻量级/重量级，还存 hash 值和 GC 分代年龄）；
- **锁升级路径**：无锁 → 偏向锁（只有一个线程访问，记录线程 ID）→ 轻量级锁（交替竞争，CAS 自旋）→ 重量级锁（竞争激烈，阻塞挂起），基本只升不降；
- **与 ReentrantLock**：synchronized 是 JVM 关键字、自动释放、不可中断；ReentrantLock 是 API 层锁，需手动 unlock，但支持公平锁、可中断、tryLock 超时、多个 Condition。

## 深度解析

- 偏向锁：线程第一次进入时 CAS 把线程 ID 写进 Mark Word，之后同一线程再进入无需任何同步操作；因维护成本高，JDK 15 起已默认废弃偏向锁。
- 轻量级锁：线程栈中创建 Lock Record，CAS 把 Mark Word 指向它；自旋失败（竞争升级）则膨胀为重量级锁，Mark Word 指向 ObjectMonitor 并挂起线程。
- 常见误区：synchronized 锁的是对象而不是代码；两个 equals 相等的对象锁不同实例时互不阻塞；不要用 String 常量、Integer 缓存对象做锁（可能被全局共享）。

```java
// 同步代码块与同步方法的字节码等价形式
synchronized (obj) { /* monitorenter ... monitorexit */ }
public synchronized void m() { /* ACC_SYNCHRONIZED */ }
```

- 反之处：synchronized 自动释放锁（异常也会释放）、JVM 可优化（锁消除、锁粗化），简单场景首选；需要高级功能再换 ReentrantLock。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [AQS 的原理与 ReentrantLock](/language/aqs-reentrantlock)
- [Java 内存模型（JMM）与 volatile](/language/java-memory-model-volatile)
