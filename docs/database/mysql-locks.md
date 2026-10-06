---
title: MySQL 的锁：行锁、间隙锁、临键锁
category: 数据库
tags: [MySQL, 锁, InnoDB]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

InnoDB 的行锁到底锁在哪里？间隙锁和临键锁分别解决什么问题？
线上出现大量锁等待甚至死锁，你会怎么排查和处理？

## 核心答案

- **行锁锁在索引记录上**：查询条件命中索引才可能用行锁；
  条件无索引可用时会扫全表并锁住扫过的记录，效果近似锁全表；
- **记录锁（Record Lock）**：锁住单条索引记录，S 锁共享读、X 锁互斥写；
- **间隙锁（Gap Lock）**：锁住两条记录之间的开区间，只阻止其他事务插入；
  间隙锁之间相互兼容，RR 级别下用于防止幻读；
- **临键锁（Next-Key Lock）**：记录锁加上前面的间隙，即左开右闭区间；
  RR 下当前读的默认加锁单位；
- **意向锁**：表级标记锁，表示「表里已有行锁」；
  让表锁请求不必逐行检查就能快速判断冲突；
- **排查入口**：锁等待查 `performance_schema.data_lock_waits`（8.0）；
  死锁看 `SHOW ENGINE INNODB STATUS` 的 LATEST DETECTED DEADLOCK。

## 深度解析

- RR 加锁规则：默认给扫描到的范围加临键锁；唯一索引等值命中退化为记录锁，等值未命中退化为间隙锁；普通索引等值命中还要继续向右遍历到第一个不满足的值。
- 死锁典型成因：两个事务以不同顺序加锁；或间隙锁相互兼容后，双方又阻塞了对方的插入意向锁。
- 应对手段：统一加锁顺序、缩小事务范围、给查询条件建对索引、必要时降低隔离级别到 RC。
- 超时与死锁是两回事：锁等待由 `innodb_lock_wait_timeout`（默认 50s）兜底；死锁由 InnoDB 主动检测，立即回滚代价较小的事务。
- 追问点：普通 SELECT 是快照读不加锁，加锁要用 FOR UPDATE（当前读）；UPDATE 带无索引条件是线上锁全表事故的高发原因。

```sql
-- RR 下唯一索引等值未命中：加间隙锁，阻塞区间内的插入
BEGIN;
SELECT * FROM users WHERE id = 10 FOR UPDATE; -- 表中不存在 id=10
-- 另一事务 INSERT INTO users VALUES (10, ...) 会被阻塞直到锁释放
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [事务隔离级别与 MVCC](/database/mysql-transaction-isolation)
- [MySQL 索引为什么用 B+ 树](/database/mysql-index)
