---
title: Java 泛型与类型擦除
category: 编程语言
tags: [泛型, Java基础]
importance: 1
mastery: 未掌握
source: AI生成
---

## 问题

Java 泛型是怎么实现的？运行时还能拿到泛型信息吗？`List<String>` 和 `List<Integer>` 在运行时是同一个类吗？

## 核心答案

- **类型擦除**：泛型只存在于编译期，编译后擦除为边界类型——无边界 `<T>` 擦成 Object，有上界 `<T extends Number>` 擦成 Number；
- **运行时同一类**：`List<String>` 和 `List<Integer>` 运行时都是 `List`，两者的 getClass() 相等；
- **擦除的代价**：不能 `new T()`、不能 `new T[]`、不能 `instanceof List<String>`、基本类型不能作泛型参数（只能用包装类）；
- **桥接方法**：子类覆盖泛型方法时编译器自动生成签名匹配的桥接方法转发调用，一句话——擦除后靠它保住多态；
- **通配符 PECS**：`? extends T` 只能读不能写（生产者 Producer），`? super T` 只能写、读要转 Object（消费者 Consumer）。

## 深度解析

```java
List<String> list = new ArrayList<>();
// 编译后实际是：List list = new ArrayList();
// 编译器在读取处自动插入强转：(String) list.get(0)
// list.add(123) 编译报错，但这只是编译期检查
```

- 泛型信息并非完全丢失：字节码的 Signature 属性保留了泛型元数据，反射可通过 `getGenericSuperclass()` 拿到——Gson/Jackson 反序列化 `List<User>`、Spring 参数绑定都靠它（超类/字段/方法上的泛型可获取，局部变量不行）。
- 常见误区：以为 `new ArrayList<String>()` 运行时会检查元素类型——实际只靠编译器检查，可通过反射绕过塞入 Integer，取出时才抛 ClassCastException。
- 追问点：为什么 Java 用擦除而不像 C# 真泛型？——为了兼容旧版本字节码、平滑迁移；代价是运行期没有真正的泛型类型。

## 我的理解

（留空，后续自行填写）

## 关联题目

- [反射与动态代理](/language/reflection-dynamic-proxy)
- [Java 集合框架总览](/language/collection-hierarchy)
