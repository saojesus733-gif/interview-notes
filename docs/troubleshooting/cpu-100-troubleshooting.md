---
title: 线上服务 CPU 100% 怎么排查
category: 线上排查
tags: [排查, Python, py-spy, 面试高频]
importance: 3
mastery: 未掌握
source: AI生成
---

## 问题

线上一台 Python 服务的进程 CPU 突然飙到 100%，大量接口超时告警。面试官问：你的排查步骤是什么？相关命令敢不敢现场敲？

## 核心答案

1. `top` 找到 CPU 最高的进程，记下 PID（确认是自己的服务：`ps -ef | grep <进程名>`）；
2. `top -Hp <pid>` 看进程内哪些**线程**在吃 CPU，记下线程号——Python 有 GIL，单进程 CPU 打满常见根因是纯计算代码或正则回溯，多线程场景也可能因 GIL 争用虚高；
3. **py-spy 直接看火焰图/栈**（对运行中进程免侵入、无需改代码）：

```bash
pip install py-spy
py-spy dump --pid <pid>              # 当前栈快照, 连打几次对比
py-spy top --pid <pid>               # 实时函数级 CPU 占用
py-spy record -p <pid> -o flame.svg  # 火焰图, 定位到函数行
```

4. 常见根因对号入座：热点函数里的死循环/低效算法、正则灾难性回溯、大 JSON 序列化、同步等待被误写成忙等；
5. 处置：先扩容/摘流量止血，再按火焰图修代码。

## 深度解析

- `top -Hp` 的 %CPU 是单核百分比，800% 表示吃满 8 核，别误判；容器内注意 cgroup 限额会让 top 读数失真；
- **间隔几秒连打 3 次 py-spy dump 对比**：栈顶一致是真卡死（死循环/锁），位置分散是正常密集计算；
- Java 对照（面试可能让你对比）：Java 用 `jstack <pid>` 抓栈（线程号转十六进制 grep nid），思路相同——"进程→线程→栈"三层下钻；Python 的优势是 py-spy 不需要信号安全处理，直接 attach；
- 雷区：只看进程级 CPU 不下钻线程；没有 py-spy 时可用 `gdb` + py-bt 或 strace 粗定位，但效率低。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [服务内存持续上涨怎么排查](/troubleshooting/oom-troubleshooting)
- [接口突然变慢的通用排查思路](/troubleshooting/api-slowdown-checklist)
