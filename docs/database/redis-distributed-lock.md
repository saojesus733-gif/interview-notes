---
title: 用 Redis 实现分布式锁
category: 数据库
tags: [Redis, 分布式锁, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

如何用 Redis 实现一个可靠的分布式锁？
锁过期了业务还没执行完怎么办？RedLock 你怎么看？

## 核心答案

- **加锁**：`SET lock_key uniqueValue NX PX 30000`；
  一条原子命令同时完成「不存在才设置 + 设过期时间」，避免 setnx 与 expire 分离留下死锁隐患；
- **唯一标识**：value 用 UUID + 线程 ID；
  保证只有锁的持有者才能解锁，防止误删别人的锁；
- **解锁**：Lua 脚本先比对 value 再 DEL；
  让「判断是不是自己的锁 + 删除」原子执行；
- **续期问题**：业务没执行完锁先过期，会被其他客户端抢占；
  用看门狗机制（Redisson 默认 30s 锁，每 10s 检查续期）自动延长；
- **可重入与等锁**：Redisson 用 hash 结构记录持有者和重入次数，支持同线程可重入；
  等锁用订阅解锁消息代替自旋轮询，减少无效开销；
- **RedLock 一句话**：向多个独立 Redis 节点加锁、过半成功才算获取；
  但存在时钟跳变等争议，多数团队用单实例 + 看门狗，或直接上 zk / etcd。

## 深度解析

- 为什么 NX 和 PX 必须一条命令：先 setnx 再 expire 两步之间客户端宕机，就会留下永不过期的死锁。
- 释放锁必须 Lua 原子执行：GET 判断和 DEL 分开时，锁可能恰好在判断后过期并被他人持有，DEL 就会误删别人的锁。
- 主从切换风险：锁写在 master 上，还没同步到 slave 就宕机切换，新主上没有这把锁，另一个客户端可再次加锁——RedLock 正是为解决它而生，也因此引发 Martin Kleppmann 与 antirez 的著名论战。
- 追问点：看门狗的本质是「后台定时任务在锁到期前，用 Lua 校验持有者并 PEXPIRE 续期」；
  服务端宕机后锁靠 TTL 自动释放，避免永久死锁。

```lua
-- 释放锁：校验持有者 + 删除，原子执行
if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
else
    return 0
end
```

## 我的理解

（留空，后续自行填写）

## 关联题目

- [缓存穿透、击穿、雪崩](/database/redis-cache-issues)
- [Redis 常用数据结构与底层实现](/database/redis-data-structures)
