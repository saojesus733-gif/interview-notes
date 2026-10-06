---
title: ThreadLocal 的原理与内存泄漏
category: 编程语言
tags: [ThreadLocal, 并发, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

ThreadLocal 是怎么做到线程间数据隔离的？为什么会发生内存泄漏？用完之后为什么必须调用 remove()？

## 核心答案

- **核心结构**：每个 Thread 内部持有一个 ThreadLocalMap，key 是 ThreadLocal 实例（弱引用），value 是存的值（强引用），数据存在线程自己身上实现隔离；
- **存取原理**：set/get 先取当前线程的 map，再用 ThreadLocal 的 threadLocalHashCode 对容量取模定位 Entry；
- **泄漏原因**：ThreadLocal 实例被回收后 key 变成 null，但 value 仍被 Entry 强引用挂着，线程不死（线程池线程长期存活）就永远回收不掉；
- **必须 remove()**：用完显式 remove() 清除 Entry 才是根治手段；set/get 内部的探测式/启发式清理只是遇到 stale entry 时的兜底，不保证及时；
- **典型用途**：保存用户登录上下文（拦截器 set/finally remove）、SimpleDateFormat 线程安全封装、链路 traceId 传递；
- **与线程池不兼容**：InheritableThreadLocal 只在子线程创建时复制父线程的值，线程池复用线程不重建，值会串用，跨线程池需用 TransmittableThreadLocal。

## 深度解析

```java
// Entry 的 key 是弱引用，value 是强引用
static class Entry extends WeakReference<ThreadLocal<?>> {
    Object value;
    Entry(ThreadLocal<?> k, Object v) { super(k); value = v; }
}
```

- key 设计成弱引用的初衷：外部不再持有 ThreadLocal 时，key 下次 GC 即被回收，给自愈留了入口；若 key 也是强引用，ThreadLocal 对象自身将永远无法回收，泄漏更严重。
- 泄漏的根因不是弱引用，而是「value 强引用 + 线程长存活」；最佳实践是在 try/finally 中调用 remove()。
- 常见误区：把数据隔离理解成「每个 ThreadLocal 一份拷贝」——其实是同一条数据存在各线程自己的 map 里；追问点：key 为 null 的 stale entry 何时清理？——set/get 扫到时顺带 expungeStaleEntry，全不触发就泄漏。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [线程池的核心参数与工作流程](/language/threadpool-params)
- [Java 内存模型（JMM）与 volatile](/language/java-memory-model-volatile)
