---
title: 无重复字符的最长子串
category: 算法与数据结构
tags: [滑动窗口, 双指针, 字符串]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给定一个字符串 `s`，请你找出其中不含有重复字符的最长子串的长度。子串必须连续，子序列不算。

示例：

- 输入：`"abcabcbb"`，输出 `3`（最长子串是 `"abc"`）
- 输入：`"bbbbb"`，输出 `1`
- 输入：`"pwwkew"`，输出 `3`（`"wke"`；注意 `"pwke"` 是子序列而非子串）

## 核心答案

- 核心思想：滑动窗口。维护左右指针围出的「无重复字符」窗口：右指针扩张探索，出现重复时移动左指针收缩，保证窗口内始终无重复。
- 关键数据结构：数组或哈希表记录每个字符「最后一次出现的下标」，重复时无需逐位收缩，左边界直接跳到重复位置的下一位。
- 窗口收缩逻辑：当 `last[c] >= left`（重复字符在当前窗口内）才令 `left = last[c] + 1`；若重复字符在窗口外则不能回退 left，这是最易出错的边界。
- 每步用 `right - left + 1` 更新答案；时间 O(n)（左右指针各最多走 n 步），空间 O(字符集大小)。
- 对比暴力 O(n²)/O(n³)：滑动窗口的本质是左右指针都永不回退，把重复比较消掉。

## 深度解析

参考实现：用 128 长度数组记录字符最后出现位置，比 HashMap 常数更小。

```java
public int lengthOfLongestSubstring(String s) {
    int[] last = new int[128];               // 记录字符最后出现的下标，-1 表示未出现
    Arrays.fill(last, -1);
    int res = 0, left = 0;                   // left 为窗口左边界
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (last[c] >= left) {               // 重复字符在窗口内，左边界跳到它下一位
            left = last[c] + 1;
        }
        last[c] = right;                     // 更新字符最后出现位置
        res = Math.max(res, right - left + 1);
    }
    return res;
}
```

- 易错点：收缩条件只写 `last[c] != -1` 漏掉 `>= left` 判断，`"abba"` 用例会让 left 错误回退；忘记更新 last[c]；答案少加 1。
- 变体题：至多包含两个不同字符的最长子串、长度最小的子数组（同向双指针求最短）、字符串的排列（窗口计数匹配）。
- 延伸追问：滑动窗口适用的前提是什么（窗口扩大/收缩具有单调性）？字符集是 Unicode 怎么办？如何输出子串本身？

## 我的理解

## 关联题目
- [两数之和（Two Sum）](/algorithm/two-sum)
- [合并区间](/algorithm/merge-intervals)
