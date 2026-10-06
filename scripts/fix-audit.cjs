// 修复审计发现的问题：category 统一 / tags 超标修剪 / 台账去重
const fs = require("fs");
const path = require("path");
const DOCS = "D:/codex_work/网站/docs";

// 1) category 归一（新文件统一到站内既有短名）
const CAT_FIX = [
  [/^category: Agent 架构与核心机制$/m, "category: Agent 架构"],
  [/^category: 记忆与工具调用$/m, "category: 记忆与工具"],
  [/^category: 评估、部署与安全$/m, "category: 评估与部署"],
  [/^category: LangChain \/ LangGraph 框架$/m, "category: 框架"],
  [/^category: Prompt 工程与上下文工程$/m, "category: Prompt 工程"],
  [/^category: RAG 检索增强生成$/m, "category: RAG"],
  [/^category: 系统设计与工程实践$/m, "category: 系统设计"],
  [/^category: 真实面经$/m, "category: 真实面经"], // 保留
];

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (f.endsWith(".md")) out.push(p);
  }
  return out;
}
let catFixed = 0, tagFixed = 0;
for (const f of walk(DOCS)) {
  let src = fs.readFileSync(f, "utf8");
  const before = src;
  for (const [re, to] of CAT_FIX) src = src.replace(re, to);
  // interview/ 下唯一的旧文件 category: 面经 → 真实面经
  if (f.includes(path.join("docs", "interview")) || f.includes("\\interview\\")) {
    src = src.replace(/^category: 面经$/m, "category: 真实面经");
  }
  // 2) tags 超过 4 个的修剪到 4
  const tm = src.match(/^tags: \[(.+)\]$/m);
  if (tm) {
    const parts = tm[1].split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 4) {
      src = src.replace(tm[0], `tags: [${parts.slice(0, 4).join(", ")}]`);
      tagFixed++;
    }
  }
  if (src !== before) { fs.writeFileSync(f, src, "utf8"); catFixed++; }
}
console.log(`category/标签修复：${catFixed} 个文件改动，其中 tags 修剪 ${tagFixed} 个`);

// 3) 台账与队列去重（保留首次出现顺序）
for (const file of ["D:/codex_work/网站/raw-interviews/seen-urls.txt", "D:/codex_work/网站/raw-interviews/pending-split.txt"]) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const seen = new Set(), out = [];
  for (const l of lines) {
    if (l.startsWith("http")) {
      if (seen.has(l)) continue;
      seen.add(l);
    }
    out.push(l);
  }
  fs.writeFileSync(file, out.join("\n").replace(/\n+$/, "\n"), "utf8");
  console.log(path.basename(file), "→", seen.size, "条唯一 URL");
}
