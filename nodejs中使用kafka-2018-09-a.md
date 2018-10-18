# 在nodejs中作为消费者使用kafka

## npm包

`kafka-node`

## 测试

在nodejs中使用kafka

- 列出所有分区（partition）

kafka-consumer-groups.sh --describe --group geohey-vector-consumer --bootstrap-server localhost:9092

- 列出所有topic

kafka-console-producer.sh --broker-list localhost:9092 --topic topic-geohey-vector-import