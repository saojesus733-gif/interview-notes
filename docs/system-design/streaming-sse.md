---
title: 流式响应与 SSE
category: 系统设计
tags: [SSE, Streaming, 系统设计, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

为什么 LLM 应用普遍用 SSE 做流式响应？SSE、WebSocket、长轮询怎么选？

## 核心答案

**为什么流式**：LLM 生成一个长回答要数秒到数十秒，逐 token 推送把首字延迟（TTFT）降到亚秒级，用户体验质变；同时服务端可以先处理先返回，吞吐也更好。

**三种方案对比**：

| 方案 | 方向 | 协议 | 适用 |
| --- | --- | --- | --- |
| **SSE（Server-Sent Events）** | 服务器→客户端单向 | 基于 HTTP，`text/event-stream` | LLM 流式输出的首选 |
| **WebSocket** | 双向 | 独立协议（升级握手） | 需要双向实时（语音、协作） |
| **长轮询** | 客户端反复拉 | HTTP | 兼容性兜底，延迟与开销大 |

**LLM 场景选 SSE 的理由**：

1. 单向推送就够（用户不往模型「推」token）；
2. 复用 HTTP 基础设施：网关、鉴权、CDN、负载均衡都能直接工作；
3. 浏览器原生 EventSource 支持，自动重连并携带 Last-Event-ID；
4. 每条消息是完整事件帧，token 增量、工具进度、结束标记都能结构化传递。

**服务端要点**：设置正确的响应头（禁缓冲、保持连接）、心跳保活（防代理断链）、连接与响应关联（一次请求一条流）、客户端断连后停止生成（省成本）。

## 深度解析

- 基础设施坑：Nginx/网关默认缓冲响应体会把 SSE「攒成一坨」，要显式关闭 buffering；HTTP/1.1 有连接数限制，高并发下考虑 HTTP/2；
- 重连语义：EventSource 自动重连会对原 URL 重发请求，服务端需支持「按事件 ID 续传」或幂等处理，避免重复生成；
- 与 Agent 结合：LangGraph 等框架的 token 流/进度事件经后端转 SSE 给前端，过程面板与打字机共用一条连接（见框架流式题）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LangGraph 的 Streaming API](/frameworks/langgraph-streaming)
- [LLM 应用的流式处理与稳定性](/evaluation-deployment/streaming-stability)
