---
title: I/O 多路复用：select / poll / epoll
category: 操作系统
tags: [IO多路复用, epoll, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

一个线程如何同时监听成千上万个连接？对比 select、poll、epoll 的实现差异，说说为什么高并发场景首选 epoll。

## 核心答案

- **select**：每次调用都把 fd 集合从用户态拷贝到内核态，返回后还要线性扫描所有 fd；
  受 FD_SETSIZE 限制（一般 1024 个），连接数一多效率急剧下降。
- **poll**：改用 pollfd 结构体数组，突破了 1024 的数量上限，
  但本质没变，仍是「每次全量拷贝 + O(n) 遍历」。
- **epoll**：epoll_create / epoll_ctl / epoll_wait 三个系统调用；
  fd 只在注册时拷贝一次，由内核红黑树管理，就绪 fd 经回调挂入就绪链表，epoll_wait 只返回就绪的 fd。
- 核心差异：select/poll 每轮都要 O(n) 扫描全部 fd，epoll 是事件驱动，直接 O(1) 取就绪列表。
- **LT 水平触发**：只要缓冲区还有数据，epoll_wait 就会反复通知，编程简单、不易丢数据，是默认模式。
- **ET 边缘触发**：只在状态变化时通知一次，必须配合非阻塞 fd 循环读写到 EAGAIN，效率更高，Nginx 采用。

## 深度解析

- epoll 高效的本质：把「遍历所有 fd」变成「内核通过设备驱动回调把就绪 fd 主动挂入就绪链表」，
  等待队列只在 epoll_ctl 时挂一次，避免了重复的 fd 拷贝与扫描。
- 场景辨析：连接数大但活跃少（长连接、网关、IM）时 epoll 优势显著；
  连接少且全部活跃时，epoll 与 poll 差距不大，select 反而更简单。
- ET 的经典坑：一次没读完且 fd 是阻塞模式，后续 read 会卡死；
  正确姿势是非阻塞 fd + 循环 read/write 直到 EAGAIN。
- 追问延伸：epoll 对应网络编程中的 Reactor 模式；fd_set 每次调用在内核与用户态间来回拷贝也是 select 的瓶颈。
- 常见误区：epoll 并非在所有场景都快——fd 少、事件密时，额外的红黑树维护成本可能反而不划算。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [零拷贝（Zero-Copy）](/os/zero-copy)
- [用户态与内核态切换](/os/user-kernel-mode)
