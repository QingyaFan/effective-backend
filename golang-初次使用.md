# Golang使用感受

Golang是一种静态强类型语言，以性能和并发为主要特点。最近决定试一试，那就一起来看看。

## 一些特点

1. 强类型语言

声明变量需要声明类型： `var a int`、`var b float64`

2. if, for后面无括号，无while，for可以用range循环

```lang=go
if x < y {

}

for i:=0; i<10; i++ {

}
```

Golang中`for`就是`while`，例如

```lang=go
var start, end int = 0, 10
for {
    if start++; start < end {
        fmt.Println(start)
    } else {
        break
    }
}
```

3. 数组容量不可变，切片(slice)是容量可变的数组

使用append方法可以向slice中添加元素，且会自动管理slice的容量。

4. struct类似于对象

struct中只可以包含属性，通过`方法`可以为struct添加函数方法，这里的`方法`不同于函数，方法包含一个`接收者`，通过将函数的接收者设置为struct，每个该类型的struct都会用该方法。

```lang=go
type test struct {
    name string
    age int
}

func (t test) testMethod() string {
    return t.name + string(t.age)
}
```

5. interface在go中有很重要的地位

golang中一些核心类都有利用interface