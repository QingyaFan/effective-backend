# git一些经验

## `Git fatal: refusing to merge unrelated histories`

有时候develop和master分支相互独立，当在一个分支merge另一个分支时，就会出现这个问题，我们可以使用：

```sh
# on master branch
git merge develop --allow-unrelated-histories
```