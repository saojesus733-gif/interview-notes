---
title: 事务隔离级别与 MVCC
category: 数据库
tags: [MySQL, 事务, MVCC, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

MySQL 有哪几种事务隔离级别，分别对应哪些并发问题？
InnoDB 默认的 RR 级别下 MVCC 是怎么实现的，幻读被彻底解决了吗？

## 核心答案

- **四个级别**：读未提交（RU）→ 读已提交（RC）→ 可重复读（RR）→ 串行化；
  隔离性依次增强，并发性能依次下降；
- **对应并发问题**：RU 存在脏读；RC 解决脏读仍有不可重复读；
  RR 再解决不可重复读；串行化全部解决但并发最差；
- **InnoDB 默认 RR**：靠「MVCC 快照读 + 间隙锁/临键锁当前读」两条路径把幻读基本挡住；
- **版本链**：每行隐藏字段 trx_id 记录最后修改事务，roll_pointer 指向 undo log 里的历史版本；
  多个版本串成链表，供不同事务各取所需；
- **ReadView**：快照读时记录当前活跃事务列表，按可见性规则沿版本链找到对自己可见的版本；
- **RC 与 RR 的本质区别**：RC 每次查询生成新的 ReadView，RR 只在第一次快照读时生成并全程复用。

## 深度解析

- 可见性判断：trx_id 小于 min_trx_id 可见；大于等于 max_trx_id 不可见；在活跃列表中不可见，否则可见；不可见就沿 roll_pointer 回溯旧版本，直到可见。
- 防幻读两条路径：快照读靠 MVCC，当前读（FOR UPDATE / UPDATE / DELETE）靠临键锁；先快照读后当前读混用时仍可能出现幻读。
- 常见误区：说「RR 完全解决了幻读」不严谨——只是很大程度上避免；彻底解决要串行化或全部加锁读。
- 追问点：为什么很多公司改用 RC？没有间隙锁、锁冲突与死锁更少，但要求 binlog 使用 ROW 格式保证复制安全。
- undo log 版本不能立刻删除，要供可能存在的活跃 ReadView 回溯，由后台 purge 线程延迟清理。

```sql
-- RR 与 RC 的行为差异
BEGIN;
SELECT * FROM account WHERE id = 1;  -- 第一次快照读，生成 ReadView
SELECT * FROM account WHERE id = 1;  -- RR：结果不变；RC：能看到别的事务已提交的修改
COMMIT;
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [MySQL 的锁：行锁、间隙锁、临键锁](/database/mysql-locks)
- [redo log、undo log、binlog 的作用与区别](/database/mysql-redo-undo-binlog)
- [MySQL 索引为什么用 B+ 树](/database/mysql-index)
