---
title: HTTP/1.1、HTTP/2、HTTP/3 的演进
category: 计算机网络
tags: [HTTP, HTTP/2, HTTP/3]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

HTTP/1.1、HTTP/2、HTTP/3 各自解决了什么问题？
为什么 HTTP/3 要抛弃 TCP 改用基于 UDP 的 QUIC？

## 核心答案

- **HTTP/1.1**：默认长连接 `keep-alive` 复用 TCP 连接；支持管线化但响应必须按序返回，存在**应用层队头阻塞**，只能靠浏览器并发多条 TCP 连接（6~8 条）缓解；
- **HTTP/2**：二进制分帧 + **多路复用**，一条连接上并发多个流互不阻塞；**HPACK 头部压缩**消除重复头开销；支持服务端推送；但一个 TCP 报文丢失会阻塞所有流，仍存在**传输层队头阻塞**；
- **HTTP/3**：传输层换成基于 UDP 的 **QUIC**，流之间真正独立，彻底解决 TCP 层队头阻塞；内置 TLS 1.3，握手 1-RTT 甚至 0-RTT；用 Connection ID 标识连接，实现网络切换（Wi-Fi/4G）时的连接迁移。

演进主线：文本 → 二进制、串行 → 并行、TCP → UDP、面向连接 → 面向流。

## 深度解析

- 追问点：HTTP/2 为什么没根治队头阻塞？它只改了应用层，丢包重传后数据仍要按序交付，一个包丢失整条 TCP 连接都受影响；
- HPACK 用静态表 + 动态表 + 哈夫曼编码压缩，动态表要求流按序处理，QUIC 因此重新设计了 QPACK；
- 常见误区：多路复用不等于无限并发，浏览器对同一域名的流数仍有限制；服务端推送实际收益有限，Chrome 已移除；
- 常见误区：HTTP/2 不强制 HTTPS，但浏览器实际上只在 TLS 上支持 h2；
- 追问点：HTTP/2 的二进制帧把报文拆成帧交错传输，接收端按流 ID 重组，这是多路复用的实现基础；
- 部署角度：HTTP/3 走 UDP 443，需防火墙放行，通常通过 `Alt-Svc` 响应头协商升级。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [HTTP 与 HTTPS 的区别](/network/http-https)
- [HTTP 常见状态码](/network/http-status-codes)
- [从输入 URL 到页面展示发生了什么](/network/from-url-to-page)
