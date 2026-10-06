---
title: MySQL 索引失效的常见场景
category: 数据库
tags: [MySQL, 索引, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

面试中经常追问：明明表上建了索引，为什么这条 SQL 的执行计划却没有走索引？
请结合具体场景说说索引失效的常见原因、背后的原理与排查思路。

## 核心答案

- **最左前缀被破坏**：联合索引 (a, b, c) 必须从最左列开始连续匹配；
  查询缺少 a 列直接失效，a 用了范围查询后，b、c 无法继续使用索引；
- **对索引列做函数或运算**：如 `WHERE YEAR(create_time) = 2024`、`WHERE id + 1 = 10`；
  B+ 树按列的原值有序组织，一旦列被加工，有序性就被破坏；
- **隐式类型转换**：varchar 列用数字查（`WHERE phone = 13800000000`）等价于对列做 CAST，索引失效；
  反过来 `WHERE id = '123'` 是常量侧转换，不影响；
- **前导模糊**：`LIKE '%abc'` 无法定位前缀范围；`LIKE 'abc%'` 可以正常走索引；
- **OR 混合无索引列**：`WHERE a = 1 OR d = 2`；
  只要 OR 两侧有一列无索引，通常整体退化为全表扫描（除非优化器走 index merge）；
- **优化器主动放弃**：回表代价过高、返回行占比过大或统计信息过期时，优化器认为全表扫描更快而弃用索引。

## 深度解析

- 本质原因只有一个：索引按「索引列的原值」组织有序结构，任何对列的加工都破坏了这个前提；而优化器放弃属于成本权衡，不是结构性失效。
- 隐式转换方向要记牢：字符串列与数字比较时，MySQL 把列值转成数字（列侧失效）；数字列与字符串比较则转常量（不失效）。
- `NOT IN`、`!=`、`IS NOT NULL` 不一定失效，取决于优化器成本估算与取值分布，不要背「必失效」的结论。
- 追问点：索引下推（ICP）在引擎层先用联合索引的剩余列过滤再回表，属于「部分走索引」的优化，能减少无效回表。
- 排查：EXPLAIN 看 type/key/rows/Extra；怀疑统计信息不准可 ANALYZE TABLE，验证可用 FORCE INDEX 对比成本。

```sql
EXPLAIN SELECT * FROM user WHERE phone = 13800000000;   -- varchar 列传数字，不走索引
EXPLAIN SELECT * FROM user WHERE phone = '13800000000'; -- 类型匹配，正常走索引
```

预防比救火更重要：建表时定准字段类型，SQL 规范禁止对索引列包函数，上线前用 EXPLAIN 做审查卡口。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [MySQL 索引为什么用 B+ 树](/database/mysql-index)
- [一条慢 SQL 如何优化](/database/mysql-slow-query)
- [事务隔离级别与 MVCC](/database/mysql-transaction-isolation)
