---
title: 零拷贝（Zero-Copy）
category: 操作系统
tags: [零拷贝, IO, Linux]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

把磁盘文件通过网络发送出去，传统方式为什么要经历多次拷贝和切换？零拷贝是如何优化这个过程的？

## 核心答案

- 传统 `read() + write()`：磁盘 → 页缓存（DMA 拷贝）→ 用户缓冲区（CPU 拷贝）→ Socket 缓冲区（CPU 拷贝）→ 网卡（DMA 拷贝），
  共 **4 次拷贝、4 次用户态/内核态切换**。
- **mmap + write**：把文件映射进用户地址空间，跳过「页缓存 → 用户缓冲区」的一次 CPU 拷贝，变成 3 次拷贝、4 次切换。
- **sendfile**：数据全程在内核态流转（页缓存 → Socket 缓冲区），省去用户态往返；
  若网卡支持 SG-DMA，还能直接从页缓存写到网卡，只剩 2 次拷贝、2 次切换。
- Java NIO 的 `FileChannel.transferTo()` 底层就是 sendfile；Kafka、Netty（FileRegion）都基于它做文件传输。
- 适用场景：静态文件下发、消息队列读写日志等「不需要在用户态加工数据」的场景；
  若要对数据做加密、计算，就必须回到传统拷贝或 mmap。

## 深度解析

- 「零拷贝」并非完全没有拷贝，而是指**零 CPU 拷贝**：数据不经过用户态、不由 CPU 搬运，DMA 拷贝仍然存在。
- 页缓存（PageCache）是关键前提：热点文件命中缓存时甚至不用读磁盘，sendfile 直接从页缓存发出。
- sendfile 的限制：数据不经过用户态，应用拿不到内容——这正是 Kafka 能用它高性能转发文件的原因。
- 追问延伸：Kafka 为什么快——顺序写 + PageCache + 零拷贝 + 批量压缩；
  Netty 的 CompositeByteBuf 属于用户态层面的「零拷贝」思想，与 OS 级零拷贝要区分开。
- 常见误区：认为 mmap 一定比 sendfile 好——mmap 适合随机读写大文件，纯转发场景 sendfile 更优。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [I/O 多路复用：select / poll / epoll](/os/io-multiplexing-epoll)
- [用户态与内核态切换](/os/user-kernel-mode)
