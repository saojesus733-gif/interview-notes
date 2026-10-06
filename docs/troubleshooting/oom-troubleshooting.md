---
title: 服务内存持续上涨 / OOM 怎么排查
category: 线上排查
tags: [排查, Python, 内存泄漏, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

Python 服务内存RSS持续上涨，几天后被 OOM Killer 杀掉重启，周而复始。面试官问：怎么定位是哪里在泄漏？

## 核心答案

1. **先确认现象与边界**：监控看内存曲线是"锯齿形（回收后回落，谷底缓慢抬高）"还是"单调上涨"——前者疑似碎片/缓存无上限，后者是确定性泄漏；记录触发规律（与 QPS/特定接口相关？）；
2. **用 tracemalloc 做分配追踪**（标准库，生产可短时开启）：

```python
import tracemalloc
tracemalloc.start(25)          # 保存 25 帧分配栈
# ...运行一段时间或复现流量后...
snapshot = tracemalloc.take_snapshot()
top = snapshot.compare_to(old_snapshot, 'lineno')
for stat in top[:10]:
    print(stat)                # 按文件:行号看增量最大的分配点
```

3. **对象级定位**：`objgraph` 看对象计数增长最快的类型（`objgraph.show_growth()`）、`gc.get_objects()` + Counter 按类型统计；
4. **Python 特有泄漏根因清单**：全局容器（dict/list 缓存）无界增长、类属性/闭包持有对象、**循环引用 + `__del__`**（gc 不回收）、C 扩展/C 库泄漏（RSS 涨但 tracemalloc 看不到——Python 层工具只管 Python 堆）、线程/协程对象堆积、logging handlers 累积；
5. **处置**：无界缓存加上限（LRU/TTL）；循环引用改弱引用 `weakref`；C 层泄漏用 memray（火焰图级）定位到扩展。

## 深度解析

- 工具分层：`tracemalloc`（Python 堆分配点，标准库）、`objgraph`（对象引用关系）、`memray`（原生级，含 C 扩展，火焰图最直观）、`py-spy dump` 顺带看线程数是否异常增长；
- glibc 的 malloc 碎片会让 RSS 不降——`malloc_trim` / 换 jemalloc 是运维侧缓解，不是泄漏修复；
- Java 对照：Java 用 `jmap -dump` + MAT 看支配树，思路同为"快照对比找增长点"；
- 雷区：只重启不定位（三天两头 OOM 重启就是没找到根因）；tracemalloc 全程开启有 overhead，用短时采样。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [线上服务 CPU 100% 怎么排查](/troubleshooting/cpu-100-troubleshooting)
- [接口突然变慢的通用排查思路](/troubleshooting/api-slowdown-checklist)
