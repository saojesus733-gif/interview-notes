# 智居 Agent（房源推荐与预约）— 追问准备册

> 简历一句话：LangGraph 编排的租房 Agent，主图意图路由 + 推荐/预约/闲聊子图，interrupt 中断恢复补全需求，LangChain SQL 工具链生成校验查询 MySQL，LangGraph Store 存偏好与预约记录，PG 存线程状态。
> 仓库：github.com/saojesus733-gif/house-agent（README：interrupt/command.resume 表单补全、预约校验房源来自当前会话推荐、生成工单后清空状态防重复下单、Docker Compose 部署、有公网演示）

## 电梯稿（30 秒，自己填熟）

> （留空：为什么租房场景适合 Agent 而不是表单 → 流程闭环（意图 → 补全 → 推荐 → 预约）→ 两个最硬的细节（Interrupt 中断恢复 / SQL 生成校验）→ 结果）

## 高概率追问链（源自真实面经）

### 一、架构选型（必问，且有真实翻车案例）

1. **为什么拆推荐子图和预约子图？单图不行吗？ReAct 和状态机怎么区分？** ⭐3
   - 来源：[经纬恒润一面](/interview/jingwei-hengrun-ai-app) 原题——当时候选人答"PPT 生成用状态机"，**面试官补刀"这其实就是工作流"**。你要能讲清：路径可枚举的固定流程用图/状态机，开放探索才用 ReAct。
   - 追问：你的主图路由是 LLM 判断还是规则？判断错了怎么办？
   - 准备要点：参考 [Workflow 与 Agent 的边界](/agent-architecture/workflow-vs-agent-boundary)、[ReAct 和状态机怎么区分](/agent-architecture/react-vs-state-machine-selection)
   - 我的答案要点：（留空）

2. **为什么用 LangGraph 而不是 LangChain 直接链式调，或者手写循环？** ⭐2
   - 来源：[美团 AI Agent 一面](/interview/20261004-318fea514b)（LangChain / LangGraph / 原生手写三者对比原题）
   - 准备要点：状态管理、条件边、checkpoint、interrupt——每个特性对应你项目里的真实需求。参考 [框架选型](/frameworks/framework-selection)
   - 我的答案要点：（留空）

### 二、Interrupt 中断恢复（你的王牌，必须讲透）

3. **interrupt 中断恢复的原理是什么？状态存在哪？断线重连后怎么续上？** ⭐3
   - 追问：interrupt 和自定义 state 字段管理多轮会话，分别适合什么场景？你为什么两个都用了？
   - 追问：如果用户补全需求补到一半关掉页面，三天后回来，会话怎么恢复？
   - 准备要点：线程 + checkpoint 落 PostgreSQL 的机制；interrupt 暂停点 → 人工输入 → command.resume 恢复。参考 [LangGraph Interrupt](/frameworks/langgraph-interrupt)（站内标了 ⭐3 对应这个项目）
   - 我的答案要点：（留空）

### 三、SQL 生成与数据查询（简历写了"生成并校验"，必被追问）

4. **生成的 SQL 怎么校验？查询错了怎么兜底？** ⭐3
   - 追问：怎么防 SQL 注入？Text2SQL 准确率多少、怎么评的？
   - 准备要点：schema 约束、白名单表列、只读账号、生成后语法/语义校验、失败重试与兜底话术——每一条对应你实际做了什么要能分清"做了/没做/为什么没做"。
   - 我的答案要点：（留空）

5. **意图识别怎么知道分的就是对的？相似问法不同意图怎么判？** ⭐2
   - 来源：[迅雷 Agent 一面](/interview/xunlei-agent) 原题
   - 追问：你的意图路由是分类模型还是 Prompt？量化过准确率吗？
   - 准备要点：参考 [意图识别量化](/agent-architecture/intent-recognition-quantification)
   - 我的答案要点：（留空）

### 四、记忆与状态

6. **用户预算偏好存在 Store 里，捞到之前有偏好的用户回来，Agent 怎么知道按旧偏好推还是重新问？** ⭐3
   - 来源：[迅雷 Agent 一面](/interview/xunlei-agent) 深挖原题——**面试官亲口说他们团队没解好**。坦诚给思路比硬答强：偏好带时效与置信度、关键决策显式确认。参考 [记忆复用难题](/agent-memory-tools/memory-reuse-vs-new-solution)
   - 我的答案要点：（留空）

7. **PG 存 LangGraph 状态，MySQL 存业务数据，为什么分开？** ⭐2
   - 我的答案要点：（留空）

### 五、预约闭环与安全

8. **预约要收集手机号/身份证，敏感信息你怎么处理的？重复下单怎么防？** ⭐2
   - 准备要点：README 写了"生成工单后清空状态"——讲清这套状态复位设计；敏感数据脱敏/不落日志。
   - 我的答案要点：（留空）

9. **场景变体：如果房源数据更新了、加了新字段（如地铁线），Agent 链路哪里要改？** ⭐2
   - 来源：[字节挂经](/interview/bytedance-feishu-ai-app) 场景题原问法（"业务表结构变了怎么处理"）
   - 我的答案要点：（留空）

## 危险区（答不上容易挂）

- **interrupt 讲不深**：这是简历亮点，答成"调了个 API"就浪费了——checkpoint 机制、恢复时参数怎么传、异常中断（重启后线程还在不在）要能画出来。
- **SQL 校验说不清**：简历白纸黑字写了"生成并校验"，答不出校验细节等于自曝。
- **没有量化数字**：房源多少条、意图识别准确率、预约转化（哪怕自测的）——准备 3 个数。
