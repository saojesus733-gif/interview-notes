---
title: GC 算法与常见垃圾回收器
category: 编程语言
tags: [GC, JVM, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

JVM 如何判断对象能否回收？主流垃圾回收器有哪些，CMS 和 G1 各有什么优缺点？

## 核心答案

- **存活判断**：可达性分析——从 GC Roots（栈中引用、静态变量、常量、JNI 引用等）出发，不可达的对象即可回收；引用计数法有循环引用问题，JVM 不采用；
- **四种引用**：强引用不回收、软引用内存不足才回收、弱引用下次 GC 必回收、虚引用仅用于跟踪回收过程；
- **基础算法**：标记-清除（简单但产生碎片）、复制（无碎片但浪费空间，适合新生代）、标记-整理（无碎片，适合老年代）；
- **分代收集**：新生代对象朝生夕死用复制算法，老年代存活率高用标记-清除/整理，配合卡表处理跨代引用；
- **CMS vs G1**：CMS 并发标记清除、低停顿但有碎片和并发失败风险；G1 按 Region 划分、回收价值优先、停顿可预测，JDK 9+ 默认；
- **ZGC 一句话**：着色指针 + 读屏障实现并发整理，停顿亚毫秒级且与堆大小无关的低延迟回收器。

## 深度解析

- 对象「死亡」至少经历两次标记：第一次发现不可达后，重写了 finalize 且未执行过的对象进入 F-Queue 二次判断（可自我拯救），实践中不要依赖 finalize。
- 触发条件：Eden 不足触发 Minor GC；老年代空间不足、元空间达到阈值触发 Full GC，Full GC 全堆停顿，是线上排查的重点。
- 排查工具：jstat -gcutil 看各代占用与 GC 次数/耗时，jmap -dump 导堆快照用 MAT 分析，开启 -Xlog:gc*（JDK 9+）或 -XX:+PrintGCDetails 收集 GC 日志。

```java
// 弱引用：下一次 GC 就会被回收，典型应用是 ThreadLocal 的 key
WeakReference<Object> ref = new WeakReference<>(new Object());
```

- CMS 六个阶段中只有初始标记和重新标记需要 STW；并发标记/清理与用户线程并行，因采用标记-清除产生碎片，碎片过多会提前触发 Full GC（退化为 Serial Old，停顿很长）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [JVM 内存区域划分](/language/jvm-memory-areas)
- [Java 内存模型（JMM）与 volatile](/language/java-memory-model-volatile)
