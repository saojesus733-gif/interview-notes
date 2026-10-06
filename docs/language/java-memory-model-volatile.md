---
title: Java 内存模型（JMM）与 volatile
category: 编程语言
tags: [JMM, volatile, 并发, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

什么是 Java 内存模型？volatile 能解决什么问题、不能解决什么问题？为什么双重检查锁单例需要 volatile？

## 核心答案

- **JMM 抽象**：所有共享变量存在主内存，每个线程有自己的工作内存（变量的私有副本），线程对变量的读写必须在工作内存完成，再回写主内存；
- **可见性问题**：工作内存副本 + 编译器/CPU 优化（缓存、乱序执行）导致一个线程的修改，另一个线程可能看不到；
- **happens-before**：一句话——如果操作 A happens-before 操作 B，则 A 的结果对 B 可见（解锁先于加锁、volatile 写先于读、start/join 规则等）；
- **volatile 语义**：写操作立即刷新到主内存并使其他线程的副本失效（可见性）；插入内存屏障禁止指令重排（有序性）；
- **volatile 不保证原子性**：i++ 是读-改-写三步操作，volatile 管不了，需要 AtomicInteger 或加锁；
- **DCL 单例**：`new` 分三步（分配内存→初始化→引用赋值），重排后可能「引用已赋值但对象未初始化完」，volatile 禁止这个重排。

## 深度解析

- 内存屏障实现：volatile 写后插入 StoreLoad 屏障、读前插入 LoadLoad/LoadStore 屏障，硬件层基于缓存一致性协议（如 MESI）让其他核心的缓存行失效。
- as-if-serial：单线程内重排不能改变执行结果，所以单线程看起来「有序」，并发场景才需要 volatile/synchronized 显式建立 happens-before 关系。

```java
// 双重检查锁单例
public class Singleton {
    private static volatile Singleton instance;
    public static Singleton getInstance() {
        if (instance == null) {              // 第一次检查：避免每次都加锁
            synchronized (Singleton.class) {
                if (instance == null) {      // 第二次检查：防止重复创建
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

- 常见误区：volatile 变量做复合操作依然不安全（如计数）；synchronized 三大特性都保证（原子、可见、有序），volatile 只保证可见性和有序性。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [synchronized 的原理与锁升级](/language/synchronized-principle)
- [GC 算法与常见垃圾回收器](/language/gc-algorithms-collectors)
