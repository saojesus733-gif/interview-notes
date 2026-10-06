---
title: 共识算法：Raft 与 Paxos、ZAB 的定位
category: 分布式
tags: [Raft, 共识算法, 分布式]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

多副本的分布式存储之间，怎么对"谁是主节点、数据是什么"达成一致？
不用推导正确性证明，讲讲 Raft 的主线流程，以及它和 Paxos、ZAB 的关系就行。

## 核心答案

- 为什么需要共识：多节点写入时要对"哪个值、什么顺序"达成一致，否则各副本各说各话，
  主节点宕机还可能冒出多个"新主"。

- Raft 三角色：Leader 唯一处理所有写请求、Follower 被动同步日志、Candidate 是发起选举时的过渡角色。

- 任期（Term）：时间被切成递增的任期，每轮选举 Term 加 1；Term 小的节点必须服从 Term 大的，这是统一乱序的关键。

- 选举：Follower 超时没收到心跳就自增 Term 发起投票，每个节点一票、先到先得，拿到多数票当选 Leader。

- 日志复制：Leader 收到写请求先追加本地日志，并行发给 Follower，多数节点确认后提交，再通知 Follower 应用到状态机。

- Paxos 与 ZAB 定位：Paxos 是理论源头但晦涩难懂，工程上几乎不直接实现；ZAB 是 ZooKeeper 的协议，可视为 Raft 的近亲，都是"多数派 + 单 Leader"思路。

## 深度解析

- 脑裂与安全性：极端情况下出现两个 Leader，必然只有一个能拿到多数派确认；
  旧 Leader 的写入会被覆盖，日志按 Term + 索引比较保持一致。

- 追问点：为什么 Raft 比 Paxos 易学？Raft 把问题拆成选主、日志复制、安全性三个子问题，并强制日志连续，用灵活性换简单性。

- 追问点：etcd、TiKV、Nacos（Raft 系）都是 Raft 落地；ZooKeeper 用 ZAB、Kafka 早期靠 ISR 机制，思想可以横向类比。

- 常见误区：以为 Raft 要求所有节点确认才提交——只需多数派（N/2+1），所以 3 副本容忍 1 台故障、5 副本容忍 2 台。

- 学习建议：面试讲清"心跳超时 → 多数派选举 → 日志复制 → 提交"这条主线即可，不需要推导正确性证明。

## 我的理解

## 关联题目

- [CAP 理论与 BASE 理论](/distributed/cap-base)

- [分布式锁方案对比（Redis / ZooKeeper）](/distributed/distributed-lock-compare)

- [一致性哈希](/distributed/consistent-hashing)
