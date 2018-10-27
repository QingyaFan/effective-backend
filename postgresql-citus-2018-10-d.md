# PostgreSQL 利用 citus 支持大数据

PostgreSQL的一些极限：

```txt
Maximum size for a database? unlimited (32 TB databases exist)
Maximum size for a table? 32 TB
Maximum size for a row? 400 GB
Maximum size for a field? 1 GB
Maximum number of rows in a table? unlimited
Maximum number of columns in a table? 250-1600 depending on column types
Maximum number of indexes on a table? unlimited
```

使用单节点的PostgreSQL很多情况下是OK的，但32T的表放在一个机器节点上，查找一条记录，扫描一遍索引就要耗时很久。一般的做法是水平和垂直分表。

## WHAT-Citus是什么

`Citus`是一个PostgreSQL扩展，主要作用是水平自动分表，有一个类似扩展`pg_shard`已是deprecation状态，推荐使用Citus。Citus是单coordinator，多worker架构，coordinator统筹协调工作，worker是真正干活的。支持分布式冗余存储，并行查询计算。

三个主要使用场景：

- 数据分布式存储的应用（`Multi-tenant Application`）
- 实时分析（`Real-Time Dashboards`）
- 时间序列数据的查询分析（`Timeseries Data`）

将数据分布式存储，并对查询在多个节点并行执行，加快查询效率。

## WHY-优点

1. 能够始终使用最新的PostgreSQL，因为像PostGIS一样，Citus是PostgreSQL的一个扩展，这一点上比同类GreenPalm好。

2. Citus的分表逻辑在数据库中实现，所以无需更改应用逻辑，可以直接接入带有Citus扩展的数据库集群。

3. 支持扩展到100K+ worker node，每个worker互相隔离，保证性能，而且有`reference table`的概念，减少数据冗余。

4. 并行执行查询，且性能随着节点数量增加线性增加。

这些优点也反映了Citus适合做什么：适合具有单节点不能hold主的大量数据，且不断增长；实时分析应用，支持多用户。

同样，Citus的结构也决定了一些类型的应用不适合使用Citus：

1. 不需要分布式存储大量数据
2. worker之间需要进行大量数据传输和协作，因为并行执行的结果之间的整合需要大量的IO，反而会抵消并行执行节省的时间

> Citus provides distributed functionality by extending PostgreSQL using the hook and extension APIs. This allows users to benefit from the features that come with the rich PostgreSQL ecosystem. These features include, but aren’t limited to, support for a wide range of data types (including semi-structured data types like jsonb and hstore), operators and functions, full text search, and other extensions such as PostGIS and HyperLogLog. Further, proper use of the extension APIs enable compatibility with standard PostgreSQL tools such as pgAdmin and pg_upgrade.

> As Citus is an extension which can be installed on any PostgreSQL instance, you can directly use other extensions such as hstore, hll, or PostGIS with Citus. However, there are two things to keep in mind. First, while including other extensions in shared_preload_libraries, you should make sure that Citus is the first extension. Secondly, you should create the extension on both the coordinator and the workers before starting to use it.

## 集群规划

同等CPU和RAM，原来单节点CPU和RAM等于worker的总和，集群相对于原来一般会有2~3倍的性能提升。主要原因是分表提升了资源利用率，并且索引更小。

> For those migrating to Citus from an existing single-node database instance, we recommend choosing a cluster where the number of worker cores and RAM in total equals that of the original instance. In such scenarios we have seen 2-3x performance improvements because sharding improves resource utilization, allowing smaller indices etc.

coordinator可以配置低一点，计算性能差不多就可以。

## 添加worker

加节点

`select * from master_add_node('ip-or-name', port)`

列出所有节点

`SELECT * FROM master_get_active_worker_nodes();`

*现有的表如果不经过`rebalence`，不会分布到新的worker上，新建的表会分布到新节点。*

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

## TRY

上来就使用Citus方案的很少，一般都是遇到单节点支撑不了的数据和运算，才会想要切换到Citus，所以这里不讲从头开始，讲如何将现有的单节点或者普通集群迁移到Citus需要做的事情。

### 迁移数据

#### 允许服务间断的场景：

首先将原来的数据备份，将一张表由单表调整为distributed，需要在灌数据之前声明，所以我们需要三个步骤：首先备份并恢复表结构，然后声明表为distributed，最后备份并恢复数据，此时数据会分布到各个worker。

- 备份表结构

`pg_dump -Fc --no-owner --schema-only --dbname db_name > db_name_schema.back`

`pg_restore --dbname db_name db_name_schema.back`

- 声明distributed

`select * from create_distributed_table('table_name', 'id')`

- 灌数据

`pg_dump -Fc --no-owner --data-only --dbname db_name > db_name_data.back`

`pg_restore --dbname db_name db_name_data.back`

#### 不允许服务间断

可以使用PostgreSQL的`logical replication`，将在用的老数据库指向Citus主节点，这样新老数据库处于同步状态，然后统一将服务的数据库连接地址切换到Citus。

## 测试性能

a. 写入数据，一般操作

b. pg_bench