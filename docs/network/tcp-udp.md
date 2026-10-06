---
title: TCP 三次握手
category: 计算机网络
tags: [TCP, 网络, 面试高频]
importance: 3
mastery: 未掌握
source: 字节跳动一面
---

## 问题

请描述 TCP 建立连接的三次握手过程，并解释为什么握手必须是三次？

## 核心答案

三次握手过程：

1. 客户端发送 SYN 报文（seq=x），进入 SYN_SENT 状态；
2. 服务端回复 SYN+ACK 报文（seq=y, ack=x+1），进入 SYN_RCVD 状态；
3. 客户端发送 ACK 报文（ack=y+1），双方进入 ESTABLISHED 状态。

为什么是三次：

- **确认双方收发能力**：三次是让双方都确认「自己能发、对方能收」的最小次数；
- **防止旧的重复连接请求**：若只有两次握手，一个历史失效的 SYN 到达服务端后建立连接，会浪费服务端资源；
- **同步初始序列号**：双方都要告知对方自己的 ISN 并得到确认，这至少需要三次。

## 深度解析

- 半连接队列（SYN 队列）与全连接队列（Accept 队列）：收到 SYN 后进入半连接队列，收到第三次握手的 ACK 后移入全连接队列等待 accept()。SYN Flood 攻击正是打满半连接队列，内核通过 `tcp_syncookies` 应对。
- 第三次握手可以携带数据（TFO 相关）；前两次不行。
- 握手阶段的重传由 `tcp_syn_retries`（客户端）与 `tcp_synack_retries`（服务端）控制。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [TCP 四次挥手](/network/tcp-udp#问题)
- [HTTP 与 HTTPS 的区别](/network/http-https)
