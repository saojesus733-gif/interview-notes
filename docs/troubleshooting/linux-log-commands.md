---
title: 日志排查常用命令组合
category: 线上排查
tags: [Linux, 日志, 排查]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题
面试官丢给你一台只有 SSH 权限的机器和几个 GB 的日志文件，让你现场查问题。
这些日志命令组合你真的会敲吗？

## 核心答案
1. 先 `ls -lh` 看有哪些日志文件、多大，再决定查哪个；大文件别直接 cat：用 `less app.log` 翻页（G 跳末尾、/ 搜索、F 实时跟踪）。
   压缩包用 `zcat app.log.gz | grep ERROR`，或 `zgrep ERROR app.log.gz` 一步到位。
2. 实时跟踪：`tail -f app.log`；只盯错误：`tail -f app.log | grep --line-buffered ERROR`（不加 --line-buffered 会因管道缓冲失去实时性）。
3. 看异常上下文：`grep -C 5 'NullPointerException' app.log`；-A 5 看后 5 行、-B 5 看前 5 行。
   定位到第一条报错后往前多看几行，它之前的 WARN 往往才是真正线索。
4. 按时间段截取：`sed -n '/2026-10-03 14:00/,/2026-10-03 14:10/p' app.log`，正则里的时间格式必须与日志一致（先 head -1 确认格式）。
5. 统计访问 Top10 IP：`awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10`。
   nginx 日志第一列默认就是客户端 IP；有代理时要用 X-Forwarded-For 字段。
6. 找 5xx：`grep -c ' 500 ' access.log` 统计条数；算占比：
   `echo "scale=2; $(grep -c ' 500 ' access.log) / $(wc -l < access.log)" | bc`。

## 深度解析
- Top10 IP 命令拆解：awk 取第一列 → sort 排序 → uniq -c 计数 → sort -rn 倒序 → head -10。
  关键点：uniq 只合并相邻重复行，sort 必须在 uniq 之前，这是最容易错的一步。
  想排除内网 IP 再统计：先 `grep -vE '^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)'` 过滤。
- awk/sed 提取字段示例（nginx combined 格式：$1 IP、$4 时间、$9 状态码）：

  ```bash
  awk '{print $4, $9}' access.log | sort | uniq -c   # 时间点 x 状态码分布
  awk '$0 >= "14:00" && $0 <= "14:10"' app.log       # awk 版按时间段过滤
  ```
- grep 提速与多模式：大文件加 `-F` 走固定字符串不走正则；`-m 100` 找够 100 条就停；多模式用 `-E 'ERROR|WARN'`。
  多文件一起查：`grep xxx app.log app.log.1`，或递归 `grep -r xxx logs/`。
- 追问点：日志几百 GB 怎么查？按天切割 + zgrep、先缩小时间窗、`-m` 限量；公司层面应接 ELK/Loki，别在单机硬扛。
  动手前先 `df -h` 确认磁盘余量，避免查询期间把磁盘写满或查爆。
- 追问点：`tail -f` 和 `tail -F` 区别？-F 在文件被轮转（重命名后重建）时会自动重新打开跟踪；顺带 `lsof | grep deleted` 可查被删但仍被进程占用的大日志。

## 我的理解

## 关联题目
- [接口突然变慢的通用排查思路](/troubleshooting/api-slowdown-checklist)
- [线上服务 CPU 100% 怎么排查](/troubleshooting/cpu-100-troubleshooting)
- [Python 的 GC 机制与循环引用](/troubleshooting/python-gc-cycles)
- [线上 OOM / 内存泄漏怎么排查](/troubleshooting/oom-troubleshooting)
