# 使用OGR2OGR转换地理数据进入PostGIS

## 转换字段名称

## 转换数据字段类型

ogr支持的数据类型有：

- character
- float
- numberic
- integer
- date
- time
- timestamp

使用`COLUMN_TYPES`参数可以指定数据类型转换列表，不同字段使用逗号分隔。例如我要将一个shapefile导入PostGIS中，更改原为int类型的`column1`为float，那么命令可以这么写：

```sh
ogr2ogr -f "Postgresql" PG:"host=localhost port=5432 dbname=test user=user password=pass" -lco COLUMN_TYPES="column1=float" file.shp
```

如果字段的原始类型不能转换成指定的类型，会报错。