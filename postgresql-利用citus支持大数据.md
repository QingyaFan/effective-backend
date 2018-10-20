# PostgreSQL 利用 citus 支持大数据

Citus要求主键和外键包含`Distribution Column`

Being an extension of PostgreSQL, Citus supports bulk loading with the COPY command.

Here’s the good news: once you have made the slight schema modification outlined earlier, your application can scale with very little work. You’ll just connect the app to Citus and let the database take care of keeping the queries fast and the data safe.

## 数据分布

数据量： 122608100 个多边形
点数量： 737946357 个顶点

五台机器，一台主节点，四台worker节点，恢复数据耗时7分钟，每个节点 9.1 G 数据。

这些数据恢复到一台单主机的 PostgreSQL 数据库数据量是，耗时 55分钟，28 G 数据

## 处理时间

insert into buffer_result (id, the_geom) select id, st_buffer(the_geom_webmercator, 6) as the_geom from usbuildings;

citus集群，56分钟
单机，120分钟

数据 the_geom_webmercator 建 gist 索引，58 秒

## 充分利用各个worker硬件资源

- shared_buffers，总内存的 10%，有的说 25% ~ 40%
- work_mem，实际 RAM 的 2% – 4%
- FSYNC vs ASYNC， fsync -> off

## 流程及瓶颈

得到buffer任务 -> 分任务 -> master节点汇总任务结果（磁盘结果会不断变大，一直到完成任务，worker节点任务已经完成，master节点还在汇总处理） -> 将结果存储到各个 worker节点

master磁盘 -> SSD
worker磁盘性能
master节点需要磁盘稍大

## 测试性能

测试项：

- 缓冲区
- 聚合点

### 缓冲区

### 聚合点