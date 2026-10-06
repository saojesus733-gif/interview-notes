---
title: Redis 持久化机制（RDB 与 AOF）
category: 数据库
tags: [Redis, 持久化, 面试高频]
importance: 3
mastery: 未掌握
source: 常见考题
---

## 问题

Redis 的 RDB 和 AOF 两种持久化方式有什么区别？如何选择？

## 核心答案

**RDB（快照）**：

- 定期把内存数据以二进制快照落盘（SAVE/BGSAVE，fork 子进程执行）；
- 文件紧凑、恢复快，但两次快照之间的数据宕机会丢失。

**AOF（追加日志）**：

- 每条写命令追加到 AOF 文件，按 `appendfsync` 策略（always / everysec / no）刷盘；
- 最多丢 1 秒数据（everysec），文件大、恢复慢，需 AOF 重写（bgrewriteaof）压缩体积。

**选择**：两者可同时开启，RDB 做冷备与快速恢复，AOF 保证数据安全；Redis 4.0+ 支持混合持久化（RDB 头 + AOF 增量），兼顾恢复速度与丢失窗口。

## 深度解析

- fork 时的写时复制（COW）：子进程写 RDB 期间父进程的写操作会复制页，极端情况下内存可能翻倍。
- AOF 重写同样由子进程完成，重写期间的新写命令写入 AOF 重写缓冲区，最后追加。
- RDB 文件恢复速度远快于 AOF 重放命令，这是「快照 + 日志」混合方案的根本动机。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [MySQL 索引为什么用 B+ 树](/database/mysql-index)
