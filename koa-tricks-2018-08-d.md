# Koa使用技巧

## koa-router使用`*`作为`wildcard`，而不是`/`，nginx是使用`/`作为`wildcard`

## nginx + koa-router + vue-router

nginx配置`/`，如果无匹配项，默认跳转到`vue-router`的某个组件，可以做如下配置：

```sh
nginx(`/`) => koa-router(`*`) => vue-router
```