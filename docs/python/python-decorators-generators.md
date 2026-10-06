---
title: 装饰器与生成器的原理和使用场景
category: Python 栈
tags: [装饰器, 生成器, Python]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

讲讲 Python 装饰器和生成器的原理。它们在 LLM 应用代码里有哪些实际用法？

## 核心答案

**装饰器**：

1. 本质是"接收函数返回新函数"的高阶函数，`@decorator` 语法糖等价于 `f = decorator(f)`；
2. 标配写法：`functools.wraps` 保留原函数元信息；带参数的装饰器是三层嵌套；
3. 实际用法：LLM 调用的**重试/超时封装**、耗时打点（性能埋点）、接口鉴权、结果缓存（`lru_cache`）——横切逻辑与业务解耦。

**生成器**：

1. 带 `yield` 的函数是生成器：惰性求值、**边生成边消费**，内存占用 O(1)；
2. 实际用法：**流式输出管道**——LLM 的 token 流本身就是生成器，`async for chunk in stream:` 逐段处理转发；大文件/大结果集逐行读取（不整载内存）；
3. `yield from`/委托与 `send()` 双向通信（协程的历史形态，asyncio 的思想前身）。

**两者结合的典型**：装饰一个"把同步迭代器转异步流"或"给流式输出加过滤/重试"的管道节点。

## 深度解析

- 加分点：流式 RAG/SSE 的服务端实现核心就是**异步生成器**——`async def event_stream(): yield f"data: {json}\n\n"`，理解生成器就理解了流式接口的本质（呼应流式 RAG 设计题）；
- 雷区：装饰器忘 `functools.wraps`（签名/文档丢失）；生成器只能消费一次（重复消费静默为空，是流式代码的经典 bug）；
- 追问预判："yield 和 return 的区别？"→ yield 暂停并保存栈状态，下次从暂停处继续。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [asyncio 事件循环与异步编程](/python/python-asyncio)
- [设计支持流式输出的 RAG 系统](/system-design/streaming-rag-design)
