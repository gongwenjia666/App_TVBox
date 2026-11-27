import type { Field } from "./config-fields";

export const networkMethods = [
  ["req", "取得 code、headers、content 与 error；QuickJS 使用 await。HTTP 非 2xx 需自行判断，body 支持文本或字节数组。"],
  ["json", "取得 JSON；连接失败、HTTP 非 2xx 或无效 JSON 会抛出例外。"],
  ["get / post", "Java 取得文本正文；HTTP 非 2xx 仍保留正文。"],
  ["getUserAgent", "Python／QuickJS 取得 App 的 User-Agent，按需放入 headers。"],
  ["getCookie / setCookie", "读写 WebView Cookie；Session 使用隔离 Cookie。"],
  ["session", "创建隔离 Cookie 的请求流程，用完关闭。"],
  ["batch", "批量 HTTP 请求，缺省最多 4 笔并行，按输入顺序回传。"],
  ["map", "三语言逐项运行回呼，缺省最多 4 项并行，保留输入顺序。"],
  ["download", "直接下载至文件，由共用下载器管理暂存、续传与分段。"],
  ["openStream", "Python／QuickJS 分块读取，用完关闭 reader。"],
  ["requestStreamAsync", "Java 传入 NetOptions，Future 回传 Net.StreamResult。"],
  ["stream", "Python／QuickJS 原样转送网址，或由产生器提供 proxy 正文。"],
  ["ws", "一次 WebSocket 消息交换，取得首个完整消息后关闭。"],
  ["connect", "持续 WebSocket 连接，可设置断线恢复与接收逾时。"],
  ["cached / peek / refresh", "TTL 缓存、读取已有值与背景更新。"],
  ["cachedText", "Python 取得缓存的 JSON 原文。"],
  ["clearCache", "清除一笔；省略 key 清除目前站点全部 TTL 缓存并取消加载。"],
  ["sleep", "可取消的等待，单位为毫秒。"],
];

export const dialogFields: Field[] = [
  { name: "title / message", type: "string", description: "选填标题与说明。" },
  { name: "image", type: "string", description: "选填 base64 图片 data URI，如 data:image/png;base64,...；由爬虫准备内容。callback 可更新，空字符串移除；解码失败时，尚未结束的 dialog 会回报错误。" },
  { name: "qrcode", type: "string", description: "选填非空白字符串，在本机产生 QR Code；内容不必是网址，无法编码时回报错误。" },
  { name: "copyable", type: "boolean", description: "可选取 message，并提供拷贝全文按钮；拷贝不关窗，也不调用 callback。", default: "false" },
  { name: "cancelable", type: "boolean", description: "允许返回键取消；false 时也阻止点外侧取消。页面销毁及调用取消仍会清理窗口。", default: "true" },
  { name: "inputs", type: "object[]", description: "选填输入字段；name 必填且不可重复，label 缺省 name；value 为字符串，缺省空字符串；多选为字符串数组，缺省空数组。" },
  { name: "inputs[].helperText", type: "string", description: "字段下方的说明文本，省略或空字符串时隐藏。" },
  { name: "inputs[].type", type: "string", description: "text、phone、number、password 为单行，textarea 为多行，select 为单选，multiselect 为多选清单；格式与业务验证由爬虫负责。", default: "text" },
  { name: "inputs[].options", type: "object[]", description: "select／multiselect 必填非空数组；value 为非空白且唯一的字符串，label 缺省 value 且不可空白。显示 label，单选回传字符串，多选依选项顺序回传字符串数组；非空初始值须存在于选项，多选不可重复。" },
  { name: "inputs[].enabled", type: "boolean", description: "允许操作字段；停用时略过内置验证，values 仍包含其值。callback 可回传 inputs 数组，依 name 更新 enabled。", default: "true" },
  { name: "inputs[].required", type: "boolean", description: "不可为空或全空白，多选至少选一项。", default: "false" },
  { name: "inputs[].minLength / maxLength", type: "integer", description: "字符串字段的非负整数限制，以 Unicode 字符计算；maxLength 不可小于 minLength。留空时略过 minLength。", default: "0 / 不限制" },
  { name: "inputs[].minItems / maxItems", type: "integer", description: "多选字段的非负整数限制，以已选数量计算；maxItems 不可小于 minItems。留空时略过 minItems。", default: "0 / 不限制" },
  { name: "buttons", type: "object[]", description: "选填 1～3 个按钮，依序对应 positive、negative、neutral；id 与 label 必填且不可为空，id 不可重复。省略时提供确定（ok）与取消。" },
  { name: "buttons[].close", type: "boolean", description: "false 时保留窗口，必须提供 callback。", default: "true" },
  { name: "buttons[].enabled", type: "boolean", description: "允许操作按钮；callback 可回传 buttons 数组，依 id 更新 enabled。", default: "true" },
  { name: "buttons[].validate", type: "string[]", description: "验证指定的字段 name；空数组略过验证。", default: "全部字段" },
  { name: "callback", type: "function", description: "dialog 的选填第二参数，不放在 options 内。验证通过后接收 {button, values}，button 为按钮 id。Java／Python 使用同步回呼，QuickJS 可回传 Promise。回传 {message, qrcode, image, values, errors, inputs, buttons, close} 更新内容或关窗设置。" },
];

export const liveDanmakuFields: Field[] = [
  {
    name: "text",
    type: "string",
    required: true,
    description: "解码后的文本；不得全空白，最多 4096 字符。",
  },
  {
    name: "color",
    type: "integer",
    description: "RGB 颜色，范围 0～16777215。",
    default: "16777215（白色）",
  },
  {
    name: "size",
    type: "number",
    description: "字级，单位 sp，范围 0～96；0 跟随用户设置。",
    default: "0",
  },
  {
    name: "type",
    type: "integer",
    description: "1 滚动、4 底部、5 顶部、6 反向。",
    default: "1",
  },
  {
    name: "colors",
    type: "integer[]",
    description: "2～8 个 RGB 颜色组成渐层；省略时使用 color。",
  },
];

export const methods = [
  ["init", "初始化爬虫时", "读取 ext 字符串；Python／QuickJS 可省略", "无"],
  ["homeContent", "进入首页", "分类与选填 filters", "Result.class"],
  ["homeVideoContent", "首页分类完成", "首页推荐卡片", "Result.list"],
  [
    "categoryContent",
    "分类、换页、变更筛选",
    "该页卡片与总页数",
    "list + pagecount",
  ],
  ["detailContent", "点击卡片", "依完整 ID 数组的顺序回传信息与播放分组，保留重复 ID", "list"],
  [
    "searchContent",
    "搜索",
    "搜索结果，可支持页码",
    "list + pagecount",
  ],
  ["playerContent", "选择集数", "最终 URL 与播放参数", "Result"],
  ["danmaku", "选用爬虫即时弹幕来源", "弹幕或订阅状态对象", "Java AutoCloseable／Python、QuickJS 停止函数"],
  ["liveContent", "加载直播配置", "TXT、M3U 或 Group JSON", "文本 / Group 数组"],
  ["manualVideoCheck / isVideoFormat", "嗅探网页请求时", "激活爬虫判断并辨识影音网址", "boolean"],
  [
    "proxy",
    "本地代理收到请求",
    "接收扁平字符串键值集合，提供状态、类型、内容与标头",
    "数组 / HTTP 回应",
  ],
  ["action", "自订操作", "可由 Result 解析的结果", "Java JSON 字符串／Python、QuickJS 对象"],
  ["destroy", "重新加载或清除", "释放线程与连接；QuickJS 清理 hook 最长 5 秒", "无"],
];

export const resultFields: Field[] = [
  {
    name: "web",
    type: "{url, mode?, cookie?: {url?, keys: string[]}[]}",
    description: "action 回应的开网页指令，只运行一次；详见开网页章节。",
  },
  {
    name: "class",
    type: "Class[]",
    description: "首页分类清单。",
    default: "[]",
  },
  {
    name: "list",
    type: "Vod[]",
    description: "首页、分类与搜索卡片；详情取 list[0]。播放结果可用 list[0] 更新该片详情，预载时延至采用结果才套用。",
    default: "[]",
  },
  {
    name: "filters",
    type: "object",
    description: "以分类 ID 为键，值为 Filter 数组或单一 Filter。",
    default: "{}",
  },
  {
    name: "url",
    type: "string | string[] | Url",
    description: "播放 URL 或多画质清单，三种写法见下方范例。",
  },
  {
    name: "skips",
    type: "SkipSegment[]",
    description: "每集片头、片中、片尾的跳过区间，start / end 都用毫秒；格式错误的项目会忽略。",
    default: "[]",
  },
  {
    name: "timeshift",
    type: "object",
    description: "直播回看范围与取源网址 {url, start, window}，格式见直播回看章节。",
  },
  {
    name: "header",
    type: "object | string",
    description:
      "播放请求标头；也接受 JSON 对象字符串。整份为空时回退 Site.header，不逐键合并。",
    default: "{}",
  },
  {
    name: "msg",
    type: "string",
    description: "显示提示文本；只有 code 为 0 时显示。",
    default: "空字符串",
  },
  {
    name: "code",
    type: "integer",
    description: "消息控制值，不是 HTTP 状态码；非 0 时隐藏 msg。",
    default: "0",
  },
  {
    name: "danmaku",
    type: "Danmaku[] | string",
    description:
      "弹幕清单、单一 URL 或 JSON 数组字符串，可使用文件或爬虫即时来源；受 App 弹幕加载设置控制。",
    default: "[]",
  },
  { name: "subs", type: "Sub[]", description: "插件字幕清单。", default: "[]" },
  {
    name: "playUrl",
    type: "string",
    description: "解析前缀；json: 后接 JSON 解析端点，parse: 后接具名解析器。",
    default: "空字符串",
  },
  {
    name: "artwork",
    type: "string",
    description: "更新播放页显示的图片。",
    default: "空字符串",
  },
  {
    name: "jxFrom",
    type: "string",
    description:
      "扩展 JSON 解析结果回报的解析器名称，用于成功提示；不是播放分组旗标。",
    default: "空字符串",
  },
  {
    name: "flag",
    type: "string",
    description:
      "播放分组与解析比对旗标；未填时 App 补入调用 playerContent 时的 flag。",
    default: "由 App 补入",
  },
  {
    name: "desc",
    type: "string",
    description: "清理后更新播放页描述。",
    default: "空字符串",
  },
  {
    name: "format",
    type: "string",
    description:
      "媒体 MIME type 提示，请填完整类型，例如 application/x-mpegURL。",
  },
  {
    name: "click",
    type: "string",
    description: "WebView 加载后运行的 JavaScript；Site.click 非空时优先。",
    default: "空字符串",
  },
  {
    name: "key",
    type: "string",
    description: "App 内部回填的 Site key；爬虫不必提供，提供也会被覆写。",
    default: "由 App 补入",
  },
  {
    name: "position",
    type: "integer",
    description:
      "播放起点，单位毫秒；120000 为 2 分钟。未填时不覆盖既有播放进度。",
  },
  {
    name: "pagecount",
    type: "integer",
    description: "总页数；0 或未填表示未知，仍可继续加载更多。",
    default: "0",
  },
  {
    name: "parse",
    type: "integer",
    description: "1 要求解析；0 仍可能因 jx=1 或配置旗标比对进入解析。",
    default: "0",
  },
  {
    name: "jx",
    type: "integer",
    description: "1 要求进入解析，即使 parse=0。",
    default: "0",
  },
  {
    name: "drm",
    type: "Drm",
    description: "播放 DRM 设置，与 Channel.drm 使用相同对象，见配置字典。",
  },
];

export const objectGroups = [
  {
    name: "Vod",
    fields: [
      ["vod_id", "传给 detailContent 的唯一值。"],
      ["vod_name", "显示名称。"],
      ["vod_pic / vod_remarks", "缩略图与角标。"],
      ["type_name", "分类文本。"],
      ["vod_year / vod_area", "年份与地区。"],
      ["vod_director / vod_actor", "人员信息。"],
      ["vod_content", "详细描述。"],
      ["vod_play_from / vod_play_url", "播放分组与集数，分隔方式见下节。"],
      ["vod_play_id", "选填字符串。点入时指定播放 ID 或集名／集数。"],
      ["vod_tag / action", "folder 表示文件夹；非空 action 在点击时触发操作。type 3 传给爬虫 action()；type 4 填回传 JSON 的接口网址。"],
      ["cate", "提供此对象时也视为文件夹，可含 land、circle、ratio。"],
      ["land / circle / ratio / style", "卡片外观覆盖。"],
    ],
  },
  {
    name: "Class",
    fields: [
      ["type_id / id", "传给 categoryContent 的分类 ID。"],
      ["type_name / name", "分类显示名称。"],
      ["type_flag", "1 代表文件夹分类。"],
      ["land / circle / ratio", "该分类缺省卡片样式。"],
      ["filters", "也可在分类对象内提供 Filter 数组。"],
    ],
  },
  {
    name: "Filter",
    fields: [
      ["key / name", "传入键与显示名称。"],
      ["init", "缺省选项值。"],
      [
        "value",
        '选项数组，例如 [{"n":"全部","v":""}]；n 是显示名称，v 是传入值。',
      ],
    ],
  },
  {
    name: "Sub",
    fields: [
      ["url", "字幕档位置。"],
      ["name / lang", "显示名称与语言代码。"],
      ["format", "字幕 MIME type，可省略并由 App 推定。"],
      [
        "flag",
        "0 交由 App 依字幕数量与偏好语言选择；非零使用 Media3 选择旗标：1 缺省、2 强制、4 自动选择，可字节合。",
      ],
    ],
  },
  {
    name: "Danmaku",
    fields: [
      ["url", "HTTP(S) 数据网址，或由 danmakuUrl(id) 产生的即时来源。"],
      ["name", "选填显示名称。"],
    ],
  },
  {
    name: "SkipSegment",
    fields: [
      ["type", "opening 为片头，middle 为片中，ending 为片尾。"],
      ["start", "开始跳过的时间（毫秒）。"],
      ["end", "要跳到的时间（毫秒）；须晚于 start，仅片尾且 start > 0 时可省略。"],
    ],
  },
];
