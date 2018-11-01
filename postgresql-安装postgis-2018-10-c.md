# Postgresql/PostGIS安装

centos 7.4

## 一、安装postgresql

### 1.1 安装源

在`https://yum.postgresql.org/repopackages.php`找到合适的rpm版本，然后`yum install xx.rpm`，例如我装10：

```lang=bash
yum install https://download.postgresql.org/pub/repos/yum/10/redhat/rhel-7-x86_64/pgdg-centos10-10-2.noarch.rpm
```

### 1.2 然后`yum list postgresql*`查看所有可以安装的postgresql版本，然后安装相应的版本。

`yum install -y postgresql10-server.x86_64`

### 1.3 装完会有以下目录，需要初始化数据库：

/var/lib/pgsql/10/: backups data
/usr/pgsql-10/: bin lib share

`/usr/pgsql-10/bin/postgresql-10-setup initdb`

### 1.4 启动

```lang=bash
systemctl enable postgresql-10.service
systemctl start postgresql-10.service
```

1.5 创建用户，创建数据库

```lang=bash
su - postgres
psql
```

```lang=sql
CREATE ROLE xxx WITH LOGIN CREATEDB CREATEROLE REPLICATION SUPERUSER PASSWORD 'pass';
CREATE DATABASE "test" OWNER xxx;
```

但是使用新用户登录，会有 `psql: FATAL: Peer authentication failed for user "xxx"`

在`var/lib/pgsql/10/data/pg_hba.conf`中为`xxx`添加一个规则：

`localhost all xxx md5` 或 `localhost all xxx trust`

## 二、给数据库安装扩展

### 2.1 postgis

`yum list postgis*`

```sh
yum install postgis24_10.x86_64
psql -U xxx -d dbname -c "create extension postgis;"
psql -U xxx -d dbname -c "create extension postgis_topology;"
```

### 2.2 pgrouting

`yum list pgrouting*`
`yum install pgrouting_10.x86_64`
`psql -U xxx -d dbname -c "create extension pgrouting;"`

## 三、灌数据

shapefile -> postgres

安装了postgis，会安装`shp2pgsql`和`pgsql2shp`，我们借助这两个功能实现postgis和shapefile互转，但是要使用这两个工具，还需要安装

`postgis24_10-client.x86_64`
`postgis24_10-utils.x86_64`

否则这两个工具只是一个链接，并没有可执行文件。

导入命令：

`shp2pgsql -s 4326 shp_file_name schema.table | psql -U xxx -d db_name`

## 四、可用的工具

查看`/usr/bin`，会发现postgresql/postgis安装了几个工具：

shp2pgsql，
pgsql2shp，
vacuumdb，
reindexdb，
pg_dumpall，
pg_restore，
pg_dump，
pg_basebackup，
dropuser，
createuser，
dropdb，
createdb，
clusterdb，
psql，

## 优化参数

shared_buffers
work_mem
fsync = off

max_worker_processes = 64
max_parallel_workers_per_gather = 32
max_parallel_workers = 64