# PHP Web项目中使用Laravel

## composer.lock

使用composer管理依赖，执行`composer install`时，会根据当前目录下`composer.json`安装项目依赖，并将依赖树及其版本写入`composer.lock`，将该文件放入Git仓库，能保证所有一起开发该项目的人安装的依赖一致。需要注意，`composer.lock`还规定了使用PHP的版本。

最近安装Laravel 5.4，写明的依赖是PHP 5.6，本地使用composer初始化了Laravel项目，推送到Git仓库，CI服务器上构建却出了问题，CI服务器上的PHP版本是5.6，调试信息显示某些包依赖PHP 7。打开`composer.lock`发现有的包的PHP依赖版本是7，检查初始化项目时本机的PHP版本是7.1，所以本机使用PHP5.6重新初始化Laravel5.4项目，问题得以解决。

需要提到一点，并不只是`composer.lock`中有PHP版本依赖，因为有尝试删除原有lock文件，重新install依赖，并不行。