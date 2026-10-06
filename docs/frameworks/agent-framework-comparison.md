---
title: LangGraph / CrewAI / OpenAI Agents SDK / AutoGen 怎么选？
category: 框架
tags: [框架选型, CrewAI, AutoGen, LangGraph]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

多 Agent 框架现在很多：LangGraph、CrewAI、OpenAI Agents SDK、AutoGen……它们的设计思路有什么区别？你的项目会怎么选？

## 核心答案

**按"控制力 vs 抽象度"光谱排**：

- **LangGraph**：底层图编排，Node/Edge/State 显式建模，循环、持久化、Interrupt（HITL）原生支持——**控制力最强**，生产复杂系统首选（我的智居 Agent 项目就用它做工作流 + 中断恢复）；
- **CrewAI**：角色化抽象（Crew / Agent / Task），用"团队分工"的叙事快速搭多 Agent 协作——上手最快，但控制粒度较粗，复杂流程要绕；
- **OpenAI Agents SDK**：轻量，Handoff（移交）与工具调用与 OpenAI 生态深度整合——绑定其模型与工具生态，简洁但可移植性受限（该 SDK 迭代较快，以官方文档为准）；
- **AutoGen（微软）**：对话式多 Agent 协作起家，Agent 之间通过对话完成任务——适合研究与快速实验对话型协作，生产工程化程度相对弱。

**选型决策**：

1. 生产系统、需要精细控制流/持久化/人审 → **LangGraph**；
2. 快速验证角色分工类协作 → CrewAI；
3. 技术栈深度绑定 OpenAI 且场景简单 → Agents SDK；
4. 共同提醒：框架可替换，核心资产（Prompt、评估集、工具层、状态设计）要做框架无关。

## 深度解析

- 加分点：用"控制力 vs 抽象度"给框架定位是稳的——具体 API 与项目状态都在快速演进，面试主动注明时效性；
- 结合简历：可以说"我选 LangGraph 是因为需要 Interrupt 中断恢复和 checkpointer，这是角色化框架给不了的"——用需求反推选型；
- 雷区：只背一个框架名、或把"多 Agent"当默认答案（能单 Agent 不拆）。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [LLM 应用框架选型对比](/frameworks/framework-selection)
- [LangGraph 与 LangChain 的关系与差异](/frameworks/langgraph-vs-langchain)
- [Orchestrator-Workers 模式怎么落地](/agent-architecture/orchestrator-workers)
