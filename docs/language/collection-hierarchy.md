---
title: Java 集合框架总览
category: 编程语言
tags: [集合, Java基础]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

梳理一下 Java 集合框架的整体体系？实际开发中各实现类怎么选？fail-fast 和 fail-safe 有什么区别？

## 核心答案

- **两大顶层接口**：Collection 下分 List、Set、Queue 三大分支；Map 是独立的键值对体系，不继承 Collection；
- **List 有序可重复**：ArrayList 动态数组、随机访问 O(1)；LinkedList 双向链表、头尾插 O(1)，但实际多数场景 ArrayList 更优；
- **Set 不可重复**：HashSet 底层复用 HashMap 无序；TreeSet 基于红黑树按排序规则有序；LinkedHashSet 用链表维护插入顺序；
- **Map 选型**：HashMap 无序，TreeMap 按 key 排序，LinkedHashMap 保插入/访问顺序，并发场景用 ConcurrentHashMap 而非 Hashtable；
- **fail-fast**：迭代时检测到结构性修改立即抛 ConcurrentModificationException，原理是比对集合的 modCount 与迭代器记录的 expectedModCount；
- **fail-safe**：CopyOnWriteArrayList、ConcurrentHashMap 等的迭代器基于复制快照或弱一致性遍历，不抛异常，但可能读到旧数据。

## 深度解析

- 单线程遍历中删除元素：用 `iterator.remove()` 或 JDK 8 的 `list.removeIf(...)`；直接调 `list.remove()` 会让 modCount 变化触发 fail-fast。

```java
// fail-fast 本质：迭代器 next() 前检查修改次数
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```

- CopyOnWriteArrayList 适合读多写极少：每次写都复制整个新数组再替换引用，读无锁；写多时内存与复制开销不可接受。
- 选型口诀：随机访问多选 ArrayList，要排序选 TreeMap/TreeSet，要 LRU 缓存用 LinkedHashMap（accessOrder=true）重写 removeEldestEntry。
- 追问点：为什么 LinkedList 实际很少用？——每个节点额外存两个指针内存开销大，且内存不连续对 CPU 缓存不友好，连续内存的 ArrayList 大多数时候更快。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [HashMap 的底层实现原理](/language/hashmap-principle)
- [ConcurrentHashMap 如何保证线程安全](/language/concurrenthashmap-principle)
