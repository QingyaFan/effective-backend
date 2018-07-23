# PostgreSQL一些使用技巧

## psql免密登录文件配置

psql默认加载home目录的`.pgpass`文件获取登录信息，且其文件权限必须为`u=rw(0600)`或者更严格的访问权限，可以通过`chmod 0600 .pgpass`修改，其内容为

```txt
hostname:port:database:username:password
```

## postgresql的备份与还原

备份：

- pg_dump -U user_name [-n schema_name] [-t table_name] [-Fc] db_name > file_name.dump
- pg_restore -U user_name -d db_name file_name.dump

这种方法备份的文件时压缩文件，还可以保存sql，只需去掉`-Fc`参数，默认copy方式。