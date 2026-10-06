---
title: 零钱兑换（Coin Change）
category: 算法与数据结构
tags: [动态规划, 背包]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

给你整数数组 `coins` 表示不同面额的硬币，以及整数 `amount` 表示总金额。计算凑成总金额所需的最少硬币个数；若任何组合都凑不出，返回 -1。每种硬币数量无限。

示例：

- 输入：`coins = [1,2,5]`，`amount = 11`，输出 `3`（5 + 5 + 1）
- 输入：`coins = [2]`，`amount = 3`，输出 `-1`
- 输入：`coins = [1]`，`amount = 0`，输出 `0`

## 核心答案

- 核心思想：完全背包型动态规划。定义 `dp[i]` 为凑出金额 i 的最少硬币数，状态转移 `dp[i] = min(dp[i - coin] + 1)`，对每种可用硬币取最小。
- 初始化：`dp[0] = 0`；其余设为「不可能的大值」amount + 1（不要用 Integer.MAX_VALUE，转移时 +1 会溢出）。
- 遍历顺序：外层金额 1..amount、内层硬币即可；求最小值时内外层顺序不影响正确性。
- 无解判断：最终 `dp[amount] > amount` 说明凑不出，返回 -1。贪心（每次取最大面额）在本题不成立，如 coins=[1,3,4]、amount=6：贪心得 4+1+1 共 3 枚，最优是 3+3 共 2 枚。
- 复杂度：时间 O(amount × coins.length)，空间 O(amount)；变体也可用 BFS 按层扩展金额求最少枚数。

## 深度解析

参考实现：一维完全背包求最少物品数，初始化与无解判断是关键。

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);          // amount+1 表示暂时凑不出，转移 +1 也不会溢出
    dp[0] = 0;                            // 金额 0 需要 0 枚硬币
    for (int i = 1; i <= amount; i++) {   // 枚举每个金额
        for (int coin : coins) {          // 尝试每种硬币
            if (coin <= i && dp[i - coin] + 1 < dp[i]) {
                dp[i] = dp[i - coin] + 1; // 状态转移：最后使用一枚 coin
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

- 易错点：初始化用 Integer.MAX_VALUE，转移 +1 后溢出成负数；未判断 `coin <= i` 导致数组越界；误以为排序后贪心可得最优。
- 变体题：零钱兑换 II（求凑法种数的计数型完全背包，`dp[i] += dp[i - coin]`，必须外层硬币、内层金额，避免同一组合被重复计数）。
- 延伸追问：如何输出具体的硬币组合？为什么本题内外层顺序无所谓而计数版必须固定？BFS 解法如何保证每个金额只入队一次？

## 我的理解

## 关联题目
- [二叉树的层序遍历](/algorithm/binary-tree-level-order)
