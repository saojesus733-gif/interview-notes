---
title: String 为什么设计成不可变
category: 编程语言
tags: [String, Java基础, 不可变]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

String 是怎么实现不可变的？这样设计带来了哪些好处？StringBuilder 和 StringBuffer 又有什么区别？

## 核心答案

- **实现方式**：String 类被 final 修饰不能被继承，内部存储数组 private + final 封装，且不对外提供任何修改方法；
- **存储演进**：JDK 8 及以前是 `final char[]`，JDK 9 起改为 `final byte[]` + 编码标记，Latin-1 字符一字节存储，节省内存；
- **常量池复用**：不可变才能安全共享，相同字面量直接指向池中唯一实例，避免重复创建对象；
- **hashCode 缓存**：String 首次计算 hashCode 后缓存到成员变量，作 HashMap 的 key 时无需重复计算，定位快；
- **线程安全**：不可变对象天然线程安全，多线程共享无需加锁；
- **StringBuilder vs StringBuffer**：都可变；StringBuffer 方法带 synchronized 线程安全但慢，StringBuilder 非线程安全但快，单线程拼接首选。

## 深度解析

- 安全性考虑：String 可变的话，文件路径、网络地址、数据库用户名等参数可能在安全校验之后被恶意修改（TOCTOU 问题）；类加载器也用 String 表示类名，可变性会破坏类加载安全。

```java
// JDK 9 后的 String 内部结构：紧凑存储 + hash 缓存
public final class String {
    private final byte[] value; // JDK 8 前是 final char[]
    private final byte coder;   // LATIN1 或 UTF16 编码标记
    private int hash;           // 缓存的 hashCode，默认 0
}
```

- 常见误区：`replace`、`concat`、`substring` 都返回新对象，原对象不变；循环里用 `+` 拼接会产生大量中间对象，应改用 StringBuilder。
- 追问点：为什么 String 适合做 HashMap 的 key？——不可变保证 hashCode 永不变化且已被缓存，避免 key 改变后对象「找不到自己的桶」。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [==、equals 与 hashCode 的区别与契约](/language/equals-hashcode)
- [HashMap 的底层实现原理](/language/hashmap-principle)
