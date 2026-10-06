---
title: 手写快速排序
category: 算法与数据结构
tags: [排序, 分治, 手写]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

请手写实现快速排序，对整数数组 `nums` 进行原地升序排序，不得直接调用语言内置的排序函数。

示例：

- 输入：`nums = [5,2,3,1]`，输出：`[1,2,3,5]`
- 输入：`nums = [5,1,1,2,0,0]`，输出：`[0,0,1,1,2,5]`

## 核心答案

- 核心思想：分治。每轮通过 partition（分区）把数组分成「小于基准 pivot」与「大于等于基准」两部分，pivot 落到最终位置，再对两侧递归。
- partition 步骤（Lomuto）：随机选一个下标与末尾交换作 pivot -> 指针 i 维护「小于区」的下一个空位，j 从左向右扫描，遇到小于 pivot 的元素就与 i 交换并 i++ -> 最后把 pivot 换到 i 处返回 i。
- 复杂度：平均时间 O(n log n)、空间 O(log n)（递归栈）；最坏情况（如已有序且固定取端点为 pivot）退化为 O(n²)。
- 防退化：随机选取 pivot 或三数取中；大量重复元素时可改用三路划分（小于/等于/大于）。
- 快排不稳定：相等元素的相对顺序可能改变；可对比归并排序（稳定但需 O(n) 辅助空间）。

## 深度解析

参考实现：Lomuto 分区加随机化 pivot，递归终止条件是 left >= right。

```java
public void quickSort(int[] arr, int left, int right) {
    if (left >= right) return;                 // 区间长度 <= 1，天然有序
    int pivotIdx = partition(arr, left, right);
    quickSort(arr, left, pivotIdx - 1);        // 递归排左半部分
    quickSort(arr, pivotIdx + 1, right);       // 递归排右半部分
}

private int partition(int[] arr, int left, int right) {
    int r = left + (int) (Math.random() * (right - left + 1)); // 随机选 pivot，防有序输入退化
    swap(arr, r, right);                       // 统一把基准放到末尾
    int pivot = arr[right];
    int i = left;                              // i：下一个小于 pivot 的元素应放的位置
    for (int j = left; j < right; j++) {
        if (arr[j] < pivot) {                  // 小于 pivot 的元素换到左区
            swap(arr, i, j);
            i++;
        }
    }
    swap(arr, i, right);                       // pivot 归位到分界点
    return i;
}

private void swap(int[] arr, int i, int j) {
    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
}
```

- 易错点：递归终止写成 `left < right` 且分区不当会死循环；分区循环写成 `j <= right` 会把 pivot 也拿来比较；忘记随机化时面试官常追问「数组已有序你的代码会怎样」。
- 变体题：数组中第 K 大元素（快速选择，只递归一边，平均 O(n)）、颜色分类（三路划分）、手写归并排序。
- 延伸追问：为什么平均是 O(n log n)？最坏何时发生？如何把递归改成显式栈的迭代版？与堆排序如何取舍？

## 我的理解

## 关联题目
- [二分查找及其变体](/algorithm/binary-search-variants)
- [合并区间](/algorithm/merge-intervals)
