---
title: LRU 缓存（LeetCode 146）
category: 算法与数据结构
tags: [LRU, 设计, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

请你设计并实现满足 LRU（最近最少使用）缓存约束的数据结构，要求 `get` 与 `put` 的时间复杂度均为 O(1)。

- `LRUCache(int capacity)`：以正整数容量初始化缓存。
- `int get(int key)`：key 存在则返回其值（本次访问视为一次使用），不存在则返回 -1。
- `void put(int key, int value)`：key 已存在则变更其值；不存在则插入键值对。若插入后键数超过容量，逐出最久未使用的 key。

示例：容量为 2 时，依次执行 `put(1,1)`、`put(2,2)`、`get(1)`（返回 1）、`put(3,3)`（逐出 key=2）、`get(2)`（返回 -1）、`put(4,4)`（逐出 key=1）、`get(1)`（返回 -1）、`get(3)`（返回 3）、`get(4)`（返回 4）。

## 核心答案

- 核心思想：哈希表 + 双向链表。哈希表存「key -> 链表节点」实现 O(1) 定位，双向链表维护使用顺序：头侧最新、尾侧最旧。
- get：哈希表查不到返回 -1；查到则把节点移到链表头部，再返回值。
- put：key 已存在则更新值并移到头部；不存在则头插新节点，若超过容量则删除尾节点并同步删除哈希表中的映射。
- 为什么单链表不够：单链表删除任意节点必须先从头遍历找前驱，是 O(n)；双向链表持有节点引用即可 O(1) 自摘，这正是必须手写双向链表的原因。
- 复杂度：get/put 均 O(1)，空间 O(capacity)。Java 可用 `LinkedHashMap(accessOrder=true)` 一行实现，面试通常要求手写底层结构。

## 深度解析

参考实现：哈希表加带哨兵的双向链表，两个哨兵节点省去对头尾的特判。

```java
class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0); // 哨兵头：next 方向是最新数据
    private final Node tail = new Node(0, 0); // 哨兵尾：prev 方向是最旧数据
    private final int cap;

    public LRUCache(int capacity) {
        cap = capacity;
        head.next = tail; tail.prev = head;
    }

    public int get(int key) {
        Node node = map.get(key);
        if (node == null) return -1;
        moveToHead(node);            // 访问即提升为最新
        return node.val;
    }

    public void put(int key, int value) {
        Node node = map.get(key);
        if (node != null) { node.val = value; moveToHead(node); return; } // 已存在：更新并提前
        if (map.size() >= cap) {     // 超容量：先逐出尾部最旧节点
            Node last = tail.prev;
            map.remove(last.key);    // 同步删除哈希映射，易漏
            remove(last);
        }
        Node fresh = new Node(key, value);
        map.put(key, fresh);
        addToHead(fresh);
    }

    private void remove(Node n) { n.prev.next = n.next; n.next.prev = n.prev; } // O(1) 摘除
    private void addToHead(Node n) { // 头插到哨兵头之后
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
    private void moveToHead(Node n) { remove(n); addToHead(n); }
}
```

- 易错点：逐出节点时忘记同步删哈希表映射；put 更新已有 key 时忘记移到头部；容量判断要在插入之前做；链表摘除漏更新 tail.prev。
- 变体题：LFU 缓存（按访问频次逐出、频次相同再淘汰最久未使用），思路一句话：频次分桶 + 桶内双向链表 + 维护 minFreq。
- 延伸追问：为什么不直接用 LinkedHashMap？多线程环境下如何改造？Redis 的近似 LRU 与严格 LRU 有什么差别？

## 我的理解

## 关联题目
- [反转链表](/algorithm/reverse-linked-list)
- [两数之和（Two Sum）](/algorithm/two-sum)
