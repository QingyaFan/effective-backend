# Golang环境设置

## go get

go get总是出错，假如你安装了shadowsocks，在Windows的cmder中设置代理的环境变量即可：

```sh
set http_proxy=socks5://127.0.0.1:1086
set https_proxy=socks5://127.0.0.1:1086
```

Mac上：

```sh
export http_proxy=socks5://127.0.0.1:1086
export https_proxy=socks5://127.0.0.1:1086
```

再一个就是Windows系统下需要设置GOBIN和GOPATH环境变量，Mac不需要设置：

```
GOPATH=C:\Users\xxx\go
GOBIN=C:\Users\xxx\go\bin
```