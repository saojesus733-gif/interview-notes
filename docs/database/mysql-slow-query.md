---
title: 一条慢 SQL 如何优化
category: 数据库
tags: [MySQL, 性能优化, 慢查询]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

线上一条 SQL 执行得很慢，你的完整排查和优化思路是什么？
EXPLAIN 的结果你会重点看哪些字段，分别说明什么？

## 核心答案

- **先定位再动手**：开启慢查询日志（slow_query_log、long_query_time）或用监控平台圈定问题 SQL，再 EXPLAIN 分析执行计划；
- **看 type**：system/const > eq_ref > ref > range > index > ALL；
  出现 ALL 全表扫描是最需要关注的信号；
- **看 key / rows / Extra**：key 是否命中预期索引、rows 预估扫描行数是否过大；
  Extra 出现 Using filesort、Using temporary 都要警惕；
- **索引手段**：为 WHERE、ORDER BY、JOIN 列建或改联合索引（注意最左前缀）；
  用覆盖索引避免回表，必要时调整列顺序配合排序；
- **SQL 改写**：只查需要的列、深分页改游标或延迟关联、大事务拆小；
  避免对索引列做函数运算和隐式转换；
- **架构手段**：热点数据上缓存、读写分离分摊读压力；
  数据量或并发太大时考虑冷数据归档、分库分表。

## 深度解析

- 深分页优化：`LIMIT 1000000, 10` 要先扫过并丢弃一百万行；
  改成「子查询先定位 id 再回表」的延迟关联，或用游标 `WHERE id > 上次最大值 LIMIT 10`。
- Using filesort 说明排序没有用到索引顺序：按「等值条件列 + 排序列」的顺序建联合索引，让 ORDER BY 直接走索引序。
- 常见误区：加了索引不等于一定走——受统计信息、回表代价影响，可用 ANALYZE TABLE 更新统计信息，或 FORCE INDEX 验证。
- 追问点：EXPLAIN ANALYZE（8.0.18+）能展示真实执行耗时与实际行数，比 EXPLAIN 的预估值更可靠。

```sql
-- 延迟关联优化深分页
SELECT t.* FROM orders t
JOIN (SELECT id FROM orders ORDER BY create_time LIMIT 1000000, 10) tmp
  ON t.id = tmp.id;
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [MySQL 索引失效的常见场景](/database/mysql-index-failure)
- [MySQL 索引为什么用 B+ 树](/database/mysql-index)
