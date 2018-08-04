# NFS

NFS是网络文件系统，用于在多个主机之间进行文件共享。

> 注：如果是docker需要挂载nfs，那么宿主机要像其它虚拟机一样安装nfs客户端，docker容器才能正常挂载。

## 一、核心概念

## 二、安装配置

### 2.1 CentOS配置

`yum install nfs-utils`
`systemctl start rpcbind`
`systemctl start nfs`
`systemctl start nfslock`
`chkconfig rpcbind on`
`chkconfig nfs on`
`chkconfig nfslock on`

### 2.2 NFS配置文件与命令

- 配置文件，`/etc/exports`

```txt
var/geohey/data/postgres       *(rw,no_root_squash)
/var/geohey/data/redis  *(rw,no_root_squash)
/var/geohey/data/file_upload_dir        *(rw,no_root_squash)
/var/geohey/data/file_download_dir      *(rw,no_root_squash)
/var/geohey/data/geocoding      *(rw,no_root_squash)
/var/geohey/data/mapping        *(rw,no_root_squash)
/var/geohey/data/routing        *(rw,no_root_squash)
/var/geohey/data/seaweedfs      *(rw,no_root_squash)
```

更改完成后，重启nfs即可生效。

### 2.3 日志信息

`tail -f /var/log/messages`

### 2.4 查看NFS服务器的共享文件

`showmount -e ip`

### 2.5 权限设置（重要）

可以暂时将分享目录设置为`777`，其实这里应该考虑更好的方法，实现更好的安全性

### 2.6 客户端配置

`yum install nfs-utils`
`systemctl start rpcbind`
`systemctl start nfslock`
`sudo mount -t nfs serverIp:/share/path /local/mount/path`

## 三、/etc/fstab文件