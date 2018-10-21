# PostgreSQL 利用 citus 支持大数据

`Citus`本质上是一个PostgreSQL分表扩展，之前有一个类似的扩展叫做`pg_shard`，用于水平分表，现在官网也是推荐使用Citus代替，Citus整合了`pg_shard`功能，将数据分布式存储，并对查询在多个节点并行执行，加快查询效率。

## 优点

1. 能够始终使用最新的PostgreSQL，因为像PostGIS一样，Citus是PostgreSQL的一个扩展，这一点上比同类GreenPalm好。

2. Citus的分表逻辑在数据库中实现，所以无需更改应用逻辑，可以直接接入带有Citus扩展的数据库集群。

3. 支持扩展到100K+ worker node，每个worker互相隔离，保证性能，而且有`reference table`的概念，减少数据冗余。

4. 并行执行查询，且性能随着节点数量增加线性增加。

这些优点也反映了Citus适合做什么：适合具有单节点不能hold主的大量数据，且不断增长；实时分析应用，支持多用户。

同样，Citus的结构也决定了一些类型的应用不适合使用Citus：

1. 不需要分布式存储大量数据
2. worker之间需要进行大量数据传输和协作，因为并行执行的结果之间的整合需要大量的IO，反而会抵消并行执行节省的时间

## 测试

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