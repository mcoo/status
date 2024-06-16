<div align="center">
    <h1 style="margin: 10px">
        <a href="https://status.mcenjoy.cn/" target="_blank">STATUS</a>
    </h1>
    <p>一个简单的监控站   Serverless · 开源 · 轻量</p>
</div>

<br />
<br />

[demo](https://status.mcenjoy.cn)

## 简单一个原理图
![](https://img.mcenjoy.cn/1d4630b1a8a008e59392883bf60667f7.png)

## 需要准备的东西

1. Cloudflare 账号
2. 最少一台需要监控的服务器
3. 服务器安装好 Docker


## 教程开始

### 下载项目
请前往 [release](https://github.com/mcoo/status/releases) 自行下载
### 新建 Cloudflare KV
![](https://img.mcenjoy.cn/9bdac21372d9b809f0676a088fde9bf4.png)
这里需要设置两个值：
- `backup` 设置为 `{}`
- `errors` 设置为 `[]`
### 新建 Cloudlfare Worker 
设置环境变量，请设置到 `制作` 里面，不要搞到 `预览` 中
![](https://img.mcenjoy.cn/de86b2f94d988b3287d2ff285dc97695.png)

|变量名称|说明|
|-|-|
|BACKUP_HTTP_TOKEN|回调备份结果时用于鉴权|
|TOKEN|Uptimebot的API token 【readonly就行】|
|INFO|自定义的一些信息，看下方|

INFO的一个例子：
```json
{
	"name": "Enjoy",
	"rtl": true,
	"avatar": "https://cdn.linux.do/user_avatar/linux.do/mcenjoy/288/80800_2.png",
	"desc": "一个喜欢研究的宅，欢迎各位大佬交流。<br /><a style='--n-text-color: #63e2b7; --n-bezier: cubic-bezier(.4, 0, .2, 1);' href='https://linux.do/u/mcenjoy/summary' class='n-a'>@mcenjoy [LINUX.DO]</a><br /><a class='n-a' style='--n-text-color: #63e2b7; --n-bezier: cubic-bezier(.4, 0, .2, 1);' href='https://www.nodeseek.com/space/15759'>@mcenjoy [NS]</a>"
}
```
rtl为下方状态条由右向左显示
![](https://img.mcenjoy.cn/b49cffe1f17d43fecd89f093fdf6d98c.png)
然后绑定第二步的KV 设置名称为 `STATUS`
### 安装配置 duplicati 【这里若不需要监控备份的状态可以跳过本步骤】
这里用的 docker-compose，端口反代什么的需要自行设置，网上应该有，不行问问GPT
```yml
  backup:
    image: lscr.io/linuxserver/duplicati:latest
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
      - CLI_ARGS= #optional
    volumes:
      - ./duplicati/config:/config # 存放duplicat的i配置文件
      - ./duplicati/backups:/backups
      - ../app:/source
    restart: unless-stopped
```
配置完备份任务后，设置>默认选项>以文本形式编辑，注意配置你自己的`URL`和`BACKUP_HTTP_TOKEN`
![](https://img.mcenjoy.cn/6bf944e763273e79fa3d93ed853f440c.png)
```
--send-http-level=All
--send-http-url=https://status.mcenjoy.cn/api/backup?token=<BACKUP_HTTP_TOKEN>
--send-http-verb=POST
--send-http-result-output-format=Json
```
## Uptimerobot 配置
1. [API申请](https://old.uptimerobot.com/dashboard)
2. 监控名称配置
![](https://img.mcenjoy.cn/df78edae3e876a8bce8b9785a3f399d3.png)

举个例子`监控站${国家:us}${标签:info|Cloudflare Worker}${类别:应用}`
- 最后展示在页面上的名称是排除所有`${}`的内容，也就是`监控站`
- `${国家:us}`为配置前面的国家标识 [国家列表](https://flagicons.lipis.dev/)
- `${标签:info|Cloudflare Worker}`显示在下面的标签
- `${类别:应用}`可自行配置类别
## 感谢
- [TOV](https://github.com/dishait/tov-template) 减少很多工作量
- [uptime-status](https://github.com/yb/uptime-status) 感谢前人



## License

Published under [MIT License](./LICENSE).

