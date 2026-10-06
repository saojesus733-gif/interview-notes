---
title: 合并区间
category: 算法与数据结构
tags: [排序, 区间, 数组]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

以数组 `intervals` 表示若干个区间的集合，其中单个区间为 `intervals[i] = [start_i, end_i]`。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。

示例：

- 输入：`intervals = [[1,3],[2,6],[8,10],[15,18]]`，输出：`[[1,6],[8,10],[15,18]]`（[1,3] 与 [2,6] 重叠，合并为 [1,6]）
- 输入：`intervals = [[1,4],[4,5]]`，输出：`[[1,5]]`（端点相等视为重叠）

## 核心答案

- 核心思想：按区间左端点排序后，重叠区间必然相邻，一遍扫描依次合并即可。
- 关键步骤：排序 -> 维护结果列表，比较「当前区间的左端点」与「结果中最后一个区间的右端点」。
- 边界判断：当前左端点 <= 上一区间右端点则重叠，合并时右端点取两者较大值（不能直接覆盖，如 [1,10],[2,3]）；否则不重叠，直接加入。
- 复杂度：排序 O(n log n) 主导，合并扫描 O(n)；空间 O(log n)（排序递归栈），不计输出。
- 思路可推广到插入区间、求区间交集等问题，本质都是排序后对端点做关系判断。

## 深度解析

参考实现：按左端点排序后一遍扫描合并，注意端点相等也算重叠。

```java
public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0])); // 按左端点升序
    List<int[]> merged = new ArrayList<>();
    for (int[] cur : intervals) {
        if (merged.isEmpty() || cur[0] > merged.get(merged.size() - 1)[1]) {
            merged.add(cur);                       // 不重叠：作为新区间加入
        } else {
            int[] last = merged.get(merged.size() - 1);
            last[1] = Math.max(last[1], cur[1]);   // 重叠：延伸右端点取较大值
        }
    }
    return merged.toArray(new int[0][]);
}
```

- 易错点：合并时直接写 `last[1] = cur[1]`，漏掉前一个右端点更大的情况；比较器若写 `a[0] - b[0]` 在极端数值下可能溢出，用 `Integer.compare` 更稳。
- 变体题：插入区间（先合并再插入或边插边合并）、无重叠区间（求最少移除数，贪心按右端点排序）、区间列表的交集。
- 延伸追问：为什么排序后合并不会漏？按右端点排序可行吗？区间数量极大内存放不下怎么办？

## 我的理解

## 关联题目
- [手写快速排序](/algorithm/quicksort)
- [两数之和（Two Sum）](/algorithm/two-sum)
