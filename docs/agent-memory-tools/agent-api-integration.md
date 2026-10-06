---
title: Agent 与外部 API 的集成
category: 记忆与工具
tags: [API 集成, 工具调用, Agent, 架构设计]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

把企业现有的外部 API 接入 Agent 时，需要处理哪些工程问题？

## 核心答案

**接入清单（从模型视角到系统视角）**：

1. **协议转换**：把 API 包装成工具——写清 description 与参数 Schema，返回值裁剪成「模型可读」的精简结构（含错误语义）；
2. **鉴权传递**：Agent 代表用户调用时，透传用户身份与权限（on-behalf-of），绝不让 Agent 用超权服务账号——模型无权决定权限，权限在调用链上；
3. **稳定性工程**：超时设置、重试（仅幂等操作）、限流与熔断，失败时返回「模型可理解」的错误信息以便自愈；
4. **幂等保护**：写操作带 idempotency key，防止 Agent 循环重试造成重复下单/重复扣款；
5. **结果预算**：大响应先做服务端摘要/分页，控制进入上下文的 token 量；
6. **审计与追踪**：谁（哪个会话/用户）让 Agent 调了什么 API、参数与结果全量留痕，trace 贯穿。

**分层建议**：Agent 不直连业务 API，中间加一层「工具网关」——统一鉴权、限流、审计、脱敏，业务 API 变更不直接波及 Agent。

## 深度解析

- 「模型给的参数不可信」：类型/枚举由 Schema 约束，但业务合法性（该用户是否有权操作该资源）必须服务端强制校验，这是安全边界不是优化项。
- API 返回的敏感字段（手机号、身份证）在进入模型上下文前脱敏——模型上下文会进日志，泄露面比普通调用更大。
- 慢 API 会拖死执行循环：高延迟接口考虑异步任务化（提交任务→轮询/回调），执行循环里挂起等待。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Tool Calling 机制](/agent-memory-tools/tool-calling-mechanism)
- [Agent 安全与权限控制](/evaluation-deployment/agent-security)
- [LLM Gateway 统一网关设计](/system-design/llm-gateway)
