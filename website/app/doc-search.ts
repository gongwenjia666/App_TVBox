import { configFieldGroups } from "./config-fields.ts";
import { methods, networkMethods, objectGroups, resultFields, liveDanmakuFields } from "./spider-fields.ts";
import { features } from "./feature-content.ts";
import { playbackProperties, playbackCommandGroups } from "./playback-commands.ts";
import {
  localActions,
  localRemoteControls,
  localRemoteFields,
  localMediaFields,
  localDeviceFields,
  localTransferEndpoints,
} from "./local-api.ts";

type Entry = {
  title: string;
  description: string;
  href: string;
  keywords?: string;
  names?: string[];
};

function networkNames(...methods: string[]) {
  return methods.flatMap((method) => [method, `net.${method}`, `self.net.${method}`]);
}

const entries: Entry[] = [
  {
    title: "爬虫加载方式",
    description: "Java JAR、Python、QuickJS 的 api 写法",
    href: "/spider#start",
    names: ["catvod-api.jar", ":apiJar", "compileOnly", "catvod", "Spider"],
    keywords: "SDK 运行接口 import export default class extends Spider JavaScript 迁移",
  },
  {
    title: "三语言 Demo",
    description: "Java、Python、QuickJS 范例",
    href: "/spider#demo",
    names: ["Class", "Vod", "self.page", "page", "Response", "Response.page", "com.github.catvod.bean", "detailContent", "playerContent"],
    keywords: "CatVodSpider examples/python/spider.py examples/javascript/spider.js Demo.java 分页",
  },
  {
    title: "爬虫共用网络",
    description: "Java、Python、QuickJS 的 HTTP、串流、Cookie、缓存与下载",
    href: "/spider#network",
    names: [...networkNames("req", "json", "getUserAgent", "getCookie", "setCookie", "session", "batch", "map", "download", "sleep"), "net.get", "net.post"],
    keywords: networkMethods.flat().join(" ") + " self.net stale persist 二进位 POST Content-Type 原始正文 字节数组",
  },
  {
    title: "运行 JavaScript",
    description: "三语言使用隔离环境运行短段脚本",
    href: "/spider#scripts",
    names: ["js.eval", "self.js.eval"],
    keywords: "Java Python QuickJS JavaScript 脚本 隔离 globals timeout md5X 逾时 取消 JSON",
  },
  {
    title: "串流读取与代理",
    description: "分块读取、原样转送与产生器正文的回传、关闭及取消规则",
    href: "/spider#streams",
    names: [...networkNames("openStream", "stream"), "requestStreamAsync", "net.requestStreamAsync", "Net.StreamResult", "InputStream"],
    keywords: "Java Python QuickJS generator asyncGenerator proxy_body 分块 串流 EOF 取消 timeout callTimeout",
  },
  {
    title: "爬虫 WebSocket",
    description: "一次交换、持续收讯、心跳与断线恢复",
    href: "/spider#websocket",
    names: [...networkNames("ws", "connect"), "socket.send", "socket.close", "socket.cancel"],
    keywords: "Java Python QuickJS reconnect idle ping callback open message retry error close",
  },
  {
    title: "爬虫 TTL 缓存",
    description: "按站点缓存 JSON、背景更新与清除",
    href: "/spider#cache",
    names: networkNames("cached", "cachedText", "peek", "refresh", "clearCache"),
    keywords: "Java Python QuickJS ttl stale persist loader cachedText TTL 缓存",
  },
  {
    title: "爬虫即时弹幕",
    description: "即时来源、弹幕颜色、字级、位置与渐层",
    href: "/spider#live-danmaku",
    names: ["danmakuUrl", "danmaku(id, emit)", "emit.accept", ...liveDanmakuFields.map((field) => field.name)],
    keywords: "Java Python QuickJS WebSocket net.connect 停止函数 AutoCloseable state msg connecting ready retrying error 订阅状态 " + liveDanmakuFields.map((field) => field.description).join(" "),
  },
  {
    title: "Node.js 加载",
    description: "index.js.md5、bundle 与 HTTP 站点路由",
    href: "/spider#node",
  },
  {
    title: "安装爬虫运行模块",
    description: "Python、QuickJS-NG、Node.js 独立 runtime APK 的安装、更新与测试",
    href: "/spider#modules",
    names: ["runtime APK", "QuickJS-NG", "模块安装"],
    keywords: "模块 缺少 不兼容 ABI 重新启动 Thunder mpv BD-J",
  },
  {
    title: "爬虫编辑与测试",
    description: "加载 Java JAR、Python 或 QuickJS，保存、格式化、重测与版本还原",
    href: "/spider#testing",
    names: ["/spider.html", "爬虫测试", "格式化", "重测"],
    keywords: "ext JSON 参数 方法 homeContent categoryContent detailContent playerContent searchContent params 网络纪录 上传 来源 版本 播放结果 Java 编译",
  },
  {
    title: "Android UI",
    description: "三语言 Dialog、QR Code、表单与 Android 接口",
    href: "/spider#runtime",
    names: ["com.github.catvod.Runtime", "Runtime.context", "Runtime.activity", "Runtime.toast", "getActivity", "self.getActivity", "dialog", "this.dialog", "self.dialog", "Dialog.Callback", "callback", "button", "image", "helperText", "cancelable", "enabled", "multiselect"],
    keywords: "Application Context Activity Toast Dialog Java Python QuickJS JSONObject dict 同步 回呼 工作线程 Promise await 方向键 焦点 遥控器 image data URI base64 图片 helperText 字段说明 连续对话框 多步骤 qrcode copyable QR Code 二维码 扫码 更新 重新取得 文本 拷贝 textarea select multiselect options label 多行 单选 多选 勾选 下拉 cancelable enabled 停用 inputs buttons values 字段更新 带入 重设 清空 close validate required minLength maxLength minItems maxItems label errors 通用表单 异步 字段验证 手机 登录 验证码 主线程 jclass com.github.catvod.spider.Init",
  },
  {
    title: "爬虫 Local 设置",
    description: "按站点隔离的 JSON 设置读写与删除",
    href: "/spider#cache",
    names: ["self.local", "local.get", "local.set", "local.delete"],
    keywords: "Java Python QuickJS get set delete JSON 本地保存",
  },
  {
    title: "演员与分类超链接",
    description: "用共用 link 格式连到分类与筛选",
    href: "/spider#objects",
    names: ["self.link", "link", "Json.link"],
    keywords: "vod_actor 演员 id name type_flag filter",
  },
  {
    title: "完整配置范例",
    description: "点播与直播的配置起点",
    href: "/config#examples",
  },
  {
    title: "方法与调用时机",
    description: "初始化、首页、分类、搜索、详情、播放与代理",
    href: "/spider#lifecycle",
    names: methods.flatMap(([name]) => name.split(" / ")),
    keywords: methods.flat().join(" "),
  },
  {
    title: "直播回看",
    description: "timeshift 回看范围、依时间取源与回到直播",
    href: "/spider#timeshift",
    names: ["timeshift", "Channel.timeshift"],
    keywords: "url start window time Unix 毫秒 直播 时间轴 拖曳 回看 直播点",
  },
  {
    title: "节目回看 Catchup",
    description: "从节目表选取回看，依节目起讫时间取得来源",
    href: "/config#catchup",
    names: ["catchup", "Live.catchup", "Channel.catchup"],
    keywords: "直播 EPG 节目表 回看 追看 时移 source replace days",
  },
  {
    title: "片段跳过",
    description: "playerContent 的片头、片中、片尾 skips 区间与毫秒规则",
    href: "/spider#skips",
    names: ["skips", "SkipSegment"],
    keywords: "opening middle ending start end 片头片尾 片中跳过 自动 手动 关闭",
  },
  {
    title: "开网页与登录",
    description: "action 回应的 web JSON、独立窗口与多组 Cookie",
    href: "/spider#web",
    names: ["web", "action"],
    keywords: "Java Python QuickJS JAR Node.js JSON url mode view browser keys cookie 登录 全屏幕 返回",
  },
  {
    title: "Result 回传字段",
    description: "探索与播放数据、标头、字幕、起点及解析参数",
    href: "/spider#result",
    names: resultFields.map((field) => field.name),
    keywords: resultFields
      .map((field) => `${field.name} ${field.type} ${field.description}`)
      .join(" "),
  },
  {
    title: "指定播放",
    description: "vod_play_id 的 ID、集名与集数匹配",
    href: "/spider#episode-selection",
    names: ["vod_play_id", "playId"],
    keywords: "官方历史 官方观看历史 观看纪录 看到第4集 第4集 第04集 EP04 续播 进度 folder",
  },
  ...objectGroups.map((group) => ({
    title: `${group.name} 数据对象`,
    description: group.fields
      .slice(0, 3)
      .map(([name]) => name)
      .join("、"),
    href: "/spider#objects",
    names: group.fields.flatMap(([name]) => name.split(" / ")),
    keywords: group.fields.flat().join(" "),
  })),
  ...configFieldGroups.map((group) => ({
    title: `${group.label} 配置字段`,
    description:
      group.fields
        .slice(0, 4)
        .map((field) => field.name)
        .join("、") + " 等字段",
    href: group.href,
    names: group.fields.map((field) => field.name),
    keywords: group.fields
      .map(
        (field) =>
          `${field.name} ${field.type} ${field.description} ${field.default ?? ""}`,
      )
      .join(" "),
  })),
  {
    title: "直播列表格式",
    description: "JSON、M3U、TXT、EXTINF、genre 与节目表",
    href: "/config#formats",
  },
  {
    title: "播放分组与集数",
    description: "vod_play_from、vod_play_url 与分隔符号",
    href: "/spider#episodes",
  },
  {
    title: "Proxy 回传",
    description: "proxyUrl 参数、proxy 回传与站点路由",
    names: ["proxyUrl", "proxy"],
    href: "/spider#proxy",
    keywords: "字符串键值 null None 空参数 local 本机 局域网路 do siteKey 状态码 Content-Type 内容 标头",
  },
  {
    title: "本地 HTTP API",
    description: "9978–9998、局域网路连接、表单与回应格式",
    href: "/local#connection",
    names: ["LOCAL.md"],
    keywords: "LOCAL.md localhost NanoHTTPD",
  },
  {
    title: "播放详情更新与预载",
    description: "播放详情、episode 合并与预载套用时机",
    href: "/spider#playback-details",
    names: ["playerContent", "play", "list[0]"],
    keywords: "playerContent play vod_name vod_pic vod_content vod_actor vod_director vod_play_url list episode 完整 增量 预载 预加载 详情更新",
  },
  {
    title: "本地动作指令 /action",
    description: "播放控制、推送、搜索、配置、字幕与弹幕",
    href: "/local#action",
    names: ["/action"],
    keywords:
      localActions.flat().join(" ") +
      " " +
      localActions.map(([name]) => `do=${name}`).join(" "),
  },
  {
    title: "设备同步 do=sync",
    description: "history、keep、Config 对象、targets、mode 与 force",
    href: "/local#sync",
    names: ["do=sync", "targets", "configs"],
  },
  {
    title: "网页播放遥控 /remote",
    description: "视频封面、拖曳跳转、倍速、切换项目与单集循环",
    href: "/local#remote",
    names: ["/remote", "/remote/artwork", "artwork", "repeat_on", "repeat_off", "repeatOne", "seek", "canSeek", "canSetSpeed", "speed", "?tab=play"],
    keywords: localRemoteControls.flat().join(" ") + " " + localRemoteFields
      .map(({ name, description }) => `${name} ${description}`)
      .join(" "),
  },
  {
    title: "网页分页网址",
    description: "搜索、推送、播放、字幕、弹幕、设置及文件的语意网址",
    href: "/local#navigation",
    names: ["?tab=search", "?tab=push", "?tab=subtitles", "?tab=danmaku", "?tab=settings", "?tab=files"],
    keywords: "QR Code 数字分页 path 目录 返回",
  },
  {
    title: "独立遥控器与按键 API",
    description: "方向、确认、返回、菜单、数字键与长按",
    href: "/local#remote-keys",
    names: ["/remote.html", "/remote/key", "数字键", "长按", "holding"],
    keywords: "up down left right ok back menu 前景 焦点 遥控器 action press repeat cancel id",
  },
  {
    title: "字幕上传与弹幕套用",
    description: "用目前 mediaKey 套用设备字幕档、弹幕档或弹幕网址",
    href: "/local#remote-media",
    names: ["/remote/subtitle", "/remote/danmaku", "mediaKey"],
    keywords: "SRT SSA ASS XML 字幕上传 409 换片 key path",
  },
  {
    title: "网页设备信息",
    description: "点连接状态查看版本、设备、Android、SDK 与 ABI",
    href: "/local#remote-info",
    names: ["/remote/info", "连接状态"],
    keywords: "variant buildType versionCode 脱机 设备信息",
  },
  {
    title: "日志下载与分享",
    description: "下载或分享日志，含设备信息、播放摘要与完整播放网址",
    href: "/local#logs",
    names: ["/logs.html", "/log/info", "playback.url", "collection", "playbackLog", "lastPlaybackError", "下载日志", "分享日志", "日志信息 API", "取得日志信息", "重新读取信息"],
    keywords: "应用日志 logcat 日志信息 日志文本档 纯文本 UTF-8 诊断数据 原始日志 512 KiB query 参数 导出时间 状态采样时间 日志笔数 缺漏 设备命名 别名 循环播放",
  },
  {
    title: "播放状态 /media",
    description: "播放状态码、位置、速率、媒体信息与 JSON 回应",
    href: "/local#media",
    names: ["/media"],
    keywords: localMediaFields
      .map(({ name, description }) => `${name} ${description}`)
      .join(" "),
  },
  {
    title: "设备信息 /device",
    description: "电视与手机类型、服务地址、uuid 与 App 启动时间",
    href: "/local#device",
    names: ["/device", "uuid"],
    keywords: localDeviceFields
      .map(({ name, description }) => `${name} ${description}`)
      .join(" "),
  },
  {
    title: "本地文件与上传",
    description: "浏览、上传、新建、重命名、搬移与删除；Range 与 ETag",
    href: "/local#files",
    names: ["/file", "/upload", "/newFolder", "/rename", "/move", "/delFile", "/delFolder"],
    keywords: "重命名 搬移 批量操作",
  },
  {
    title: "分块续传与设备下载",
    description: "SHA-256 分块上传，与 App 设备端下载的暂停、继续及任务状态",
    href: "/local#transfers",
    names: [...localTransferEndpoints.map(([path]) => path), "续传", "设备下载", "sha256", "revision"],
    keywords: localTransferEndpoints.flat().join(" ") + " chunkSize chunks threads offset completed failed speed",
  },
  {
    title: "本地缓存 /cache",
    description: "do=get、do=set、do=del、rule 与 key 命名空间",
    href: "/local#cache",
    names: ["/cache"],
  },
  {
    title: "本地代理与内部端点",
    description: "/proxy /parse /image /tvbus 与 App 内置控制页",
    href: "/local#internal",
    names: ["/proxy", "/parse", "/image", "/tvbus"],
  },
  {
    title: "播放指令",
    description: "依播放、音量、音轨、字幕、跳转与画面功能查找指令",
    href: "/commands#start",
    names: ["Exo", "mpv"],
    keywords: "播放指令 按钮 Lua 脚本 mp.commandv 添加",
  },
  {
    title: "cycle-values 轮流切换",
    description: "倍速、音量、延迟、循环、缩放与视频比例的顺序及反向切换",
    href: "/commands#cycle-values",
    names: ["cycle-values", "!reverse"],
    keywords: "set add cycle pause 轮切 回绕 下一个 数值",
  },
  {
    title: "seek 跳转位置",
    description: "相对、绝对、百分比与视频结束前的位置",
    href: "/commands#seek",
    names: ["seek", "absolute", "relative", "absolute-percent", "relative-percent"],
    keywords: "快转 倒退 跳转 秒 百分比 片长",
  },
  {
    title: "音轨切换",
    description: "Exo、mpv 的音轨循环、指定、关闭与自动选轨指令",
    href: "/commands#track-selection",
    names: ["aid", "audio", "cycle aid", "cycle audio", "set aid", "set audio", "cycle-values aid", "cycle-values audio"],
    keywords: "音轨 上一轨 下一轨 关闭音频 自动选轨 no auto up down 反向 ID",
  },
  ...playbackCommandGroups.map((group) => ({
    title: `${group.title}指令`,
    description: `${group.support}：${group.description}`,
    href: `/commands#${group.id}`,
    names: [group.title, ...group.commands.map(([, command]) => command)],
    keywords: group.commands.map(([title]) => title).join(" "),
  })),
  ...playbackProperties.map((property) => ({
    title: `${property.name} 播放指令`,
    description: property.description,
    href: `/commands#${property.name}`,
    names: [property.name, ...property.modes.map((mode) => `${mode} ${property.name}`)],
    keywords: property.values,
  })),
  ...features.map(([title, meta, copy, id]) => ({
    title,
    description: meta,
    href: id ? `/features#${id}` : "/features",
    keywords: copy,
  })),
];

const index = entries.map((entry) => ({
  entry,
  text: [entry.title, entry.description, entry.keywords ?? "", ...(entry.names ?? [])]
    .join(" ")
    .toLowerCase(),
  names: entry.names?.map((name) => name.toLowerCase()) ?? [],
}));

export function searchDocumentation(query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return entries.slice(0, 4);
  return index
    .filter(({ text }) => text.includes(value))
    .sort(
      (a, b) =>
        Number(b.names.includes(value)) - Number(a.names.includes(value)),
    )
    .slice(0, 6)
    .map(({ entry }) => entry);
}
