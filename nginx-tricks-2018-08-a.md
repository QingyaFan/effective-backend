# Nginx一些小技巧

nginx在主机上启动一个主线程和多个子线程，子线程的数量可以设置，默认为CPU的core数量。主线程管理配置和子线程，每个子线程复杂处理请求。查看CPU数量和nginx线程的方法：

linux:

```sh
lscpu
ps aux | grep nginx
```

mac:

```sh
sysctl -n hw.ncpu
ps aux | grep nginx
```

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

## `nginx: [emerg] zero size shared memory zone "allips"`

因为有的虚拟目录定义了`limit_req`，限制了并发连接数，去掉即可。

## location 正则匹配

比如，`/s/data`配置到一个指定的地址，`/s/data/{uuid}/query`到另一个地址，同时query后面还有一些get参数，所以我们应该做如下配置：

```lang=text
location ~ /s/data/([a-z0-9]+)/query?$args
```

## server_name

`server`块中的`server_name`类似于`apache httpd server`中的`vhost`，匹配顺序： 完全匹配 > 通配符开始的字符串 > 通配符结束的字符串 > 正则表达式

## 调试nginx

开源Linux发行版的nginx不支持debug，需要重新编译`--with-debug`

## curl: connection reset by peer

nginx启动后，使用`curl`访问nginx反向代理的服务，出现`connection reset by peer`，则表明nginx没有正常启动，查看日志，检查配置，修正错误。

## 所有服务都 502

犯了一个小错误，在docker中的nginx配置文件中，每个location中的proxy_pass都配置的是其他的容器名称来互相访问，这些名字并没有使用upstream定义，结果都出现了502。具体情况如下：

```conf
# 其中 container_name_1 是其他容器的名称
location /svc1/ {
    proxy_pass http://container_name_1/scv1/;
}
```

这样是行不通的，location中的proxy_pass不带解析功能，必须定义一个upstream来做解析，修改如下即可：

```conf
upstream container_name_1 {
    server container_name_1:port;
}

server {
    ...
    location /svc1/ {
        proxy_pass http://container_name_1/scv1/;
    }
}
```

或者

在 compose 文件中nginx定义处添加 `external_links`来添加可以访问的其他容器应用，这样docker会在nginx容器启动时在容器的`/etc/hosts`添加条目`container_name ip`的映射，这样，即使nginx不做解析，也可以利用`/etc/hosts`来做解析。

## nginx添加backslash去掉了port，怎么破？