<div align="center">
    <h1 style="margin: 10px">
        <a href="https://status.mcenjoy.cn/" target="_blank">STATUS</a>
    </h1>
    <p>一个简单的监控站   Serverless · 开源 · 轻量</p>
</div>

<br />
<br />

[demo](https://status.mcenjoy.cn)

## 需要准备的东西

1. Cloudflare 账号
2. 最少一台需要监控的服务器
3. 服务器安装好 Docker


## 教程开始

### 下载项目
请前往 release 自行下载
### 新建 Cloudflare KV
设置两个值 `backup` 为 `{}`,`errors` 为 `[]`
### 新建 Cloudlfare Worker 
设置环境变量，请设置到 `制作` 里面，不要搞到 `预览` 中

|变量名称|说明|
|-|-|
|BACKUP_HTTP_TOKEN|回调备份结果时用于鉴权|
|TOKEN|Uptimebot的API token 【readonly就行】|
|INFO|自定义的一些信息，不过多介绍了，这里我给个例子 `{"name":"Enjoy","avatar":"https://cdn.linux.do/user_avatar/linux.do/mcenjoy/288/80800_2.png","desc":"一个喜欢研究的宅，欢迎各位大佬交流。<br /><a style='--n-text-color: #18a058; --n-bezier: cubic-bezier(.4, 0, .2, 1);' href='https://linux.do/u/mcenjoy/summary' class='n-a' target='_blank'>@mcenjoy [LINUX.DO]</a><br /><a class='n-a' style='--n-text-color: #18a058; --n-bezier: cubic-bezier(.4, 0, .2, 1);' href='https://www.nodeseek.com/space/15759' target='_blank'>@mcenjoy [NS]</a>"}`

然后绑定第二步的KV 设置名称为 `STATUS`
### 安装配置 duplicati
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
```
--send-http-level=All
--send-http-url=https://status.mcenjoy.cn/api/backup?token=<BACKUP_HTTP_TOKEN>
--send-http-verb=POST
--send-http-result-output-format=Json
```

## 感谢
- [TOV](https://github.com/dishait/tov-template) 减少很多工作量
- [uptime-status](https://github.com/yb/uptime-status) 感谢前人



## License

Published under [MIT License](./LICENSE).

