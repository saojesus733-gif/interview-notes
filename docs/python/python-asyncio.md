---
title: asyncio 事件循环与异步编程
category: Python 栈
tags: [asyncio, Python, FastAPI, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

讲讲 asyncio 的原理。为什么 LLM 应用开发几乎全用它？协程里写了一个阻塞调用会发生什么？

## 核心答案

**原理四句话**：

1. **事件循环（Event Loop）**单线程调度大量协程：协程是用户态的"可暂停函数"，`await` 处主动让出控制权；
2. IO 就绪通知靠操作系统多路复用（Linux epoll）——一个线程监听成千上万个 socket；
3. **协作式调度**：协程只在 `await` 处切换，切换成本极低（不进内核、无线程栈开销）；
4. 适合 **IO 密集**（网络请求/数据库），CPU 密集会阻塞整个循环（呼应 GIL 与事件循环阻塞）。

**为什么 LLM 应用全用它**：核心负载是"等 LLM API 响应"和"等向量库/数据库"——纯 IO 等待，asyncio 并发 50~100 个 LLM 请求只需极少线程资源；FastAPI/Streamlit 生态原生 async；流式 SSE 推送天然契合异步模型。

**阻塞调用的后果与解法**：协程里一个 `time.sleep(5)` / 同步 HTTP / 重 CPU 计算会**卡住整个事件循环**，所有并发请求全部停摆。解法：换异步库（httpx.AsyncClient / asyncpg）、CPU 活扔 `run_in_executor` / `asyncio.to_thread`。

## 深度解析

- 加分点：LLM 网关并发实验里对比过 requests 线程池 vs httpx 异步——高并发下异步的内存与切换成本优势明显；但注意**全局单循环**，CPU 密集（如本地 Embedding 大批量）要用进程池；
- 雷区：在 async 函数里调同步 SDK（某些旧版 LLM 客户端）——隐性阻塞最难查，用 `await asyncio.sleep(0)` 探针或 py-spy 看循环卡点；
- 追问预判："asyncio.gather 与 TaskGroup？"→ TaskGroup（3.11+）结构化并发，子任务异常自动取消组内其他任务。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [FastAPI 为什么适合 AI 应用](/python/fastapi-core)
- [GIL 是什么](/python/python-gil)
- [场景：语音 Agent 的延迟与打断](/scenarios/voice-agent-latency)
