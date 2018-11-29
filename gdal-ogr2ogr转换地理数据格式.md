# GDAL - 地理数据导入PostgreSQL

## 转换字段名称

可通过`-sql`转换导入PostgreSQL的字段名称，我们可以将原始数据看成是数据库中的一张表，`-sql`参数指定了一个标准的sql语句，该语句执行的结果会被保存到结果数据中。整个过程可以类比PostgreSQL中的`create table as select ...`语句。

## 转换数据字段类型

不同于PostgreSQL中的数据类型，ogr有一套自己的数据类型系统：

- character，对应PostgreSQL中的`Character Types`；
- float，对应PostgreSQL中的`double precision`；
- numeric，可自定义精度的数值类型，可对应PostgreSQL中的`numeric`；
- integer，对应PostgreSQL中的`integer`；
- date，对应PostgreSQL中的`date`；
- time，对应PostgreSQL中的`time`；
- timestamp，对应PostgreSQL中的`timestamp`。

使用`COLUMN_TYPES`参数可以指定数据类型转换列表，不同字段使用逗号分隔。例如我要将一个shapefile导入PostgreSQL中，更改原为int类型的`column1`为float，那么命令可以这么写：

```sh
ogr2ogr -f "Postgresql" PG:"host=localhost port=5432 dbname=test user=user password=pass" -lco COLUMN_TYPES="column1=float" file.shp
```

如果字段的原始类型不能转换成指定的类型，会报错。

## 添加转换进度

ogr2ogr使用`-progress`可以获得粗略的进度信息，每2.5%就会输出一次进度。