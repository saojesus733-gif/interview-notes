---
title: TCP 四次挥手与 TIME_WAIT
category: 计算机网络
tags: [TCP, TIME_WAIT, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

请描述 TCP 四次挥手的过程，并解释为什么主动关闭方要等待 2MSL 才真正关闭连接？

## 核心答案

四次挥手流程（以客户端主动关闭为例）：

1. 客户端发送 FIN，进入 FIN_WAIT_1；
2. 服务端回复 ACK，进入 CLOSE_WAIT，客户端收到后进入 FIN_WAIT_2；
3. 服务端数据发送完毕后发送 FIN，进入 LAST_ACK；
4. 客户端回复 ACK，进入 TIME_WAIT，等待 2MSL 后关闭；服务端收到 ACK 立即关闭。

为什么等待 2MSL：

- **确保最后一个 ACK 可达**：ACK 丢失时服务端会重传 FIN，客户端仍能重发 ACK；
- **让旧连接报文自然消亡**：避免历史报文串扰复用相同四元组的新连接。

大量 TIME_WAIT 的危害与应对：

- 危害：占用端口与内存，端口耗尽后无法建立新连接；
- 应对：开启 `tcp_tw_reuse` 复用、使用长连接/连接池、尽量让服务端主动关闭。

大量 CLOSE_WAIT 说明：被动关闭方没有及时调用 `close()`（通常是忘了关 socket 或线程阻塞），属于程序 Bug，应排查业务代码而不是调内核参数。

## 深度解析

- TIME_WAIT 只出现在**主动关闭方**，CLOSE_WAIT 出现在**被动关闭方**，排查问题先分清谁主动关；
- MSL 是报文最大生存时间，Linux 默认 30s，所以 2MSL 即 60s；
- `tcp_tw_recycle` 已在 Linux 4.12 后移除，NAT 环境下会出问题，面试提到它是加分也是陷阱；
- 追问点：四次挥手为什么不能合并成三次？因为被动方收到 FIN 时可能还有数据要发，ACK 与 FIN 必须分开。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [TCP 三次握手](/network/tcp-udp)
- [TCP 拥塞控制](/network/tcp-congestion-control)
- [TCP 如何保证可靠传输](/network/how-tcp-ensures-reliability)
