# Shell

熟练使用Shell会使你效率提升很多，创建一个shell script，需要给它执行权限，才可以执行： `sudo chmod +x file_name`。

## 批量执行sql文件

所有sql文件放置在`dir`目录下

```sh
for entry in "dir"/*
do
  psql -U username -d dbname -f "$entry"
done
```

## 写文件

export TEST_ENV="example_ip"

### 写一行

echo "http://${TEST_ENV}/" >> test.txt

### 写多行

```sh
echo "
  shell is good
  if you can shell
" >> test_multi_line.txt
```

```sh
cat > test.txt <<EOF
test content
test multi line
EOF
```

## script中远程执行命令

`ssh user@ip cmd`，例如我想在远程直接在远程服务器创建一个目录，并在目录中创建一个文件，写入一些内容，可以如下这样写：

```sh
#!/bin/sh
ssh user@ip "mkdir /var/test && touch /var/test/newFile.txt && echo \"test write\" >> /var/test/newFile.txt"
```

## 检查服务器断开开启情况

`nmap`或者`telnet`都可以检查，mac上可以通过`brew`安装。

nmap: `nmap -Pn host -p port`
telnet: `telnet host port`

## cp & rm

删除文件夹本身： `rm -rf /dir`
删除文件夹内部所有文件及文件夹： `rm -rf /dir/*`
删除文件夹内部文件： `rm -f /dir/*`

> -f 表示不需要询问

拷贝a文件夹内所有文件到文件夹b： `cp -a /a/. /b/`

## zip & unzip

压缩到指定文件： `zip -r name.zip /folder`
解压到指定目录： `unzip name.zip -d dir_name`

## 程序暂停执行

> 摘自Stack Overflow: https://stackoverflow.com/questions/21620406/how-do-i-pause-my-shell-script-for-a-second-before-continuing

```sh
sleep .5 # Waits 0.5 second.
sleep 5  # Waits 5 seconds.
sleep 5s # Waits 5 seconds.
sleep 5m # Waits 5 minutes.
sleep 5h # Waits 5 hours.
sleep 5d # Waits 5 days.
```

## systemd

ubuntu的Service Unit文件在`/lib/systemd/system/`
centos在`/usr/lib/systemd/system/`