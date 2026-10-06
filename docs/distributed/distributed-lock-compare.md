---
title: 分布式锁方案对比（Redis / ZooKeeper）
category: 分布式
tags: [分布式锁, Redis, ZooKeeper]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

多个服务实例要互斥地执行同一个定时任务，单机锁失效了，分布式锁怎么实现？
Redis 和 ZooKeeper 两种方案你更倾向哪个，为什么？

## 核心答案

- Redis 基础方案：SET key value NX EX ttl 一条命令原子加锁，value 存唯一标识（UUID + 线程 ID），
  释放时用 Lua 校验是自己的锁再删。

- 为什么要过期时间：防止持有者宕机后锁无法释放；但业务超时锁先过期就有并发风险，Redisson 用看门狗默认 30 秒、每 10 秒自动续期。

- Redis 主从缺陷：加锁写在主节点、异步同步从节点，主节点宕机锁丢失，另一客户端可再次加锁；RedLock 因此被提出但有争议。

- ZooKeeper 方案：客户端在锁节点下创建临时顺序节点，序号最小者获得锁，其余 watch 上一个节点；会话断开或释放时节点自动清理。

- 对比：Redis 性能高、实现简单，但可靠性受主从切换影响；ZK 基于会话与临时节点，可靠性高，但性能低、运维重。

- 数据库方案一句话：靠唯一索引插入成功即获锁，或用乐观锁版本号，简单但性能和可用性一般，适合低并发兜底场景。

## 深度解析

- 追问点：释放锁为什么必须用 Lua 校验再删？
  否则 A 的锁过期后被 B 获取，A 执行 DEL 会误删 B 的锁。

- 追问点：Redisson 看门狗原理？不指定 leaseTime 时后台定时任务检查持锁线程是否存活，存活则续期，业务完成显式解锁。

- 追问点：ZK 的羊群效应？所有客户端 watch 同一节点会引发唤醒风暴，顺序节点 + 只 watch 前驱正是为了解决它。

- 常见误区：以为加了锁就万事大吉——还要考虑可重入、阻塞还是快速失败，并把业务幂等作为最后防线。

- 选型直觉：一般业务用 Redisson 足够；对正确性极敏感的场景（选主、元数据变更）用 ZK 或 etcd 更稳。

## 我的理解

## 关联题目

- [接口幂等性设计](/distributed/idempotency-design)

- [共识算法：Raft 与 Paxos、ZAB 的定位](/distributed/raft-consensus)

- [分布式 ID 生成方案](/distributed/distributed-id)
