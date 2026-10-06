---
title: 反转链表
category: 算法与数据结构
tags: [链表, 双指针]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给你单链表的头节点 `head`，请你反转链表，并返回反转后的链表。要求掌握迭代与递归两种写法。

示例：

- 输入：`head = [1,2,3,4,5]`，输出：`[5,4,3,2,1]`
- 输入：`head = []`，输出：`[]`

## 核心答案

- 核心思想（迭代）：逐节点改指向，用 prev / curr / next 三个指针，把 curr.next 改指向 prev，再整体右移。
- 关键步骤：暂存 next 防断链 -> curr.next = prev 完成反转 -> prev、curr 右移；循环结束时 prev 即新头节点。
- 递归思路：先递归反转 head 之后的子链表得到新头 newHead，再执行 head.next.next = head 把自己挂到尾部，最后 head.next = null 断开旧指向防止成环。
- 复杂度：时间均为 O(n)；迭代空间 O(1)，递归空间 O(n)（函数调用栈）。
- 面试建议：先写迭代版并画图演示指针变化，再口述递归版，体现对两种范式的掌握。

## 深度解析

参考实现一：迭代三指针，注意先暂存 next。

```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next; // 暂存后继，防止断链
        curr.next = prev;          // 反转当前节点指向
        prev = curr;               // prev 前移到已反转部分
        curr = next;               // 处理下一个节点
    }
    return prev;                   // prev 即新头节点
}
```

参考实现二：递归写法，注意终止条件与断链。

```java
public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) return head; // 空链表或最后一个节点
    ListNode newHead = reverseList(head.next);          // 先反转后半部分
    head.next.next = head;                              // 后继节点指回自己
    head.next = null;                                   // 断开旧指向，避免成环
    return newHead;                                     // 新头一路向上传递
}
```

- 易错点：忘记暂存 next 导致断链；循环结束误返回 curr（其实是 null）；递归版漏写 head.next = null 造成环形链表。
- 变体题：K 个一组翻转链表（LeetCode 25）、反转链表 II（区间反转，LeetCode 92）、回文链表（找中点 + 反转后半段）。
- 延伸追问：如何只反转 [m, n] 区间？递归为什么是 O(n) 空间？能否用显式栈模拟递归？

## 我的理解

## 关联题目
- [LRU 缓存（LeetCode 146）](/algorithm/lru-cache)
