# Nginx一些小技巧

## nginx用作proxy服务器

作为代理服务器，Nginx可以转发请求，从而解决跨域的问题。例如，不同的端口的访问会被识别为跨域，而路径不会，我们可以把对不同的端口的访问转发为对不同的路径的访问，因此不会有跨域的问题。具体做法是在`server`段配置一个`location`段：

```conf
location /example {
    proxy_pass: localhost:8081;
    proxy_set_header: xxx;
}
```

## nginx负载均衡配置

通过upstream模块

## gRPC

Nginx 1.13.10 原生支持gRPC，和HTTP/2 server push。

## `nginx: [emerg] zero size shared memory zone "allips"`

因为有的虚拟目录定义了`limit_req`，限制了并发连接数，去掉即可。

## 正则匹配用法

比如，`/s/data`配置到一个指定的地址，`/s/data/{uuid}/query`到另一个地址，同时query后面还有一些get参数，所以我们应该做如下配置：

```lang=text
location ~ /s/data/([a-z0-9]+)/query?$args
```