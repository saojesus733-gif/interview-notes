---
title: GIL 是什么？多线程为什么不能并行？
category: Python 栈
tags: [GIL, Python, 并发, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

讲讲 GIL。为什么 Python 多线程跑 CPU 密集任务反而没提升？实际项目里怎么绕开它？

## 核心答案

**GIL（全局解释器锁）**：CPython 解释器同一时刻只允许**一个线程执行 Python 字节码**——多线程无法并行利用多核跑计算。

1. **为什么存在**：CPython 的内存管理（引用计数）非线程安全，GIL 是实现上最简单安全的保护；它保护的是**解释器内部状态**，不是你的业务数据（业务共享数据仍要加锁）；
2. **影响**：CPU 密集任务多线程无加速（甚至因锁争用更慢）；**IO 密集任务多线程依然有效**（线程在等 IO 时释放 GIL）；
3. **绕开方案**：
   - **多进程**（multiprocessing / 进程池）：每个进程独立解释器与 GIL，真并行——CPU 密集首选；
   - **asyncio**：IO 密集高并发首选（单线程事件循环）；
   - **原生扩展释放 GIL**：numpy/pandas 的重计算、C 扩展在 C 层可释放 GIL；
   - Python 3.13+ 的 free-threading 实验版本在去 GIL，尚未成为主流默认，标注即可。

## 深度解析

- AI 应用场景映射：批量调 LLM API → asyncio 并发；本地跑向量化/文档处理 → 多进程；混合任务 → 进程池 + 线程/协程组合；
- 雷区：说"GIL 让 Python 线程完全无用"——IO 密集下多线程仍有用；说"GIL 保护了业务数据不用加锁"——错，i += 1 这种依然会丢更新；
- 追问预判："multiprocessing 的代价？"→ 进程启动与 IPC 开销、内存翻倍，所以有进程池复用。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [asyncio 事件循环与异步编程](/python/python-asyncio)
- [GIL 场景题：CPU 100% 排查](/troubleshooting/cpu-100-troubleshooting)
