# Shell

熟练使用Shell会使你效率提升很多，例如

## 批量执行sql文件

所有sql文件放置在`dir`目录下

```sh
for entry in "dir"/*
do
  psql -U username -d dbname -f "$entry"
done
```