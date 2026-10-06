---
title: 二叉树的层序遍历
category: 算法与数据结构
tags: [二叉树, BFS, 队列]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给你二叉树的根节点 `root`，返回其节点值的层序遍历结果：逐层地、从左到右访问所有节点，返回二维数组，每个子数组对应一层。

示例：

- 输入：`root = [3,9,20,null,null,15,7]`，输出：`[[3],[9,20],[15,7]]`
- 输入：`root = []`，输出：`[]`

## 核心答案

- 核心思想：BFS 用队列实现，「按层划分」的关键是每轮循环开始时先固化当前队列长度 size，它恰好等于当前层的节点数。
- 关键步骤：根节点入队 -> 每轮只出队 size 个节点并收集本层值 -> 把出队节点的非空孩子入队（它们属于下一层）-> 队列为空时结束。
- 易混淆点：不能在 for 循环条件里直接写 `queue.size()`，因为循环体内入队会让边界动态变化、层与层混在一起，必须先固化 size。
- 复杂度：每个节点进出队各一次，时间 O(n)；空间 O(w)，w 为树的最大宽度，最坏 O(n)。
- 也可以用 DFS 递归实现：携带深度参数，把值放进 `res.get(depth)`，但面试更常考队列写法。

## 深度解析

参考实现：队列按层处理，处理每层前先固定队列长度。

```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();             // 固化当前层节点数
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {     // 只处理当前层的节点
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);  // 下一层入队
            if (node.right != null) queue.offer(node.right);
        }
        res.add(level);
    }
    return res;
}
```

- 易错点：忘记对 root 判空；循环条件误写成 `i < queue.size()`，导致分层错乱；层内结果忘记新建 List 造成引用复用。
- 变体题：锯齿形层序遍历（奇偶层正反交替，用双端队列或每层结果反转）、二叉树的右视图（取每层最后一个节点）、每层最大值。
- 延伸追问：DFS 版怎么写？如何求二叉树的最小深度？为什么空间复杂度和树的宽度有关？

## 我的理解

## 关联题目
- [零钱兑换（Coin Change）](/algorithm/coin-change)
- [有效的括号](/algorithm/valid-parentheses)
