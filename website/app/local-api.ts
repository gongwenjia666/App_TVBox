import type { Field } from "./config-fields";

export const localSections = [
  ["connection", "连接与回应"],
  ["action", "动作指令"],
  ["sync", "设备同步"],
  ["remote", "网页播放与遥控器"],
  ["logs", "日志下载与分享"],
  ["media", "播放状态"],
  ["device", "设备信息"],
  ["files", "文件管理"],
  ["transfers", "续传与设备下载"],
  ["cache", "键值缓存"],
  ["internal", "代理与内部端点"],
] as const;

export const localActions = [
  ["control", "type", "控制目前播放器；可用指令见下表。"],
  ["danmaku", "text", "送出一条即时弹幕；需要有效的播放服务与非空文本。"],
  [
    "refresh",
    "type；字幕、弹幕另加 path",
    "刷新页面，或推送字幕及弹幕。",
  ],
  ["push", "url", "把非空 URL 交给 App 推送播放流程。"],
  ["file", "path", "打开设备上的文件；不是上传文件。"],
  ["search", "word", "把非空关键字交给 App 搜索接口。"],
  [
    "setting",
    "text、name（选填）",
    "把配置位置或设置文本交给设置流程；text 不可为空。",
  ],
  [
    "cast",
    "config、device、history",
    "三者均为 JSON 对象字符串，交给 App 投放事件处理。",
  ],
  [
    "sync",
    "type、mode、force 等",
    "交换观看纪录或收藏；参数与数据格式见下节。",
  ],
] as const;

export const localControls = [
  ["play", "播放"],
  ["pause", "暂停"],
  ["stop", "停止"],
  ["prev", "上一项"],
  ["next", "下一项"],
  ["repeat", "切换循环模式"],
  ["replay", "重新播放"],
] as const;

export const localRemoteControls = [
  ["play", "播放；已播完时从头播放。"],
  ["pause", "暂停目前视频。"],
  ["stop", "停止播放。"],
  ["prev", "上一集／上一台；须支持切换项目。"],
  ["next", "下一集／下一台；须支持切换项目。"],
  ["repeat_on", "打开目前视频的单集循环；重复请求仍为打开。"],
  ["repeat_off", "关闭单集循环；重复请求仍为关闭。"],
  ["seek", "跳到 position 指定的毫秒位置；须支持跳转，不改变播放／暂停状态。"],
  ["speed", "以 speed 设置 0.1–5.0 倍速；须支持倍速，直播不可用。"],
] as const;

export const localRemoteFields: Field[] = [
  {
    name: "active",
    type: "boolean",
    description: "是否有可遥控的本机播放；false 时不回传其余字段。",
  },
  {
    name: "title",
    type: "string",
    description: "目前视频的显示标题。",
  },
  {
    name: "mediaKey",
    type: "string",
    description: "目前播放来源的识别键；套用字幕或弹幕时以 key 传回，换片后须重新取得。",
  },
  {
    name: "artwork",
    type: "string",
    description: "目前视频的本机封面端点；没有封面时为空字符串，加载失败时网页显示占位图。仅 /remote 回传此字段。",
  },
  {
    name: "position",
    type: "integer",
    description: "目前播放位置，单位毫秒，最小为 0。",
  },
  {
    name: "duration",
    type: "integer",
    description: "总长，单位毫秒；未知长度为 0。",
  },
  {
    name: "state",
    type: "integer",
    description: "1＝播放结束；2＝就绪但未播放；3＝正在播放；6＝缓冲中。",
  },
  {
    name: "playWhenReady",
    type: "boolean",
    description: "播放器是否设置为播放；视频已播完时为 false。",
  },
  {
    name: "repeatOne",
    type: "boolean",
    description: "目前是否打开单集循环，播完会重新播放同一部视频。",
  },
  {
    name: "live",
    type: "boolean",
    description: "是否为直播；网页隐藏循环开关，API 拒绝循环指令。",
  },
  {
    name: "canNavigate",
    type: "boolean",
    description: "是否支持上一项／下一项。",
  },
  {
    name: "canSeek",
    type: "boolean",
    description: "是否支持网页跳转；支持 timeshift 的直播也可使用，未知长度或不可跳转时为 false。",
  },
  {
    name: "canSetSpeed",
    type: "boolean",
    description: "是否支持倍速；直播或播放器不支持时为 false。",
  },
  {
    name: "speed",
    type: "number",
    description: "目前播放倍速，例如 1 或 1.5。",
  },
  {
    name: "engine",
    type: "string",
    description: "目前播放引擎，ExoPlayer 或 mpv。",
  },
  {
    name: "video",
    type: "string",
    description: "播放器回报的视频尺寸文本。",
  },
];

export const localRefresh = [
  ["live", "—", "直播"],
  ["detail", "—", "详情"],
  ["player", "—", "播放器"],
  ["category", "—", "分类"],
  ["subtitle", "path", "字幕档位置"],
  ["danmaku", "path", "弹幕档位置"],
] as const;

export const localFileEndpoints = [
  ["/file/{path}", "GET", "浏览目录或下载文件；/file 为共用保存根目录。"],
  [
    "/upload",
    "POST multipart/form-data",
    "path 必填且目录须已存在；文件使用 multipart 字段上传。",
  ],
  ["/newFolder", "GET / POST", "path 为既有父目录，name 为新文件夹名称。"],
  ["/rename", "POST 表单", "path 为既有文件或目录，name 为新名称；目标不可已存在。"],
  ["/move", "POST 表单", "path 为来源，target 为既有目标目录；保留名称，不覆盖同名项目，也不可搬进自身目录。"],
  [
    "/delFolder",
    "GET / POST",
    "path 必填；递归删除指定项目，不可删除保存根目录。",
  ],
  [
    "/delFile",
    "GET / POST",
    "与 /delFolder 共用删除逻辑，并非只允许删除一般文件。",
  ],
] as const;

export const localTransferEndpoints = [
  ["/upload/start", "id、path、name、size、sha256；parallel（选填）", "创建或查找续传。id 是 32 位小写十六进位；size 是文件字节数，sha256 是 64 位小写十六进位。"],
  ["/upload/chunk", "id、offset、size；multipart chunk，并行模式另带 revision", "上传分块；依 start 回传的 chunkSize 切分，offset 与 size 以字节计算。"],
  ["/upload/finish", "id；并行模式另带 revision", "检查完整大小与 SHA-256，再落档或解压 ZIP；只有 complete=true 才完成。"],
  ["/download/start", "url、path；name（选填）", "由 App 设备下载 HTTP(S) 文件到既有目录；省略 name 时取网址最后一段，无名称时用 download。"],
  ["/download/status", "id（选填）", "查找目前任务；省略 id 可重新取得目前任务。"],
  ["/download/pause", "id", "暂停进行中的任务；依回传状态确认，已结束的任务不改变状态。"],
  ["/download/resume", "id", "恢复 paused 或 failed 任务；能否接续取决于来源支持及已保存数据。"],
  ["/download/cancel", "id", "取消任务；停止后为 cancelled，不等同删除目的文件。"],
] as const;

export const localCacheActions = [
  ["get", "key、rule（选填）", "回传保存的字符串；不存在时为空字符串。"],
  ["set", "key、value、rule（选填）", "写入字符串，回传 OK。"],
  ["del", "key、rule（选填）", "移除键，回传 OK。"],
] as const;

export const localMediaFields: Field[] = [
  {
    name: "state",
    type: "integer",
    description: "3＝正在播放；6＝缓冲中；2＝就绪但未播放；其余状态回传 1。",
  },
  {
    name: "speed",
    type: "number",
    description: "目前播放速率，1 表示正常速度。",
  },
  {
    name: "duration",
    type: "integer",
    description:
      "播放器回报的总长，单位毫秒；未知长度可能是负值，不保证为 -1。",
  },
  {
    name: "position",
    type: "integer",
    description: "目前播放位置，单位毫秒。",
  },
  {
    name: "url",
    type: "string",
    description: "目前播放 URL；没有值时为空字符串。",
  },
  {
    name: "title",
    type: "string",
    description: "媒体标题；没有值时为空字符串。",
  },
  {
    name: "artist",
    type: "string",
    description: "媒体的 artist 中继数据；没有值时为空字符串。",
  },
  {
    name: "artwork",
    type: "string",
    description: "封面 URI；没有值时为空字符串。",
  },
];

export const localDeviceFields: Field[] = [
  {
    name: "uuid",
    type: "string",
    description: "此 App 设备使用的 Android ID。",
  },
  { name: "name", type: "string", description: "设备显示名称。" },
  {
    name: "ip",
    type: "string",
    description: "完整服务地址，包含 http://、局域网路 IP 与实际端口号。",
  },
  {
    name: "type",
    type: "integer",
    description:
      "0＝电视版；1＝手机版。Device 对象另以 2 表示 DLNA 设备，但本机 /device 不使用此值。",
  },
  {
    name: "serial",
    type: "string",
    description: "系统可取得的设备序号；可用性受设备与权限限制。",
  },
  {
    name: "eth",
    type: "string",
    description: "eth0 的 MAC 地址；不保证每个设备都能取得。",
  },
  {
    name: "wlan",
    type: "string",
    description: "wlan0 的 MAC 地址；不保证每个设备都能取得。",
  },
  {
    name: "time",
    type: "integer",
    description:
      "App 实例创建时的 Unix 时间，单位毫秒；不是这次 HTTP 回应的时间。",
  },
  {
    name: "id",
    type: "integer",
    description:
      "数据库识别码；/device 创建的是未保存的 Device，因此通常不输出此字段。",
  },
];

export const localExamples = {
  media: {
    state: 3,
    speed: 1,
    duration: 7200000,
    position: 120000,
    url: "https://example.com/video.m3u8",
    title: "范实例目",
    artist: "Demo",
    artwork: "https://example.com/poster.jpg",
  },
  device: {
    uuid: "demo-android-id",
    name: "G.影视 示意设备",
    ip: "http://192.0.2.10:9978",
    type: 0,
    serial: "",
    eth: "",
    wlan: "",
    time: 1788825600000,
  },
  folder: {
    parent: "",
    files: [
      {
        name: "demo.mp4",
        path: "/TV/demo.mp4",
        time: "2026/09/08 12:00:00",
        dir: 0,
      },
      {
        name: "subtitles",
        path: "/TV/subtitles",
        time: "2026/09/08 12:00:00",
        dir: 1,
      },
    ],
  },
  sync: {
    configs: [
      { id: 7, type: 0, url: "https://example.com/vod.json", name: "示意配置" },
    ],
    targets: [
      {
        key: "demo@@@demo-1@@@7",
        cid: 7,
        type: 0,
        siteName: "Demo",
        vodName: "范实例目",
        vodPic: "https://example.com/poster.jpg",
        createTime: 1788825600000,
      },
    ],
  },
};
