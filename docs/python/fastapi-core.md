---
title: FastAPI 为什么适合做 AI 应用服务
category: Python 栈
tags: [FastAPI, Python, LLM, 面试高频]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

你的项目用 FastAPI 做后端。相比 Flask/Django，它为什么成了 AI 应用的事实标准？核心机制讲一下。

## 核心答案

1. **原生异步**：基于 Starlette（ASGI），天然支持 async 接口——与 LLM API 异步调用、SSE 流式输出无缝衔接（LLM 应用的两大刚需）；
2. **Pydantic 类型驱动**：请求/响应模型用 Pydantic 定义，自动完成**校验、序列化、OpenAPI 文档**——LLM 输出的结构化校验同一套体系；
3. **依赖注入（Depends）**：数据库会话、鉴权、配置等通过依赖声明复用，测试时易替换（mock）；
4. **轻量**：框架不绑定 ORM/模板，微服务与 AI 网关场景干净利落；Django 的 ORM/Admin 对纯 API 服务是负担。

**对比一句话**：Flask 同步模型要靠 gevent/线程池补异步，Pydantic 校验要自己装；Django 重；FastAPI = 异步 + 类型校验 + 自动文档开箱即用——恰好是 LLM 应用（异步调模型、结构化输出、快速迭代）要的三件事。

## 深度解析

- 部署：uvicorn/gunicorn(ASGI worker) 多进程跑，配合 Docker 多 worker 注意每进程内存（加载模型的场景）；
- 加分点：流式接口写法——`StreamingResponse` + async generator 包 SSE；后台任务用 BackgroundTasks（轻量）而非阻塞响应；
- 雷区：把同步 ORM（旧版 SQLAlchemy）塞进 async 路由阻塞循环——要 asyncpg/SQLAlchemy 2.0 async 模式；依赖注入里的同步 IO 同理。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [asyncio 事件循环与异步编程](/python/python-asyncio)
- [Pydantic 与结构化校验](/python/pydantic-validation)
- [结构化输出](/prompt-engineering/structured-output)
