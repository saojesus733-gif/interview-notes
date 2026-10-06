---
title: redo log、undo log、binlog 的作用与区别
category: 数据库
tags: [MySQL, 日志, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

MySQL 的 redo log、undo log、binlog 三大日志各自解决什么问题？
为什么有了 binlog 还要 redo log，两阶段提交到底在保证什么？

## 核心答案

- **redo log**：InnoDB 引擎层物理日志，记录「某数据页做了什么改动」；
  WAL 先写日志再刷数据页，用于崩溃重放，保证已提交修改不丢；
- **undo log**：InnoDB 逻辑日志，记录反向操作；
  用于事务回滚，同时是 MVCC 版本链的基础，支撑一致性读；
- **binlog**：Server 层逻辑日志，记录 SQL 或行变更；
  用于主从复制、按时间点恢复与归档，与存储引擎无关；
- **写入方式差异**：redo log 固定大小循环写，checkpoint 推进覆盖旧位置；
  binlog 追加写，写满切换新文件，可长期保留做归档；
- **层次差异**：redo/undo 属于 InnoDB 引擎层，binlog 属于 Server 层；
  引擎可以替换，但 binlog 任何引擎都绕不开；
- **两阶段提交**：redo log prepare → 写 binlog → redo log commit；
  保证 redo 与 binlog 逻辑一致，防止崩溃恢复后主从数据不一致。

## 深度解析

- 反证法：先 redo 后 binlog，宕机时主库恢复了修改但从库没有；
  先 binlog 后 redo，从库多出主库没有的修改——都会造成主从不一致。
- 崩溃恢复规则：redo 处于 prepare 且对应 binlog 完整则提交，否则回滚；
  binlog 是「事务是否生效」的最终裁判，这也是它无法被 redo 取代的原因。
- 常见误区：undo 不是 redo 的反义词——redo 保证已提交的不丢，undo 保证未提交的可撤销，一个向前滚一个向后滚。
- 双 1 配置：`innodb_flush_log_at_trx_commit=1` + `sync_binlog=1` 最安全但每次提交都刷盘；高吞吐场景会放宽，接受小概率丢失。
- 追问点：组提交（group commit）把多次提交的刷盘动作合并；
  redo log 与 binlog 各自支持组提交，高并发下显著提升 TPS。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [事务隔离级别与 MVCC](/database/mysql-transaction-isolation)
- [MySQL 主从复制与主从延迟](/database/mysql-master-slave)
