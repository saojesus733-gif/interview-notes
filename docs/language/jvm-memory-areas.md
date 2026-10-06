---
title: JVM 内存区域划分
category: 编程语言
tags: [JVM, 内存, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

JVM 运行时内存是怎么划分的？哪些区域线程共享、哪些线程私有？各区域可能抛出什么异常？

## 核心答案

- **堆（Heap）**：线程共享，对象实例的主要分配区域，分新生代（Eden + 两个 Survivor）和老年代，是 GC 的主战场；
- **方法区（JDK 8 起为元空间 Metaspace）**：线程共享，存类元信息、运行时常量池；元空间使用本地内存，默认无上限，字符串常量池在堆中；
- **虚拟机栈**：线程私有，每个方法对应一个栈帧（局部变量表、操作数栈、动态链接、方法返回地址）；
- **本地方法栈**：线程私有，为 native 方法服务，HotSpot 中与虚拟机栈合二为一；
- **程序计数器**：线程私有，记录当前线程执行到的字节码行号，是唯一不会 OOM 的区域；
- **异常**：栈深度超限抛 StackOverflowError；堆或元空间空间不足抛 OutOfMemoryError。

## 深度解析

- 线程共享：堆、方法区；线程私有：虚拟机栈、本地方法栈、程序计数器——私有的原因是要保证线程切换后能恢复到正确的执行位置和现场。
- 永久代 → 元空间：JDK 8 移除永久代，类元数据放到本地内存，解决了永久代大小难估、易抛 PermGen OOM 的问题；静态变量 JDK 8 后随 Class 对象存放在堆中。
- 对象分配路径：优先在 Eden 分配，Eden 满触发 Minor GC，存活对象在两个 Survivor 间来回复制，年龄到 15（默认）晋升老年代，大对象直接进老年代。

```java
// 无限递归：栈帧不断入栈，最终抛 StackOverflowError
void loop() {
    loop();
}
```

- 调参对应关系：-Xms/-Xmx 控制堆、-Xss 控制栈大小、-XX:MetaspaceSize 控制元空间初始阈值；排查 OOM 先看是哪个区域、配合堆转储分析。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [GC 算法与常见垃圾回收器](/language/gc-algorithms-collectors)
- [HashMap 的底层实现原理](/language/hashmap-principle)
