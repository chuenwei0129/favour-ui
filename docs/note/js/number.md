---
title: Number
order: 0
toc: content
group:
  title: 数据类型
---

# Number

## JS 神奇的 Number

JavaScript 的 Number 类型既神奇又复杂，能够处理各种数值运算，但也隐藏着一些不直观的行为。

```js
// 不同类型的 整数 小数 判等相同
console.log(37 === 37.0) // true

// Demo 1 - 乘法异常
console.log(18.9 * 100) // 1889.9999999999998
console.log(64.68 * 100) // 6468.000000000001

// Demo 2
// 典中典
console.log(0.1 + 0.2 === 0.3) // false
console
  .log(0.10000000000000001 === 0.1)(
    // true
    // api toPrecision，配合典中典食用
    0.1 + 0.2,
  )
  .toPrecision(16)(
    // '0.3000000000000000'
    0.1 + 0.2,
  )
  .toPrecision(17)(
    // '0.30000000000000004'
    0.1,
  )
  .toPrecision(17) // '0.10000000000000001'

// Demo 3 - api toFixed 返回值反直觉
console.log((1.005).toFixed(2)) // 返回的是 1.00 而不是 1.01

// Demo 4 - 无限循环
let num = 2 ** 53
while (true) {
  if (++num % 13 === 0) {
    return num
  }
}

// Demo 5 - 数值转换
JSON.parse('{"a":180143985094813214124}') // 值少了 {a: 180143985094813220000}

// Demo 6 - 位运算异常
const a = 2 ** 31
// 1.值相等，但判等失败
console.log((a | 0) === a) // false
// 2.位运算后符号异常
console.log((2 ** 31 - 1) << 1) // -2
console.log((2 ** 32 - 1) >> 1) // -1
```

## 原因所在

要理解这些现象，需要掌握一些[前置知识](#前置知识)。太长不看，直接解释 👇

### Number 定义

> 在 JavaScript 代码中，像 37 这样的数字字面量是浮点数值，而不是整数。在常见的日常使用中，JavaScript 没有单独的整数类型。(JavaScript 还有一个 [BigInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt) 类型，但它并不是为了取代 Number 而设计的，37 仍然是一个数字，而不是一个 BigInt。) JavaScript 的 `Number` 类型是一个[双精度 64 位二进制格式 IEEE 754](https://zh.wikipedia.org/wiki/%E9%9B%99%E7%B2%BE%E5%BA%A6%E6%B5%AE%E9%BB%9E%E6%95%B8) 值。

```js
// 如你所见，JS 认为 37.0 是一个整数。

Number.isInteger(37.0) // true

37 === 37.0 // true
Object.is(37, 37.0) // true
```

### demo 1

```js
// 乘法异常
console.log(18.9 * 100) // js => 1889.9999999999998 > 数学 => 1890
console.log(64.68 * 100) // js => 6468.000000000001 < 数学 => 6468
```

首先 18.9 这个数字，转换成 IEEE 754 值如下图：

![20240321114229](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321114229.png)

尾数部分是无限循环的，计算机在存储时必然溢出，所以需要要舍弃后面的数字，按[舍入规则](#舍入规则)计算，向下舍入，所以计算机中存储的值比实际数学中的值小，再通过乘法放大，结果也就说的通了。

```js
// 舍入规则
// ... => 代表前 52 位
...0110011...(实际数值)
...1000000...(中间值)
// 小于中间值，向下舍入，所以实际存储时，从第 53 位开始的值都被省略，所以 18.9 的真值大于机器数
```

那 64.68 经过计算后为啥还大了呢？

```js
// 实际上 64.68 尾数部分的二进制真实的是 10101110000101000111 (无限循环)
// 舍入规则
000000 10101110000101000111 10101110000101000111 101011 (实际数值前 52 位)
...10000101000111...(实际数值从 53 位起)
...10000000000000...(中间值)
// 等于中间值，且当前最低有效位 52 位为 1，要保留的最低有效位 1 为奇数，向上舍入，存储的值为
// 000000 10101110000101000111 10101110000101000111 101100
```

对比发现，存储时，实际值后三位 011 向上舍入变成了 100，所以计算机中存储的值比实际数学中的值大。

验证一下：

![20240321133705](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321133705.png)

### demo 2

```js
console.log(0.1 + 0.2 === 0.3) // false
console
  .log(0.10000000000000001 === 0.1)(
    // true
    // api toPrecision，配合典中典食用
    0.1,
  )
  .toPrecision(17)(
    // '0.10000000000000001'
    0.1 + 0.2,
  )
  .toPrecision(16)(
    // '0.3000000000000000'
    0.1 + 0.2,
  )
  .toPrecision(17) // '0.30000000000000004'
```

> **计算误差并不是简单因为参与计算的项不能精确表示，其本质原因，还是有效位位数的限制。并不是所有参与计算的数值都是精确的，结果就一定是精确的。**

![20240321140755](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321140755.png)

![20240321140952](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321140952.png)

![20240321141310](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321141310.png)

![20240321110221](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321110221.png)

```js
// 从图中可以容易看出 0.1 的机器数向上舍入了，0.2 的机器数也向上舍入了，0.3 的机器数向下舍入了。
0.1 + 0.2 > 0.3 // true
// 0.1 在 17 位时会丢失精度（不止要一一对应一个数学上的值，还要精确表示数学上的那个值），表示计算机中存储的值可能此时对应不止一个数学上的值。
0.10000000000000001 === 0.1 // true
// 0.1 因为无法精确表达数学值，丢失了精度
// (0.1).toPrecision(17) 因为无法一一对应数学值，丢失了精度
// 0.25 可精确表达
// 我们期望的是数学值的结果，计算机是运算的浮点数的结果。
```

### demo 3

```js
console.log((1.005).toFixed(2)) // 返回的是 1.00 而不是 1.01
```

> toFixed 使用定点表示法来格式化一个数值

![20240321170809](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321170809.png)

观察上图，我们可以发现，1.005 存储时明显向下舍入了，所以它精度丢失了，按照存储的值转换为十进制之后的结果是 1.00499999999999989341858963598，所以我们使用 toFixed(2) 会出现这个问题。

### demo 4

> [大整数精度](#大整数精度)

### demo 5

> [大整数精度](#大整数精度)

### demo 6

> [JavaScript 中的常用按位操作符及描述如下表所示，**所有的按位操作符的操作数都会被转成补码形式的有符号 32 位整数**。](#位运算)

## 前置知识

### 原码、反码、补码

在计算机科学中，计算机是用二进制来存储数据的，所以数字也需要转换成相应二进制：0 或者 1 的不同组合序列。

考虑一个 8 位二进制数用于存放数据，正数的十进制和二进制关系如下所示：

| 十进制 | 二进制（8 位） |
| ------ | -------------- |
| 0      | 0000 0000      |
| 1      | 0000 0001      |
| 2      | 0000 0010      |
| 3      | 0000 0011      |

为了区分负数，引入了 `原码` 表示法，其中最左边的一位用于表示符号 (0 为正，1 为负)。因此，负数的十进制值对应的 8 位二进制原码如下所示：

| 十进制 | 二进制（8 位） |
| ------ | -------------- |
| -0     | 1000 0000      |
| -1     | 1000 0001      |
| -2     | 1000 0010      |
| -3     | 1000 0011      |

然而，这种表示法导致正数和负数的原码相加不为 0。

```js
// -1 + 1
0000 0001 + 1000 0001 = 1000 0010 // 结果为 -2，不是我们期望的 0
```

为了解决这个问题，引入了 `反码` 表示法。反码的计算规则是：正数的反码与其原码相同，负数的反码由其原码的符号位保持不变，其余位取反。负数的十进制值、原码和反码的对应关系如下所示：

| 十进制 | 二进制原码（8 位） | 二进制反码（8 位） |
| ------ | ------------------ | ------------------ |
| -0     | 1000 0000          | 1111 1111          |
| -1     | 1000 0001          | 1111 1110          |
| -2     | 1000 0010          | 1111 1101          |
| -3     | 1000 0011          | 1111 1100          |

使用反码进行计算：

```js
// -1 + 1
1000 0001(原码) + 0000 0001(原码) = 1111 1110(反码) + 0000 0001(反码) = 1111 1111(反码) // 这是 -0 的反码
```

尽管反码解决了一些问题，但 -0 和 +0 的存在仍然是一个问题。因此，引入了 `补码` 表示法：正数的补码与其原码相同，负数的补码是其反码加 1。负数的十进制值、原码、反码和补码的对应关系如下所示：

| 十进制 | 二进制原码（8 位） | 二进制反码（8 位） | 二进制补码（8 位） |
| ------ | ------------------ | ------------------ | ------------------ |
| -0     | 1000 0000          | 1111 1111          | 0000 0000          |
| -1     | 1000 0001          | 1111 1110          | 1111 1111          |
| -2     | 1000 0010          | 1111 1101          | 1111 1110          |
| -3     | 1000 0011          | 1111 1100          | 1111 1101          |

通过补码，-0 和+0 都表示为 0000 0000，解决了原码和反码中的问题。

```js
// -1 + 1
1000 0001(原码) + 0000 0001(原码) = 1111 1111(补码) + 0000 0001(补码) = 0000 0000(补码) // 结果为 0
```

补码的优点：

1. **统一加法和减法**：通过补码，加法和减法可以使用相同的硬件操作实现，简化了计算机的算术逻辑。
2. **只有一个零的表示**：补码消除了原码和反码中存在的+0 和-0 的区别，简化了逻辑设计和运算处理。
3. **自然的溢出处理**：补码运算中的溢出可以被自动忽略，简化了错误处理。
4. **优化存储和运算效率**：补码不仅优化了算术运算过程，还通过减少所需硬件，降低了成本并提高了速度。

### 机器数和真值

机器数是指一个数字在计算机内部使用二进制表示的形式，带有符号位。正数的符号位为 0，负数的符号位为 1。

然而，机器数的最高位被用作符号位，意味着机器数的表示形式并不直接等同于其实际数值。例如，有符号数 `10000001`，按无符号数解读为 `129`，但由于最高位为 1 表示这是负数，其真实数值应为 `-127` (按照补码解读)，而非形式上的 `129`。因此，区分机器数的形式值和真实值 (真值) 是重要的。

### 位运算

JavaScript 中的常用按位操作符及描述如下表所示，**所有的按位操作符的操作数都会被转成补码形式的有符号 32 位的二进制串进行计算**，如果二进制串超过 32 位，则只保留最后的 32 位进行计算。

> 现代 JS 引擎普遍使用 JIT 优化代码，位运算性能接近原生代码，所以该用位运算的地方大胆用就是了，对性能只有好处没坏处。

| 运算符             | 用法      | 描述                                                                                                      |
| ------------------ | --------- | --------------------------------------------------------------------------------------------------------- |
| 按位与（AND）      | `a & b`   | 对于每一个比特位，只有两个操作数相应的比特位都是 1 时，结果才为 1，否则为 0。                             |
| 按位或（OR）       | `a \| b`  | 对于每一个比特位，当两个操作数相应的比特位至少有一个 1 时，结果为 1，否则为 0。                           |
| 按位异或（XOR）    | `a ^ b`   | 对于每一个比特位，当两个操作数相应的比特位有且只有一个 1 时，结果为 1，否则为 0。                         |
| 按位非（NOT）      | `~a`      | 反转操作数的比特位，即 0 变成 1，1 变成 0。                                                               |
| 左移（Left shift） | `a << b`  | 将 a 的二进制形式向左移 b (< 32) 比特位，右边用 0 填充。                                                  |
| 有符号右移         | `a >> b`  | 将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位。若值为正，则在左侧填充 0；若值为负，则在左侧填充 1。 |
| 无符号右移         | `a >>> b` | 将 a 的二进制表示向右移 b (< 32) 位，丢弃被移出的位，无论正负，都使用 0 在左侧填充。                      |

运算符的优先级：`~` 的优先级最高，其次是 `<<`、`>>` 和 `>>>`，再次是 `＆`，然后是 `^`，优先级最低的是 `|`。

> [JavaScript 的位操作应该避免吗？](https://www.zhihu.com/question/65747485/answer/234725511)
>
> **并不是 ‘应该避免位运算’，真正该用的地方当然是要用。而是要 ‘避免误用位运算’。**
>
> V8 represents objects and numbers with 32 bits. It uses a bit to know if it is an object (flag = 1) or an integer (flag = 0) called SMI (SMall Integer) because of its 31 bits. Then, if a numeric value is bigger than 31 bits, V8 will box the number, turning it into a double and creating a new object to put the number inside. Try to use 31 bit signed numbers whenever possible to avoid the expensive boxing operation into a JS object.
>
> 根据规范，JavaScript 并不知道整数 (除了最近引入的 BigInts)。它只知道浮点数。但是许多操作都是基于整数，比如程序中的 for 循环。所有 JavaScript 引擎都有一个特殊的整数表示方式。V8 有所谓的 Smis [小整数](https://zhuanlan.zhihu.com/p/43992828)。

**位运算使用技巧：**

- [JavaScript 中的位运算和权限设计](https://juejin.cn/post/6844903988945485837)
- [位运算有什么奇技淫巧](https://www.zhihu.com/question/38206659)
- [位运算的算法应用](https://juejin.cn/post/6962083070442733598)
- [巧用 JS 位运算](https://zhuanlan.zhihu.com/p/34294099)
- [一文搞明白位运算、补码、反码、原码](https://juejin.cn/post/6844903912425259022)
- [ObservedBits：React Context 的秘密功能](https://zhuanlan.zhihu.com/p/51073183)

### [什么是浮点数](https://www.zhihu.com/question/19848808/answer/120393769)

**小数点在数制中代表一种对齐方式**，比如说你要比较 `1000` 和 `200` 哪个比较大你应该怎么做呢？你必须把他们**右对齐**：

```js
1000
0200
```

然后发现 `1` 比 `0` (前面补零) 大，所以 `1000` 比较大。那么如果是比较 `1000` 和 `200.01` 呢？这时候就不是右对齐了，而是对应位对齐，也就是**小数点对齐**：

```js
1000.00
0200.01
```

**小数点位置在进制表示中是至关重要的，位置差一位整体就要差进制倍** (十进制就是十倍)。在计算机中也是这样，虽然计算机使用二进制，但在处理非整数时，也需要考虑小数点位置的问题，**无法对齐小数点就无法做加法、减法比较这样的操作**。

在计算机中处理小数点位置有**浮点**和**定点**两种，**定点就是小数点永远在固定的位置上**，比如说我们约定一种 32 位无符号定点数，它的小数点永远在第 `5` 位后面，这样最大能表示的数就是 `11111.111111111111111111111111111`，最小非零数是 `(2^-27)`。**定点数是提前对齐好的小数，整数是一种特殊情况，小数点永远在最后一位之后。**

**定点数的优点是很简单**，大部分运算实现起来和整数一样或者略有变化，**但是缺点则是表示范围**，比如我们刚才的例子中，最大只能表示 `32`；而且在表示很小的数的时候，大部分位都是 `0`，精度很差，不能充分运用存储单元。浮点数就是设计来克服这个缺点的，它相当于一个定点数加上一个阶码，**阶码表示将这个定点数的小数点移动若干位**。**由于可以用阶码移动小数点，因此称为浮点数。**

在计算器科学中，浮点是一种对于实数的近似值数值表示法，由一个有效数字 (即尾数) 加上幂数来表示，通常是乘以某个基数的整数次指数得到。以这种表示法表示的数值，称为浮点数。可以简单理解为：浮点数是十进制科学记数法在计算机中的二进制表示，即二进制的科学记数法 (可能有点不太严谨，但有时便于理解记忆更为重要)。

### IEEE 754 标准

- [从科学记数法到浮点数标准 IEEE 754](https://mp.weixin.qq.com/s/mf1mH-aGWgcC6v2R8ijE8A)
- [IEEE754 标准：浮点数在内存中的存储方式](https://zhuanlan.zhihu.com/p/343033661)
- [为什么 8 bit 限制是 -128 到 127 而不是 -127 到 128？](https://www.zhihu.com/question/405701348)

### 浮点数在内存中的存储方式

想要存储一个 32 位浮点数，比如 20.25，在内存或硬盘中要占用 32 个二进制位。

![](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/js/v2-32e425cdb908c47586267e59228fcd22_1440w.png)

这 32 个二进制位的内存编号从高到低 (从 31 到 0)，共包含如下 3 个部分：

- **sign**：符号位，即图中蓝色的方块。
- **biased exponent**：偏移后的指数位，即图中绿色的方块。
- **fraction**：尾数位，即图中红色的方块。

**步骤：**

1. 将十进制数值转换为二进制数值。

   ![](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/computer/SCR-20220408-acz.png)

   ```js
   // 遇到小数转换时，需要把整数和小数两部分分别进行处理

   // 整数 20 除以 2 直到商是 0 为止，取每次除 2 得到的余数结果

   20 / 2 = 10     ...... 0
   10 / 2 = 5      ...... 0
   5  / 2 = 2      ...... 1
   2  / 2 = 1      ...... 0
   1  / 2 = 0      ...... 1
   // 结果为得到的余数按照从下往上排列 10100

   // 小数 0.25 乘以 2 直到不存在小数位为止，并计下每次乘后的整数位结果
   0.25 * 2 = 0.5  ...... 0
   0.5 * 2 = 1     ...... 1
   // 结果为得到的整数位按照从上往下排列 01

   // 将计算后的 0 1 序列拼在一起就得到转换的二进制 10100.01
   ```

2. 将二进制数值转换为科学记数法。其中，二进制表示采用原码表示。`10100.01` 用科学计数法表示为 $1.010001 \times 2^4$

3. 确定符号位：如果是正数，符号位为 `0`；如果是负数，符号位为 `1`。20.25 是正数，所以符号位为 `0`。

4. 计算阶码：将科学记数法的指数值加上偏移值 (单精度为 `127`，双精度为 `1023`)，再转换为 `8` 位二进制。指数值为 `4`，加上偏移值后为 `131`，转换为二进制为 `1000 0011`。

5. 计算尾数：由于尾数只存储有效数字的**小数部分**，所以尾数为 `010001`。最高位 `1` 规定不显式存储，以隐含方式存在，计算或恢复数值时再把这个 `1` 补上。如果尾数不足 23 位则右边用 `0` 填充至 23 位。

**总结：**

最终得到的 32 位浮点数表示为 (分段显示方便阅读)

- 符号位是：`0`
- 偏移后指数位 (阶码) 是：`1000 0011`
- 补零后尾数位是：`0100 0100 0000 0000 0000 000`

现在，把这三部分按顺序放在 32 位浮点数容器中，就是 `0 1000 0011 0100 0100 0000 0000 0000 000`

这里有一个可以[在线浮点数转二进制](https://tooltt.com/floatconverter/)的网站，我们来验证一下：

![20240307200242](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240307200242.png)

为了加深理解，我们再反向推导一遍：

将浮点数 `0 1000 0011 0100 0100 0000 0000 0000 000` 恢复为十进制数：

1. 符号位为 `0`，说明该数为正数。
2. 阶码为 `1000 0011`，因此实际指数值为 `131 - 127 = 4`。
3. 尾数 = 小数部分 `0100 0100 0000 0000 0000 000` + 隐含值 `1` = `1.0100 01`
4. 因此该浮点数所表示的实际数值为 $1.0100 01 \times 2^4$。
5. 小数点向右移动 4 位，得到二进制数 `10100.01` 转换为十进制就是 `20.25`。

### 舍入规则

从数学角度说，无论任何浮点数标准，都面临用有限的集合去映射无限的集合的问题，都一定会存在精度问题。对于这种数值表示的标准，一定会考虑的情况就是当发生溢出的时候，数值应该怎样表示。对于舍入，可以有很多种规则，可以向上舍入，向下舍入，向偶数舍入。而 IEEE 754 采用向最近偶数舍入 (round to nearest even) 的规则。

#### 规则

舍入的规则需要区分三种情况：

- 当具体的值大于中间值的时候，向上舍入。
- 当具体的值小于中间值的时候，向下舍入。
- 当具体的值等于中间值的时候，向偶数舍入。

向偶数舍入指的是要保留的最低有效位为偶数，具体规则：

- 要保留的最低有效位如果为奇数，则向上舍入。
- 要保留的最低有效位如果为偶数，则向下舍入。

上面的舍入规则，提到了一个很重要的概念，中间值。怎样才能确定这个中间值呢？

要找到中间值，先确定要保留的有效数字，找到要保留的有效数字最低位的下一位。如果这位是进制的一半，而且之后的位数都为 0，则这个值就是中间值。

上面的描述比较抽象，来看两个例子

- 十进制的 `1.2500`，要保留到小数点后一位，下一位是 `5`，是十进制的一半，后面位数都为 0，所以这个值就是中间值。
- 二进制的 `10.0110`，要保留到小数点后两位，下一位是 `1`，是二进制的一半，后面位数都为 0，所以这个值就是中间值。

#### 例子

知道了舍入规则之后，我们来看几个具体的例子，以二进制为例，有效位数保留到小数点后两位。

- `10.00011`，中间值为 `10.00100`，小于中间值，向下舍入为 `10.00`
- `10.00110`，中间值为 `10.00100`，大于中间值，向上舍入为 `10.01`
- `10.11100`，中间值为 `10.11100`，等于中间值，要保留的最低有效位 `1` 为奇数，向上舍入为 `11.00`
- `10.10100`，中间值为 `10.10100`，等于中间值，要保留的最低有效位 `0` 为偶数，向下舍入为 `10.10`

### 浮点数的精度是如何计算的

#### 小数精度

数学是一门抽象的学科，而计算机会面临着具体的实现。我们的浮点数标准就是在做这样一件事：**建立计算机中存储的一个零一序列到抽象数学中的一个数字的一对一的映射**。

而这里有一个无法解决的问题，**数学中任意小段连续的数轴中的小数就是无限的**，这意味着我们需要无限个互不相同的零一序列 (一对一的映射) 才能表示。极端一点，计算机甚至无法存储 1 到 2 之间的某一个小数，比如对于小数 1.00000.....一万亿个零.....00001。

不过计算机却能存储 [1，10000] 之间的所有整数。因为整数是 “离散” 的，[1，10000] 之间的整数只有 10000 个。

我们用舍入规则解决了有限长度编码下，二进制中不能精确表示的值的存储，但对于数学中任意小段连续的数轴中的小数，计算机又是如何存储的呢？事实上，计算机为了进行小数运算，不得不将小数也当成 “离散” 的值，一个一个的，就像整数那样：

![](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/js/v2-886f0c2a7559e2cd66ab4d4c917a7a95_1440w.png)

- 数学中的整数是一个一个的，想象绿色指针必须一次走一格
- 数学中的小数是连续的，想象绿色指针可以无极调节，想走到哪儿走到哪儿，
- 计算机中存储的小数是一个一个的，绿色指针必须一次走一格，就像整数那样

这就引发了精度的问题，比如上图中，我们无法在计算机中存储 0.3，因为绿色指针只能一次走一格，要么在 0.234，要么就到了 0.468...

当然，我们也可以增加计算机存储小数的**精度**，或者说缩小点与点之间的间隔：

![20240321150005](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321150005.png)

32 位浮点数会形成一个表盘，表盘上的蓝点逐渐稀疏 (我的理解：以 [0，1] 区间与 [2，3] 区间对比，数学中的小数个数相同，计算机存储时，0.5 所占用的尾数格子比 1.5 少，所以计算机可以存储 [0，1] 之间的小数比 [1，2] 区间的多，所以数字越大蓝点逐渐稀疏)。绿色指针只能指向某个蓝点，不能指向两个蓝点之间的位置。或者换句话说：**32 位浮点数只能保存蓝点对应的值**。

**如果你要保存的值不是蓝点对应的值，就会被自动舍入到离该数最近的蓝点对应的值**。

举例：

在 `0.5 ~ 1` 这个范围内，间隔**约为** `5.96046e-8`，即**约为** `0.0000000596046`

![20240321151614](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321151614.png)

也就是说：表盘上有一个蓝点是 `0.5`

下一个蓝点应该是：`当前蓝点 + 间隔 ≈ 0.5 + 0.0000000596046 ≈ 0.5000000596046`

那，如果我们要保存 **0.50000006**，也就是我们要保存的这个值，稍大于下一个蓝点：

![](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/js/v2-6a03627668b34c78ff9452fe6df42ccb_1440w.png)

因为绿色指针必须指向蓝点，不能指向蓝点之间的位置，所以绿色指针会被 “校准” 到 **0.5000000596046**，或者说我们要保存的 **0.50000006，**会被**舍入**为 **0.5000000596046**。

事实上，每个 32 位浮点数容器中，存储的必然是一个蓝点值。

验证一下，首先求出从 `0.5` 开始的蓝点值：

```js
const gap = 0.0000000596046
let ret = 0.5
let i = 0

while (i < 10) {
  ret = ret + gap
  console.log(ret)
  i++
}

// 这里计算的值是 0.5 以后的蓝点值
// 0.5000000596046
// 0.5000001192092001
// 0.5000001788138001
// 0.5000002384184001
// 0.5000002980230002
// 0.5000003576276002
// 0.5000004172322002
// 0.5000004768368003
// 0.5000005364414003
// 0.5000005960460003
// 这样数学上的 0.5000001 在计算机中就可以对应不止一个蓝点了，也就是 0.5000001 可以用 0.5000001788138001 或者 0.5000001192092001 表示。
// 再比如数学上 0.50000011 在计算机中可以找到，0.50000012 在计算中就找不到对应的点了，所以计算机就无法精确表示 0.50000012，精度到 7 位。
```

打开 IEEE754 的维基百科，可以看到其中标注着，单精度浮点数的精度是 “**大约 7 位十进制数**”。

![](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/js/v2-28e38af53fd59e0cfc058667e97bc4b0_1440w.png)

#### 大整数精度

> [JavaScript 里最大的安全的整数为什么是 2 的 53 次方减一？](https://www.zhihu.com/question/29010688)
>
> **“安全”** 的意思是说能够 **one-by-one** 表示的整数，也就是说在 `(-2^53, 2^53)` 范围内，_双精度数表示和整数是一对一的_，反过来说，**在这个范围以内，所有的整数都有唯一的浮点数表示，这叫做安全整数**。
>
> 而超过这个范围，会有两个或更多整数的双精度表示是相同的；反过来说，超过这个范围，有的整数是无法精确表示的，只能 `round` 到与它相近的浮点数表示，这种情况下叫做不安全整数。
>
> **注意事项**：在解析序列化的 JSON 时，超出此范围的整数值可能会被破坏。在工作中使用 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 类型代替，是一个可行的解决方案。

![20240321160618](https://raw.githubusercontent.com/chuenwei0129/my-picgo-repo/master/me/20240321160618.png)

#### 参考资料

- [浮点数计算精度问题详解](https://zhuanlan.zhihu.com/p/467157712)
- [IEEE754 标准：三，为什么说 32 位浮点数的精度是 “7 位有效数”](https://zhuanlan.zhihu.com/p/343040291)
- [JavaScript 著名面试题：0.1 + 0.2 !== 0.3，即将成为过去](https://zhuanlan.zhihu.com/p/225490777)

### 非规格数，±0，±infinity 和 NaN 都是什么

> [IEEE754 规范：四，非规格数，±infinity，NaN](https://zhuanlan.zhihu.com/p/343049681)
>
> 在浮点数表示法中 `NaN` 一共 **2^53 - 2** 个，`Infinity` 有 **2** 个，`0` 也有 **2** 个。
>
> **整数零不能做除数，但是浮点数零可以做除数。**
>
> [为什么 0 不能做除数？](https://www.bilibili.com/video/BV1qT4y1B7ot)
>
> [为什么在 JavaScript 中 NaN 不能是一个独立的类型？](https://www.zhihu.com/question/379014728)

## 从 min 到 max 的随机整数？

创建一个函数 `randomInteger(min，max)`，该函数会生成一个范围在 `min` 到 `max` 中的随机整数，包括 `min` 和 `max`。

在 `min..max` 范围中的所有数字的出现概率必须相同

### 简单但错误的解决方案

最简单但错误的解决方案是生成一个范围在 min 到 max 的值，并取对其进行四舍五入后的值：

```js
function randomInteger(min, max) {
  let rand = min + Math.random() * (max - min)
  return Math.round(rand)
}

alert(randomInteger(1, 3))
```

这个函数是能起作用的，但不正确。获得边缘值 `min` 和 `max` 的概率比其他值低两倍。

如果你将上面这个例子运行多次，你会很容易看到 `2` 出现的频率最高。

发生这种情况是因为 `Math.round()` 从范围 `1..3` 中获得随机数，并按如下所示进行四舍五入：

```js
values from 1    ... to 1.4999999999  become 1
values from 1.5  ... to 2.4999999999  become 2
values from 2.5  ... to 2.9999999999  become 3
```

现在我们可以清楚地看到 `1` 的值比 `2` 少两倍。和 `3` 一样。

### 正确的解决方案

这个题目有很多正确的解决方案。其中之一是调整取值范围的边界。为了确保相同的取值范围，我们可以生成从 `0.5` 到 `3.5` 的值，从而将所需的概率添加到取值范围的边界：

```js
function randomInteger(min, max) {
  // 现在范围是从  (min-0.5) 到 (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

alert(randomInteger(1, 3))
```

另一种方法是使用 `Math.floor` 来取范围从 `min` 到 `max+1` 的随机数：

```js
function randomInteger(min, max) {
  // here rand is from min to (max+1)
  // [0, 1.99] 向下取整 => [0, 1]
  // randomInteger 随机整数
  let rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

console.log(randomInteger(0, 1))
```

现在所有间隔都以这种方式映射：

```js
values from 1  ... to 1.9999999999  become 1
values from 2  ... to 2.9999999999  become 2
values from 3  ... to 3.9999999999  become 3
```

所有间隔的长度相同，从而使最终能够均匀分配。
