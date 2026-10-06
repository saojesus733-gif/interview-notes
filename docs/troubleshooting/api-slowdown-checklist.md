---
title: 接口突然变慢的通用排查思路
category: 线上排查
tags: [排查, 性能, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题
下午两点起某核心接口 P99 从 200ms 涨到 3s，其他接口基本正常。
面试官问：没有链路追踪的情况下，你的通用排查思路是什么？

## 核心答案
1. 第一直觉查"最近变更"：发布记录、配置改动、数据量增长；突然变慢八成和变更相关，先回滚再排查也是正当选项。
   顺手把发布平台当天的变更列表和告警时间线对一遍。
2. 先分层定位再下钻：应用日志的耗时打点、网关 access log、SkyWalking/Zipkin 链路追踪，确认慢在网关、应用内部还是下游依赖。
   没有打点的系统要尽快补上关键路径耗时日志，否则每次排查都是盲人摸象。
3. 网络层：`ping <目标IP>` 看延迟与丢包，跨机房调用重点怀疑，必要时 `mtr <目标IP>` 看路径各跳质量。
4. 负载层：`top`（CPU）、`free -h`（内存）、`iostat -x 1`（磁盘）、连接数是否打满：

  ```bash
  ss -s                       # 连接状态概览
  ss -tn | grep -c ':3306'    # 到 DB 的 ESTABLISHED 连接数
  ```
5. 应用层：`jstat -gcutil <pid> 1000` 看 GC 是否频繁；`jstack <pid>` 看线程池是否打满、有无大量 BLOCKED 等锁。
6. 依赖与数据层：DB 慢 SQL 日志、Redis 命中率、下游接口 RT；数据量增长跨过临界点会触发慢查询（索引失效、深分页）。

## 深度解析
- iostat 输出怎么看：

  ```bash
  iostat -x 1
  # %util 接近 100% 磁盘饱和；await 远高于平时说明 IO 变慢
  ```
- 线程池打满的典型表象：CPU 不高但 RT 升高，日志出现任务拒绝或队列堆积，根因常是下游变慢把线程占住，向上游层层传染。
- 慢 SQL 典型场景：数据量跨过临界点后执行计划劣化。
  常见触发：隐式类型转换、对索引列用函数、深分页大偏移；`explain` 确认后补索引或改写 SQL。
- 缓存因素：命中率突然下跌（大批 key 同时过期或被淘汰）会让流量瞬间压到 DB，检查 Redis 命中率与 key 过期时间分布。
- 追问点：怎么区分"自己慢"还是"下游慢"？有追踪看 span 耗时；没有就在调用下游前后打时间戳，对比应用自身处理耗时与等待下游耗时。

## 我的理解

## 关联题目
- [线上服务 CPU 100% 怎么排查](/troubleshooting/cpu-100-troubleshooting)
- [Python 的 GC 机制与循环引用](/troubleshooting/python-gc-cycles)
- [线上 OOM / 内存泄漏怎么排查](/troubleshooting/oom-troubleshooting)
- [日志排查常用命令组合](/troubleshooting/linux-log-commands)
