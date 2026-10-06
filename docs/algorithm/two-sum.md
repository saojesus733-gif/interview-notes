---
title: 两数之和（Two Sum）
category: 算法与数据结构
tags: [哈希表, 数组]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给定一个整数数组 `nums` 和一个整数目标值 `target`，请找出数组中和为目标值的那两个整数，并返回它们的数组下标。可以按任意顺序返回答案。假设每种输入恰好只有一个答案，且同一个元素不能使用两次。

示例：

- 输入：`nums = [2,7,11,15]`，`target = 9`，输出：`[0,1]`（因为 `2 + 7 = 9`）
- 输入：`nums = [3,2,4]`，`target = 6`，输出：`[1,2]`

## 核心答案

- 核心思想：用哈希表记录「值 -> 下标」，把查找配对元素的过程从 O(n) 降到 O(1)，实现一次遍历。
- 关键步骤：对每个元素先计算 `complement = target - 当前值`，查询哈希表中是否已存在该补数；存在则直接返回两个下标。
- 注意先查后存：先查询再插入当前元素，天然避免把同一元素匹配给自己。
- 复杂度：时间 O(n)，空间 O(n)；暴力双重循环是 O(n²)/O(1)，面试应主动说明这一优化权衡。
- 若数组已有序，可改用首尾双指针，空间降为 O(1)（对应变体两数之和 II）。

## 深度解析

参考实现：哈希表一次遍历，每个元素只做一次查询与一次写入。

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>(); // 值 -> 下标
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {       // 先查补数是否出现过
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);                     // 再存自己，避免匹配到自己
    }
    return new int[0];                           // 题目保证有解，此行兜底
}
```

- 易错点：先 put 再查，在 `target = 2x` 时会把同一元素匹配给自己；由于先查后存，数组中有重复值时覆盖也不影响正确性。
- 变体题：两数之和 II（有序数组双指针，空间 O(1)）、三数之和（排序 + 固定一个数 + 双指针去重）、两数之和 III（设计 add/find）。
- 延伸追问：HashMap 为什么查询是 O(1)？若要返回所有不重复组合如何去重？数据量超过内存怎么办？

## 我的理解

## 关联题目
- [合并区间](/algorithm/merge-intervals)
- [二分查找及其变体](/algorithm/binary-search-variants)
