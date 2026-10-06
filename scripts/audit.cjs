// 站点体检：断链 / frontmatter 规范 / 刷题池完整性
const fs = require("fs");
const path = require("path");
const DOCS = "D:/codex_work/网站/docs";

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (f.endsWith(".md")) out.push(p);
  }
  return out;
}
const files = walk(DOCS);
const exists = (linkPath) => {
  const clean = linkPath.split("#")[0].split("?")[0];
  if (!clean) return true;
  const base = path.join(DOCS, clean.replace(/^\//, ""));
  return fs.existsSync(base + ".md") || fs.existsSync(path.join(base, "index.md")) || fs.existsSync(base);
};

let broken = [], fmIssues = [], pool = [], categoriesByDir = {};
const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const LINK_RE = /\[[^\]]*\]\((\/[^)\s]+)\)/g;

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const rel = path.relative(DOCS, f).replace(/\\/g, "/");
  // 1) 内链检查
  let m;
  const re = new RegExp(LINK_RE.source, "g");
  while ((m = re.exec(src))) {
    if (!exists(m[1])) broken.push(`${rel} → ${m[1]}`);
  }
  // 2) frontmatter
  const fmM = src.match(FM_RE);
  if (!fmM) { fmIssues.push(`${rel}: 无 frontmatter`); continue; }
  const fm = fmM[1];
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*(.+)$`, "m")) || [])[1];
  const cat = get("category");
  const dir = rel.includes("/") ? rel.split("/")[0] : "(root)";
  if (cat) {
    (categoriesByDir[dir] ??= {})[cat] = (categoriesByDir[dir][cat] ?? 0) + 1;
    // 3) 刷题池文件规范（非 index、非 interview/scrape/random/stats）
    const isIndex = /(^|\/)index\.md$/.test(rel);
    const excluded = rel.startsWith("interview/") || rel.startsWith("scrape/") || ["random", "stats", "mock-interview", "review"].some((d) => rel.startsWith(d + "/"));
    if (!isIndex && !excluded) {
      pool.push(rel);
      for (const k of ["title", "category", "tags", "importance", "mastery", "source"]) {
        if (!get(k)) fmIssues.push(`${rel}: 缺 ${k}`);
      }
      const imp = Number(get("importance"));
      if (!(imp >= 1 && imp <= 3)) fmIssues.push(`${rel}: importance 非法(${get("importance")})`);
      const tagsM = fm.match(/^tags:\s*\[(.+)\]/m);
      const tagCount = tagsM ? tagsM[1].split(",").filter((x) => x.trim()).length : 0;
      if (tagCount < 2 || tagCount > 4) fmIssues.push(`${rel}: tags 数量 ${tagCount}`);
      if (!/^## 问题\s*$/m.test(src)) fmIssues.push(`${rel}: 缺 ## 问题 节`);
      if (!/^## 核心答案\s*$/m.test(src)) fmIssues.push(`${rel}: 缺 ## 核心答案 节`);
    }
  }
}

console.log("=== 文件总数:", files.length, "| 刷题池:", pool.length, "===");
console.log("\n=== 断链 (" + broken.length + ") ===");
broken.slice(0, 20).forEach((x) => console.log("  " + x));
console.log("\n=== frontmatter 问题 (" + fmIssues.length + ") ===");
fmIssues.slice(0, 25).forEach((x) => console.log("  " + x));
console.log("\n=== 每个目录的 category 分布（检测不一致）===");
for (const [dir, cats] of Object.entries(categoriesByDir)) {
  const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  if (entries.length > 1) console.log(`  [!] ${dir}: ${entries.map(([c, n]) => `${c}(${n})`).join(" | ")}`);
  else console.log(`  ${dir}: ${entries[0][0]}(${entries[0][1]})`);
}
// 4) seen-urls 台账重复行
const seen = fs.readFileSync("D:/codex_work/网站/raw-interviews/seen-urls.txt", "utf8").split("\n").filter((l) => l.startsWith("http"));
const dupes = seen.filter((u, i) => seen.indexOf(u) !== i);
console.log("\n=== seen-urls 台账:", seen.length, "条，重复:", dupes.length, "===");
if (dupes.length) [...new Set(dupes)].forEach((d) => console.log("  dup:", d));
// 5) 待拆题队列
const pend = fs.readFileSync("D:/codex_work/网站/raw-interviews/pending-split.txt", "utf8").split("\n").filter((l) => l.includes("|"));
console.log("=== 待拆题队列:", pend.length, "条 ===");
