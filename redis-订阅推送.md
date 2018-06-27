# Redis实现订阅与推送

## 后端订阅与推送

Redis维护着很多频道，每个频道可能有多个client订阅，当有信息publish到频道时，Redis会将该信息推送给所有的client。

该方案不能用于浏览器端。

## 浏览器订阅