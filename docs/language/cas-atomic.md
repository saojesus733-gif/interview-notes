---
title: CAS 机制与原子类
category: 编程语言
tags: [CAS, 并发, 原子类]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

CAS 是什么，底层靠什么实现？AtomicInteger 为什么能保证原子性？ABA 问题是什么，怎么解决？

## 核心答案

- **CAS 三操作数**：内存值 V、期望值 E、新值 N——仅当 V == E 时才把 V 更新为 N，否则失败重试（自旋）；
- **底层实现**：JVM 通过 Unsafe 的 compareAndSwapXxx 方法映射到 CPU 原子指令（x86 的 cmpxchg + lock 前缀），由硬件保证「比较并交换」的原子性；
- **AtomicInteger 原理**：value 用 volatile 修饰保证可见性与有序性，自增等操作在 Unsafe.getAndAddInt 里 do-while 自旋 CAS 保证原子性；
- **ABA 问题**：值从 A 改成 B 又改回 A，CAS 发现不了中间变化；用 AtomicStampedReference 加版本号（stamp）解决；
- **自旋开销**：高竞争下 CAS 反复失败空转浪费 CPU；LongAdder 用 Cell 数组分段累加，把热点分散、读取时汇总，用弱一致性换高吞吐；
- **局限**：CAS 只能保证单个变量原子性，多个变量要用锁，或封装成对象后用 AtomicReference。

## 深度解析

```java
// AtomicInteger 自增的核心：自旋 + CAS
public final int getAndIncrement() {
    return Unsafe.getAndAddInt(this, valueOffset, 1);
}
// Unsafe 内部等价于：
// int old;
// do { old = getIntVolatile(o, offset); }
// while (!compareAndSwapInt(o, offset, old, old + delta));
```

- LongAdder 快的原因：AtomicLong 所有线程竞争同一个 value，LongAdder 把写压力分散到多个 Cell（类似分段锁思想），sum() 读取时汇总；代价是读取到的不是精确瞬时值，适合计数统计场景。
- volatile 与 CAS 的配合：volatile 保证读到的是最新值、写入立即刷回主存，避免拿着旧值去 CAS 一直失败白转。
- 追问点：CAS 一定比锁快吗？——低竞争下成立；高竞争下大量自旋空转，可能不如锁直接阻塞挂起线程省资源。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [AQS 的原理与 ReentrantLock](/language/aqs-reentrantlock)
- [Java 内存模型（JMM）与 volatile](/language/java-memory-model-volatile)
