---
title: Pydantic 与 LLM 输出的结构化校验
category: Python 栈
tags: [Pydantic, FastAPI, 结构化输出]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

Pydantic 在你的项目里承担什么角色？LLM 输出的 JSON 校验为什么用它，而不是拿到字典手写 if？

## 核心答案

**Pydantic 是什么**：基于类型注解的数据校验与序列化库——定义模型类，实例化时自动做**类型转换、约束校验、失败报 ValidationError（带字段级错误信息）**。

**在 LLM 应用里的三个落点**：

1. **API 层**：FastAPI 请求/响应模型——入参合法性在框架层拦住，不进业务代码；
2. **LLM 输出校验**：模型吐的 JSON 实例化为 Pydantic 模型——字段缺失/类型错/枚举非法立即失败，可带着错误信息**回传模型自纠**（结构化输出的应用层兜底）；
3. **内部契约**：Agent 状态、工具参数、记忆条目都用模型定义——类型即文档，重构有保障。

**常用能力**：`Field(默认值, 描述, ge/le, pattern)` 约束、嵌套模型、`model_validator` 跨字段校验、`model_json_schema()` 直接生成给 LLM 的 Schema（与 Function Calling 定义同源）。

## 深度解析

- 加分点：**Pydantic Schema → LLM 结构化输出**的闭环：同一个模型类既生成 JSON Schema 给模型约束解码，又负责解析后校验——一份定义两处使用；
- v1 vs v2 差异标注：v2（pydantic-core Rust 重写）性能大幅提升、API 改为 `model_validate` / `model_dump`，网上老教程 v1 写法（`.parse_obj`/`.dict()`）已过时；
- 雷区：只做语法校验不做业务校验（语法合法 ≠ 业务正确）；LLM 输出校验失败要设计重试与降级路径，不是抛异常了事（呼应结构化输出题）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [结构化输出](/prompt-engineering/structured-output)
- [FastAPI 为什么适合做 AI 应用服务](/python/fastapi-core)
- [Tool Calling / Function Calling 机制](/agent-memory-tools/tool-calling-mechanism)
