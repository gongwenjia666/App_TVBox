# G.影视

Android TV、手机、平板都能用的播放客户端，基于 FongMi/TV 5.9.0 二次打包。包名 `com.g.tvbox`，桌面显示名「G.影视」。

> 本仓库是个人二次打包分发，**非官方版本**，与上游作者无关。上游项目：[FongMi/TV](https://github.com/FongMi/TV)（GPL-3.0）。

在线文档：[G.影视 使用与开发指南](https://gongwenjia666.github.io/App_TVBox/)（爬虫接入、配置字典、本地 API、播放指令）

## 下载

前往 [Releases](../../releases/latest) 页面按机型选择：

| 安装包 | 适用设备 |
| --- | --- |
| `g.tvbox-vX-Y-TV-64.apk` | 电视、盒子，64 位（arm64-v8a） |
| `g.tvbox-vX-Y-TV-32.apk` | 老电视、盒子，32 位（armeabi-v7a） |
| `g.tvbox-vX-Y-Phone-64.apk` | 手机、平板，64 位（arm64-v8a） |

拿不准就先装 TV-64；装上一片空白或闪退的 32 位老设备换 TV-32。

## 与上游包的差异

- 包名 `com.g.tvbox`、显示名「G.影视」、独立签名
- 应用内检查更新：默认每天检查一次，设置页长按版本号可切换频率（每次启动 / 每天 / 每周 / 每月 / 每季度 / 永不）
- 下载前对 gh-proxy.com、ghfast.top、gh-proxy.org、官方直连四条线路测速，取最快的一条
- 模块目录指向国内可访问地址，官方模块可直接安装
- 页面切换动效 850ms

## 功能

- 浏览：分类筛选、跨站搜索、收藏、播放记录、无痕模式
- 播放：倍速、字幕、弹幕、片头片尾跳过、画中画、后台音频
- 直播：分组选台、节目表、频道收藏、线路切换
- 操作：遥控器、手机手势、DLNA 投屏与接收
- 互通：网页遥控、文件传输、记录同步、Android Auto

爬虫开发说明与 Java、Python、QuickJS 示例见 [CatVodSpider](https://github.com/FongMi/CatVodSpider)。

## 安装与升级

1. 首次安装需允许「安装未知来源应用」。
2. 升级直接覆盖安装，数据保留。
3. 与官方 FongMi/TV 可共存（包名不同）。

## 版本号

`v<年>.<月>.<日>_<序号>`，同日递增、跨日重置；versionCode 为 `YYYYMMDD` 加两位序号，例如 `v2026.11.27_2` 对应 `2026112702`。

## 说明

- 本仓库只做打包与小幅修改，不提供任何影视内容或接口源，接口需自行配置。
- 源码版权归上游作者所有，遵循 GPL-3.0 协议。
- 第三方接口源的可用性与播放稳定性由源本身决定。

## Star History

<a href="https://www.star-history.com/?repos=gongwenjia666%2FApp_TVBox&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=gongwenjia666/App_TVBox&amp;type=date&amp;theme=dark" />
    <img alt="App_TVBox Star History" src="https://api.star-history.com/chart?repos=gongwenjia666/App_TVBox&amp;type=date" />
  </picture>
</a>
