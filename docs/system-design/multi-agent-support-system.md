---
title: Multi-Agent 协作系统设计（智能客服场景）
category: 系统设计
tags: [Multi-Agent, 智能客服, 系统设计, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

设计一个 Multi-Agent 智能客服系统，Agent 之间怎么分工与协作？

## 核心答案

**整体架构（Supervisor 模式为主干）**：

```text
用户消息
  → 意图识别/路由 Agent（分类：咨询/售后/投诉/闲聊）
  → Supervisor Agent（拆解任务、编排流程）
      ├─ FAQ Agent：知识库检索直答（高频标准问题）
      ├─ 业务 Agent：查订单/物流/账户（工具=内部 API）
      ├─ 处置 Agent：退款/改签等写操作（带审批）
      └─ 情绪检测：高危/愤怒 → 直接转人工
  → Reviewer/质检：答案校验、合规检查
  → 人工坐席兜底（HITL 升级通道）
```

**关键设计点**：

1. **先分流后协作**：80% 标准问题在 FAQ/检索层解决，只有复杂问题才进入多 Agent 协作——成本与延迟都靠「分流」保住；
2. **Agent 职责正交**：每个 Agent 的工具集、知识范围、System Prompt 独立，避免一个巨型 Agent 塞所有工具；
3. **共享状态设计**：会话状态（用户信息、已确认事实、已执行操作）放结构化存储，Agent 间传任务单而非整段对话；
4. **写操作强管控**：涉及资金的处置必须带参数确认 + 人审（HITL）+ 幂等；
5. **升级闭环**：转人工时把 AI 侧完整上下文摘要带给坐席，避免用户重复陈述。

## 深度解析

- 指标体系：机器人解决率、转人工率、升级后二次解决率、CSAT——多 Agent 的每个环节都要能单独归因（哪个 Agent 失败最多）；
- 常见演进路径：规则+FAQ → 单 Agent+工具 → Multi-Agent 分域；不要一步到位，先让单 Agent 把流程跑通收集数据；
- 灰度与回滚：新 Agent/新 Prompt 按流量灰度，保留规则引擎作为紧急回滚通道。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Multi-Agent 协作模式](/agent-architecture/multi-agent-collaboration-patterns)
- [Human-in-the-Loop 实现](/system-design/human-in-the-loop)
- [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)
