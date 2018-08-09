# Git使用中的小技巧

## 线上仓库覆盖本地仓库

某些时刻，你在本地的仓库分支做了很多更改，或者搞乱了，想直接回到与线上仓库相同的初始状态，你可以执行：

```sh
git fetch --all
git reset --hard origin/branch_name
```