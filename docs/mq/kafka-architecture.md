---
title: Kafka 的架构与高性能原因
category: 消息队列
tags: [Kafka, 消息队列, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

面试官问：“描述一下 Kafka 的整体架构，各个角色分别负责什么？”
再追问：“Kafka 为什么能做到单机每秒几十万条的高吞吐？”要求架构术语准确、性能原理讲到操作系统层面。

## 核心答案

1. Producer：生产者，把消息写入指定 Topic，可携带 key；相同 key 经哈希后永远路由到同一个分区。
   这是实现分区内顺序的关键，也直接支撑“顺序消息”的落地方案。
2. Broker：服务节点，集群由多个 Broker 组成，每个 Broker 存放若干分区的副本，由 Controller 负责选主。
3. Topic 是逻辑分类，Partition 是物理分片：消息按时间顺序追加到分区末尾，分区是并行度与顺序性的最小单位。
   分区分布在不同 Broker 上，天然支持水平扩展。
4. Consumer Group：一组消费者共同消费 Topic，每个分区同一时刻只分配给组内一个消费者；不同组互不影响。
   组内消费者增减会触发 Rebalance，期间消费会短暂暂停。
5. 副本机制：每个分区有 1 个 Leader 和若干 Follower，读写都走 Leader，Follower 只做同步容灾。
   保持同步的副本集合叫 ISR，是可靠性参数 min.insync.replicas 的基础。
6. 高性能四件套：磁盘顺序写 + 页缓存 + 零拷贝（sendfile）+ 批量发送与压缩，再叠加分区级并行消费。

## 深度解析

- 顺序写：日志文件只追加不随机改写，磁盘顺序写的速度接近内存随机读，这是 Kafka 敢把日志放磁盘的底气。
- 页缓存：读写都先经过 OS PageCache，写由内核异步刷盘，读热数据基本不碰磁盘。
  同时数据不在 JVM 堆内，规避了大堆 GC 问题，进程更稳定。
- 零拷贝：消费者拉取时用 sendfile 直接从页缓存送到网卡，省去内核态与用户态的两次拷贝和上下文切换。
- 追问“分区数怎么定”：分区越多并行度越高，但文件句柄、Rebalance 时间、端到端延迟也随之增加。
  一般按“目标吞吐除以单分区吞吐”估算，再留一定余量。
- 常见误区：以为 Kafka 快是因为纯内存操作。它主要靠磁盘顺序写加页缓存，把随机 I/O 变成顺序 I/O，普通机械盘也能跑出高吞吐。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [为什么要用消息队列及选型](/mq/mq-why-and-selection)
- [如何保证消息不丢失](/mq/mq-no-message-loss)
- [如何保证消息顺序](/mq/mq-order)
- [消息积压了怎么处理](/mq/mq-backlog)
- [消息投递语义：at-most-once / at-least-once / exactly-once](/mq/mq-delivery-semantics)
