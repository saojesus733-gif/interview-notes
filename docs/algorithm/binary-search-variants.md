---
title: 二分查找及其变体
category: 算法与数据结构
tags: [二分查找, 数组]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给定一个升序排序且可能含有重复元素的整数数组 `nums` 与目标值 `target`，实现以下三个函数：

1. 标准二分：返回等于 target 的任意一个下标，不存在返回 -1。
2. leftmost：返回 target 第一次出现的下标，不存在返回 -1。
3. rightmost：返回 target 最后一次出现的下标，不存在返回 -1。

要求时间复杂度 O(log n)。示例：`nums = [5,7,7,8,8,10]`，`target = 8` 时标准二分返回 3 或 4 均可，leftmost 返回 3，rightmost 返回 4；`target = 6` 时三者都返回 -1。

## 核心答案

- 核心思想：利用有序性每次把搜索区间砍半。推荐统一用左闭右闭区间 `[left, right]`：循环条件 `left <= right`，边界更新 `left = mid + 1`、`right = mid - 1`。
- 求中点写 `mid = left + (right - left) / 2`，避免 `left + right` 直接相加导致大数溢出。
- 变体思路：leftmost 在 `nums[mid] >= target` 时向左收缩，命中先记录 ans 再继续找更左的；rightmost 完全对称（`<=` 时向右收缩）。
- 死循环根因：mid 偏移与边界更新不匹配。例如 `while (left < right)` 里写 `left = mid`，区间剩两个元素时 mid 落在左半、区间无法缩小。原则：`mid ± 1` 配 `left <= right`；若用 `left = mid` 必须让 mid 上取整且条件用 `left < right`。
- 复杂度：时间 O(log n)，空间 O(1)。三个函数本质都能统一到「第一个大于等于 target 的位置」（lower_bound）一套逻辑。

## 深度解析

参考实现：标准模板与两个变体，变体用 flag 参数统一方向，对应 LeetCode 34 的返回形式。

```java
// 标准二分：返回任意一个等于 target 的下标，不存在返回 -1
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;   // 左闭右闭区间
    while (left <= right) {                  // 区间非空才继续
        int mid = left + (right - left) / 2; // 防溢出写法
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// 变体：first=true 找第一个等于 target 的位置，first=false 找最后一个
public int[] searchRange(int[] nums, int target) {
    return new int[]{find(nums, target, true), find(nums, target, false)};
}

private int find(int[] nums, int target, boolean first) {
    int left = 0, right = nums.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ans = mid;                                      // 先记录命中位置
            if (first) right = mid - 1; else left = mid + 1; // 继续向左/向右收缩
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return ans;
}
```

- 易错点：变体命中后直接 return，漏掉更靠左（右）的出现位置；三种模板风格混搭导致死循环或漏判单元素区间；mid 写成 `(left + right) / 2` 有溢出风险。
- 变体题：在排序数组中查找元素的第一个和最后一个位置（LeetCode 34，即本题）、搜索旋转排序数组、x 的平方根、寻找峰值。
- 延伸追问：二分的前提除了有序还需要什么？如何用 lower_bound 统一实现这三个函数？浮点数二分的精度怎么控制？

## 我的理解

## 关联题目
- [手写快速排序](/algorithm/quicksort)
- [两数之和（Two Sum）](/algorithm/two-sum)
