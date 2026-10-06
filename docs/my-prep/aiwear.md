# AIWear 智能穿搭助手 — 追问准备册

> 简历一句话：面向穿搭场景的 AI 应用，FastAPI + PostgreSQL + Redis 后端，接入 Qwen-VL 做图片描述/编辑/合并，CLIP 向量文搜图/图搜图，RAG 穿搭知识库问答。
> 仓库：github.com/saojesus733-gif/AIWear（README 已写明：JWT + 邮箱验证码 + Redis token 黑名单、SSE 流式 RAG、通义万相、Docker Compose + Nginx 部署、后续计划 pgvector 迁移与异步任务化）

## 电梯稿（30 秒，自己填熟）

> （留空：一句话说清"给谁解决什么问题 → 三块能力（多模态图片处理 / CLIP 双向检索 / RAG 问答）→ 关键技术选型 → 一个最拿得出手的细节"）

## 高概率追问链（源自真实面经）

### 一、CLIP 向量检索（你最容易被深挖的模块）

1. **向量为什么存 Redis，而不是 pgvector / 专用向量库？** ⭐3
   - 追问：Redis 做向量索引的原理？数据量到 100 万、1000 万条会怎样？
   - 追问：README 里你自己写了"后续迁移 pgvector"——为什么？什么时候迁？
   - 准备要点：诚实讲清当前规模的权衡（数据量小、Redis 已在栈内、TopK 内存检索够用），并说出迁移触发条件（规模/过滤需求）。这正是 [Agent 基座定制](/agent-memory-tools/agent-runtime-customization) 考的"选型理由"。
   - 我的答案要点：（留空）

2. **文搜图/图搜图是 topK 还是 topP？召回质量怎么评？** ⭐2
   - 来源：[迅雷 Agent 一面](/interview/xunlei-agent) 原题（reranker 追问链）
   - 准备要点：topK；评召回质量可以准备 3-5 个自己做的 Bad Case 例子。参考 [Rerank：Bi-Encoder 与 Cross-Encoder](/rag/rerank-bi-cross-encoder)
   - 我的答案要点：（留空）

3. **CLIP 用哪个版本？为什么它适合这个场景？** ⭐2
   - 追问：CLIP 和普通 Embedding 模型（BGE 等）的区别？中文查询效果怎么保证？
   - 准备要点：README 写了 CLIP-ViT-Base-Patch16；讲清图文对齐训练让它天然支持跨模态检索；中文场景可以提"查询翻译或双语模型"的取舍。
   - 我的答案要点：（留空）

### 二、RAG 穿搭知识库问答

4. **双路召回为什么用？只用一路有什么问题？** ⭐2 — 来源：[经纬恒润一面](/interview/jingwei-hengrun-ai-app) RAG 10 连问原题
   - 整条追问链都要过：知识库规模多大 → 评测指标 → 标准答案哪来的 → 怎么避免编造 → 图片怎么处理。参考 [RAG 项目 10 连问](/rag/rag-project-deep-dive-chain)
   - 我的答案要点：（留空）

5. **SSE 流式输出为什么选 SSE 不是 WebSocket？断线了怎么办？** ⭐2
   - 准备要点：单向推送够用、HTTP 兼容性好、实现简单；断线重连的取舍要能讲。参考 [流式 SSE](/system-design/streaming-sse)
   - 我的答案要点：（留空）

### 三、Qwen-VL 多模态

6. **模型理解错用户意图（改错图）怎么办？** ⭐2 — 来源：[经纬恒润](/interview/jingwei-hengrun-ai-app) 原题
   - 准备要点：确认交互/预览确认/参数化编辑约束，讲一个真实 Bad Case。
   - 我的答案要点：（留空）

7. **图片编辑/合并是同步接口吗？耗时多久？涨量了怎么办？** ⭐2
   - 准备要点：README 自己写了"异步任务化"是后续计划——把它讲成已识别的演进方向（同步瓶颈 → 任务队列 → 轮询/推送），体现工程判断。
   - 我的答案要点：（留空）

### 四、后端与部署

8. **JWT + Redis 黑名单怎么设计的？token 泄露怎么处置？** ⭐2
   - 准备要点：登出/改密后旧 token 失效的机制、过期时间权衡。
   - 我的答案要点：（留空）

9. **Docker Compose 里编排了哪几个服务？Nginx 承担了什么？** ⭐1
   - 我的答案要点：（留空）

### 五、场景设计变体（对标字节场景题的问法）

10. **如果用户量涨 10 倍，这个系统最先崩哪一块？你怎么改？** ⭐3
    - 来源：[字节挂经](/interview/bytedance-feishu-ai-app) 场景题问法（"如果业务表结构变了怎么处理"同族）
    - 准备要点：按层推演——CLIP 向量规模（→pgvector/专用库）、VL 接口耗时（→异步）、SSE 长连接数（→网关层）、DB 读写。参考 [数据分析 Agent 场景题](/system-design/data-analysis-agent-scenario) 的答法框架。
    - 我的答案要点：（留空）

## 危险区（答不上容易挂）

- **数据规模说不出数**：图片多少张、知识库多少文档、QPS 多少——至少准备量级。字节面试官对"数字含糊"很敏感。
- **"每一步都是调 API"**：要能讲出至少一个你自己处理的边界情况（Qwen-VL 返回格式解析失败、CLIP 向量维度对不上、Redis 满了……）。
- **RAG 没有评测**：哪怕只有 10 条人工核对的问答对，也比"感觉还行"强。
