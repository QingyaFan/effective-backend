# PostgreSQL并行查询

有的查询支持并行查询，有的不支持。

支持的当中，一般性能会在2倍以上，有的会有超过4倍的提升，涉及大量数据但是返回很少行的查询性能提升最明显。

## 调整

max_worker_processes

max_parallel_workers

max_parallel_workers_per_gather

max_parallel_maintenance_workers