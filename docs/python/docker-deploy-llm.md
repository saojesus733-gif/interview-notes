---
title: Docker 部署 AI 应用要注意什么？
category: Python 栈
tags: [Docker, 部署, Python, LLM]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

你的项目用 Docker 部署。把一个 LLM 应用（FastAPI + 依赖模型库）打成镜像、跑进生产，有哪些值得注意的点？

## 核心答案

**镜像构建**：

1. 基础镜像选 `python:3.x-slim` 减体积；**多阶段构建**——构建层装编译依赖，运行层只拷 wheel 与运行时；
2. **依赖分两层装**：先 `COPY requirements.txt` 再 `RUN pip install`，最后 `COPY .`——代码改动不触发重装依赖（层缓存）；
3. `requirements.txt`（或 uv/poetry lockfile）锁版本；模型权重**不打进镜像**（体积巨大），挂卷或启动时拉取。

**运行时**：

1. 容器是**一次性进程**：入口前台运行（uvicorn）、日志打 stdout、优雅退出（SIGTERM 处理，收尾刷缓冲）；
2. **显式声明资源**：`--memory`/CPU 限额与 LLM 服务的并发参数联动；健康检查 `healthcheck` 配 /health 接口；
3. **密钥不进镜像**：环境变量/secret 管理注入（API key 泄进镜像层是常见事故）；
4. `.dockerignore` 排除 .venv/模型权重/.git。

## 深度解析

- 加分点：**embedding/本地模型容器化**——模型加载慢（分钟级），要用启动探针而非就绪探针区分"还在加载"与"挂了"；模型缓存目录挂 Volume 避免每次重启重新下载；
- 加分点：compose 本地编排一把梭（app + postgres + redis），生产 k8s 时 liveness/readiness 的区分同理；
- 雷区：latest 标签部署（不可回滚）；镜像里塞 .env；root 用户运行。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [微服务架构接入 Agent 系统](/system-design/microservices-agent-integration)
- [FastAPI 为什么适合做 AI 应用服务](/python/fastapi-core)
