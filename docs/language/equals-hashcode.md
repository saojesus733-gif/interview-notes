---
title: ==、equals 与 hashCode 的区别与契约
category: 编程语言
tags: [Java基础, equals, hashCode]
importance: 2
mastery: 未掌握
source: AI生成
---

## 问题

==、equals 和 hashCode 各自比较的是什么？为什么重写 equals 时必须同时重写 hashCode？不重写会在哪些场景下出问题？

## 核心答案

- **== 比引用**：基本类型比值，引用类型比内存地址（是否同一个对象）；
- **equals 比内容**：Object 默认实现就是 ==，比内容必须重写（如 String 已重写为按字符比较）；
- **hashCode 契约**：equals 相等则 hashCode 必须相等；hashCode 相等则 equals 不一定相等（哈希冲突允许）；
- **必须一起重写**：只重写 equals 时两个「相等」对象 hashCode 不同，存入 HashSet/HashMap 后无法去重、containsKey 查不到；
- **equals 五条约定**：自反性、对称性、传递性、一致性、对 null 返回 false。

## 深度解析

- HashMap 定位元素分两步：先用 hashCode 定位桶下标，桶内再用 equals 精确匹配。只重写 equals 时逻辑相等的两个对象落入不同桶，get/contains 全部失效。

```java
// 典型坑：Integer 缓存 -128~127，== 在区间内恰好为 true，超出后为 false
Integer a = 127, b = 127;
System.out.println(a == b);      // true，走缓存是同一对象
Integer c = 128, d = 128;
System.out.println(c == d);      // false，各自 new 的新对象
System.out.println(c.equals(d)); // true，比内容必须用 equals
```

- String 常量池：字面量 `"abc"` 指向池中同一对象，`==` 恰好为 true；但 `new String("abc")` 在堆上新开对象，比内容必须用 equals。
- 重写 equals 的规范姿势：先 `==` 判同一对象、再 `instanceof` 判类型、逐字段比较；用 `Objects.equals()` 防止 NPE，并同步用 IDE 生成 hashCode。
- 追问点：hashCode 相等但 equals 不相等是否违反契约？不违反，这是哈希冲突的本质；反过来 equals 相等而 hashCode 不等才是真正的违约。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [Java 集合框架总览](/language/collection-hierarchy)
- [HashMap 的底层实现原理](/language/hashmap-principle)
