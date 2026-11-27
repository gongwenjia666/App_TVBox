export type Field = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  default?: string;
};

export function filterFields(fields: Field[], query: string) {
  const value = query.trim().toLowerCase();
  return fields.filter((field) =>
    `${field.name} ${field.type} ${field.description} ${field.default ?? ""}`
      .toLowerCase()
      .includes(value),
  );
}

export const vodTop: Field[] = [
  {
    name: "urls",
    type: "Depot[]",
    description: "配置仓库清单；登记各项配置后加载第一项，清单不可为空。",
  },
  {
    name: "msg",
    type: "string",
    description: "配置回传的错误消息；存在时停止加载，普通配置与仓库都适用。",
  },
  {
    name: "spider",
    type: "string",
    description: "全域 Spider JAR 路径或 URL；Site 未指定 jar 时使用。",
  },
  {
    name: "wallpaper",
    type: "string",
    description: "壁纸图片、GIF 或视频位置。",
  },
  { name: "logo", type: "string", description: "App Logo 图片位置。" },
  { name: "notice", type: "string", description: "启动后显示的公告文本。" },
  {
    name: "sites",
    type: "Site[]",
    required: true,
    description: "点播站点清单。",
  },
  {
    name: "parses",
    type: "Parse[]",
    description: "需要进一步处理 URL 时使用的解析规则。",
  },
  {
    name: "lives",
    type: "Live[]",
    description: "内嵌直播配置清单；也可以另外加载独立 LiveConfig。",
  },
  { name: "doh", type: "Doh[]", description: "DNS over HTTPS 端点。" },
  { name: "proxy", type: "Proxy[]", description: "依 host 套用的代理服务器。" },
  {
    name: "rules",
    type: "Rule[]",
    description: "WebView 网络截取与脚本规则。",
  },
  {
    name: "headers",
    type: "Header[]",
    description: "依 host 注入或覆写 HTTP 请求标头。",
  },
  {
    name: "hosts",
    type: "string[]",
    description: "原主机=目标主机或 IP 的 DNS 覆盖。",
  },
  {
    name: "flags",
    type: "string[]",
    description: "提供给 playerContent 的全域平台旗标。",
  },
  { name: "ads", type: "string[]", description: "要拦截的主机名称清单。" },
  {
    name: "danmaku",
    type: "string",
    description: "弹幕搜索 API；可使用 {name} 与 {episode}。",
  },
  {
    name: "assrt",
    type: "string",
    description: "字幕搜索服务使用的访问字符串。",
  },
];

export const siteFields: Field[] = [
  {
    name: "key",
    type: "string",
    required: true,
    description: "站点唯一识别码，不可重复。",
  },
  { name: "name", type: "string", required: true, description: "显示名称。" },
  {
    name: "type",
    type: "integer",
    description:
      "0=XML HTTP、1=JSON HTTP、3=Spider；4=扩充 HTTP JSON，分类筛选以 Base64 ext 发送，站点 ext 另以 extend 发送。",
    default: "0",
  },
  {
    name: "api",
    type: "string",
    required: true,
    description:
      "HTTP 端点、csp_ 类别，或以 ./、../ 表示的 .js／.py 相对路径；也可使用完整网址。",
  },
  {
    name: "ext",
    type: "string | object | array",
    description:
      "type 3 传给 Spider.init；HTTP 站点以 extend 发送。对象与数组先串行化为字符串；主配置可填 URL 或相对路径。",
  },
  { name: "jar", type: "string", description: "覆盖全域 spider 的 JAR 位置。" },
  {
    name: "click",
    type: "string",
    description: "在 WebView 运行的 JavaScript 点击程序。",
  },
  {
    name: "playUrl",
    type: "string",
    description:
      "type 0/1 的解析 URL 前缀；支持 json: 端点或 parse: 解析器名称。type 3/4 由播放 Result.playUrl 提供。",
  },
  {
    name: "hide",
    type: "integer",
    description: "1 时从站点清单隐藏。",
    default: "0",
  },
  {
    name: "indexs",
    type: "integer",
    description: "1 时作为索引站点。",
    default: "0",
  },
  {
    name: "timeout",
    type: "integer",
    description: "播放逾时秒数，最小 1。",
    default: "15",
  },
  {
    name: "searchable",
    type: "integer",
    description: "0=永久停用、1=激活；运行期间也可能保存为 2。",
    default: "1",
  },
  {
    name: "changeable",
    type: "integer",
    description: "0=禁止切换、1=可切换；运行期间也可能保存为 2。",
    default: "1",
  },
  {
    name: "lang",
    type: "string",
    description:
      "搜索关键字转换语系，支持繁简中文标签；非空的其他值保留原文，空值使用既有转换。",
  },
  {
    name: "danmaku",
    type: "integer",
    description:
      "0 停用此站点通过全域弹幕 API 自动搜索，不影响 Spider 自带弹幕。",
    default: "1",
  },
  {
    name: "quickSearch",
    type: "integer",
    description: "0 跳过快速搜索，1 激活。",
    default: "1",
  },
  {
    name: "categories",
    type: "string[]",
    description:
      "有匹配名称时只保留匹配分类并依清单排序；完全无匹配时保留原分类。",
  },
  {
    name: "header",
    type: "object",
    description:
      "HTTP API 请求标头；播放 Result.header 全空时也作为缺省。type 3 不会自动套用到 Spider 自行发出的请求。",
  },
  { name: "style", type: "Style", description: "站点缺省卡片样式。" },
];

export const parseFields: Field[] = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "解析器显示名称，也是具名选取依据。",
  },
  {
    name: "type",
    type: "integer",
    description: "0=WebView、1=JSON API、2=JAR JSON、3=JAR 混合、4=并行尝试。",
    default: "0",
  },
  { name: "url", type: "string", description: "解析 API 端点或前缀。" },
  {
    name: "ext.flag",
    type: "string[]",
    description:
      "type 4 并行解析时，优先选取同类型且匹配旗标的解析器；没有匹配时回退该类型全部解析器。",
  },
  {
    name: "ext.header",
    type: "object",
    description:
      "附加于解析请求；JSON 解析结果未提供标头时，也作为播放请求的缺省标头。",
  },
];

export const liveFields: Field[] = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "直播配置唯一名称。",
  },
  {
    name: "url",
    type: "string",
    description: "外部 TXT、M3U 或 JSON 列表位置；与 groups 择一。",
  },
  {
    name: "api",
    type: "string",
    description:
      "groups 为空时，用此 Spider 的 liveContent(url) 取得外部列表文本。",
  },
  {
    name: "ext",
    type: "string | object | array",
    description: "传给直播 Spider 的初始化数据；对象与数组会先串行化为字符串。",
  },
  { name: "jar", type: "string", description: "此直播配置专用 JAR。" },
  {
    name: "click",
    type: "string",
    description: "缺省在 WebView 运行的 JavaScript 点击程序。",
  },
  {
    name: "logo",
    type: "string",
    description: "缺省 Logo 范本，可用 {id}、{name}、{logo}。",
  },
  {
    name: "epg",
    type: "string",
    description: "节目表位置，逗号分隔；支持 XMLTV 与 API 范本。",
  },
  { name: "ua", type: "string", description: "缺省 User-Agent。" },
  { name: "origin", type: "string", description: "缺省 Origin 标头。" },
  { name: "referer", type: "string", description: "缺省 Referer 标头。" },
  {
    name: "timeZone",
    type: "string",
    description: "节目表时区，例如 Asia/Taipei。",
    default: "系统时区",
  },
  {
    name: "keep",
    type: "string",
    description: "已保存频道定位信息；通常由 App 自行维护。",
  },
  {
    name: "timeout",
    type: "integer",
    description: "播放逾时秒数，最小 1。",
    default: "15",
  },
  { name: "header", type: "object", description: "直播请求附加 HTTP 标头。" },
  {
    name: "catchup",
    type: "Catchup",
    description:
      "外部列表频道的缺省节目回看设置；内嵌 groups 需在频道自行提供。",
  },
  { name: "core", type: "Core", description: "特殊播放内核的高端初始化设置。" },
  { name: "groups", type: "Group[]", description: "内嵌频道分组。" },
  {
    name: "boot",
    type: "boolean",
    description: "目前选中的直播配置为 true 时，加载完成后触发自动进入直播。",
    default: "false",
  },
  {
    name: "pass",
    type: "boolean",
    description:
      "true 时不把 TXT／M3U 分组名称中的 _后缀 解析成密码；JSON 内明确设置的 Group.pass 不受影响。",
    default: "false",
  },
];

export const channelFields: Field[] = [
  {
    name: "Group.name",
    type: "string",
    required: true,
    description: "分组显示名称。",
  },
  {
    name: "Group.pass",
    type: "string",
    description: "分组密码；未通过前视为隐藏。",
  },
  {
    name: "Group.channel",
    type: "Channel[]",
    required: true,
    description: "分组内频道清单。",
  },
  {
    name: "Channel.name",
    type: "string",
    required: true,
    description: "频道显示名称。",
  },
  {
    name: "Channel.urls",
    type: "string[]",
    required: true,
    description:
      "播放位置清单；未设置 drm 时可用 $线路名称 指定标签。设置 drm 时 URL 原样使用，请勿附加标签。",
  },
  { name: "Channel.number", type: "string", description: "显示用频道号码。" },
  { name: "Channel.logo", type: "string", description: "覆盖配置缺省 Logo。" },
  { name: "Channel.epg", type: "string", description: "覆盖配置缺省 EPG。" },
  {
    name: "Channel.ua",
    type: "string",
    description: "覆盖配置缺省 User-Agent。",
  },
  {
    name: "Channel.click",
    type: "string",
    description: "覆盖配置的 JavaScript 点击程序。",
  },
  {
    name: "Channel.format",
    type: "string",
    description: "直接指定媒体 MIME type。",
  },
  { name: "Channel.origin", type: "string", description: "覆盖 Origin。" },
  { name: "Channel.referer", type: "string", description: "覆盖 Referer。" },
  { name: "Channel.tvgId", type: "string", description: "EPG 频道 ID。" },
  { name: "Channel.tvgName", type: "string", description: "EPG 频道名称。" },
  {
    name: "Channel.header",
    type: "object",
    description:
      "频道 HTTP 标头；外部列表仅在整份 header 为空时继承 Live.header，不逐键合并。",
  },
  {
    name: "Channel.drm",
    type: "Drm",
    description: "媒体 DRM 参数，子字段见共用对象。",
  },
  {
    name: "Channel.parse",
    type: "integer",
    description: "0=不解析、1=解析。",
    default: "0",
  },
  {
    name: "Channel.timeshift",
    type: "object",
    description: "可拖曳的直播回看时间轴，格式与 Result.timeshift 相同。",
  },
  {
    name: "Channel.catchup",
    type: "Catchup",
    description: "覆盖配置的节目回看设置。",
  },
];

export const commonFields: Field[] = [
  { name: "Doh.name", type: "string", description: "DoH 显示名称。" },
  { name: "Doh.url", type: "string", description: "DoH 查找端点。" },
  { name: "Doh.ips", type: "string[]", description: "Bootstrap IP。" },
  { name: "Proxy.name", type: "string", description: "代理规则名称。" },
  {
    name: "Proxy.hosts",
    type: "string[]",
    description: "适用 host，支持规则比对。",
  },
  {
    name: "Proxy.urls",
    type: "string[]",
    description:
      "含主机与端口号的代理位置，例如 http://127.0.0.1:8080、socks5://127.0.0.1:1080；依 http 或 socks 前缀选择 Java 代理类型。",
  },
  { name: "Rule.name", type: "string", description: "规则显示名称。" },
  { name: "Rule.hosts", type: "string[]", description: "触发目标 host。" },
  {
    name: "Rule.regex",
    type: "string[]",
    description: "有效媒体位置的截取条件。",
  },
  {
    name: "Rule.click",
    type: "string[]",
    description:
      "WebView 中要点击的 CSS 选择器清单；与 JavaScript script 分开设置。",
  },
  {
    name: "Rule.script",
    type: "string[]",
    description: "WebView 中运行的脚本。",
  },
  {
    name: "Rule.exclude",
    type: "string[]",
    description: "不应被截取的排除条件。",
  },
  { name: "Header.host", type: "string", description: "要处理的 host。" },
  {
    name: "Header.header",
    type: "object",
    description: "要注入或覆写的 HTTP 请求标头。",
  },
  {
    name: "Catchup.type",
    type: "string",
    description: "default 完全替换；其他值附加于原位置。",
    default: "空字符串；行为为附加",
  },
  {
    name: "Catchup.days",
    type: "string",
    description: "保留字段；目前不限制可回看的天数。",
  },
  {
    name: "Catchup.regex",
    type: "string",
    description: "判断设置是否套用的字符串或规则。",
  },
  {
    name: "Catchup.source",
    type: "string",
    description:
      "节目回看 URL 范本，请提供非空值；可含开始与结束时间 token。",
  },
  {
    name: "Catchup.replace",
    type: "string",
    description: "附加模式使用 正则表达式,替换内容；default 模式不套用。",
  },
  {
    name: "Drm.type",
    type: "string",
    description: "媒体 DRM 类型，例如 widevine、playready、clearkey。",
  },
  {
    name: "Drm.key",
    type: "string",
    description: "DRM 请求位置或该类型接受的密钥数据。",
  },
  {
    name: "Drm.header",
    type: "object | string",
    description: "DRM 请求标头，可用对象或 JSON 对象字符串。",
  },
  {
    name: "Drm.forceKey",
    type: "boolean",
    description:
      "强制使用指定的 DRM 请求位置，不使用媒体内的缺省位置；对应 forceDefaultLicenseUri。",
    default: "false",
  },
  {
    name: "Style.type",
    type: "string",
    description: "rect、oval 或 list。",
    default: "rect",
  },
  {
    name: "Style.ratio",
    type: "float",
    description:
      "宽／高；正值最大 4。未设或小于等于 0 时，oval 为 1，其余为 0.75。",
    default: "依 type",
  },
];

export const coreFields: Field[] = [
  {
    name: "auth",
    type: "string",
    description:
      "内核授权端点；resp 取得非空内容时，App 会改用本机 /tvbus 端点。",
  },
  {
    name: "name",
    type: "string",
    description: "传给播放内核的名称；值也可以是回传文本的网址。",
  },
  {
    name: "pass",
    type: "string",
    description: "传给播放内核的密码；值也可以是回传文本的网址。",
  },
  {
    name: "broker",
    type: "string",
    description: "传给播放内核的 broker 位置。",
  },
  {
    name: "domain",
    type: "string",
    description: "传给播放内核的 domain；值也可以是回传文本的网址。",
  },
  {
    name: "resp",
    type: "string",
    description:
      "本机 /tvbus 端点要回传的内容，也可填回传文本的网址；取得非空内容时取代 auth 的对外位置。",
  },
  {
    name: "sign",
    type: "string",
    description: "与 pkg 一起创建运行期 Hook；值也可以由网址取得。",
  },
  {
    name: "pkg",
    type: "string",
    description: "与 sign 一起创建运行期 Hook；值也可以由网址取得。",
  },
  {
    name: "so",
    type: "string",
    description: "内核原生函数库位置；App 会下载到本机后加载。",
  },
  {
    name: "key",
    type: "string",
    description:
      "目前保留于 Core 配置中的识别值；现行 Core 流程没有公开读取方法。",
  },
  {
    name: "option",
    type: "Core.Option[]",
    description: "初始化内核前逐笔套用的额外选项。",
  },
  { name: "option[].key", type: "string", description: "选项名称。" },
  {
    name: "option[].values",
    type: "string[]",
    description: "传给该选项的值清单。",
  },
];

export const configFieldGroups = [
  { label: "VodConfig", href: "/config#vod", fields: vodTop },
  { label: "Site", href: "/config#site", fields: siteFields },
  { label: "Parse", href: "/config#parse", fields: parseFields },
  { label: "Live", href: "/config#live", fields: liveFields },
  { label: "Group / Channel", href: "/config#channel", fields: channelFields },
  { label: "共用对象", href: "/config#common", fields: commonFields },
  { label: "Core", href: "/config#core", fields: coreFields },
];
