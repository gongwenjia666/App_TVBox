export type PlaybackCommand = readonly [title: string, command: string, description: string];

type CommandGroup = {
  id: string;
  title: string;
  support: string;
  description: string;
  properties: readonly string[];
  commands: readonly PlaybackCommand[];
  notes: readonly string[];
};

export const playbackProperties = [
  {
    name: "pause",
    modes: ["set", "cycle-values", "cycle"],
    values: "yes 暂停；no 播放",
    description: "cycle pause 切换播放／暂停。",
  },
  {
    name: "speed",
    modes: ["set", "add", "cycle-values"],
    values: "0.1～5 倍；1 为原速",
    description: "add 超出范围时取上下限。",
  },
  {
    name: "volume",
    modes: ["set", "add", "cycle-values"],
    values: "0～100；0 静音",
    description: "播放器音量，系统音量不变；add 超出范围时取上下限。",
  },
  {
    name: "sub-delay",
    modes: ["set", "add", "cycle-values"],
    values: "秒，可用小数；0 清除",
    description: "主字幕：正值延后、负值提前；副字幕不变。",
  },
  {
    name: "audio-delay",
    modes: ["set", "add", "cycle-values"],
    values: "秒，可用小数；0 清除",
    description: "声音：正值延后、负值提前。",
  },
  {
    name: "loop-file",
    modes: ["set", "cycle-values"],
    values: "inf 或 yes 打开；no 关闭",
    description: "单片无限循环，不支持指定次数或整份清单。",
  },
  {
    name: "chapter",
    modes: ["set", "add", "cycle-values"],
    values: "从 0 起算；add 仅接受 1、-1",
    description: "需有章节；set chapter 2 跳第三章。",
  },
  {
    name: "video-scale-x",
    modes: ["set", "cycle-values"],
    values: "0 < 倍率 ≤ 10000；1 取消缩放",
    description: "宽度倍率；1.15 加宽 15%。",
  },
  {
    name: "video-scale-y",
    modes: ["set", "cycle-values"],
    values: "0 < 倍率 ≤ 10000；1 取消缩放",
    description: "高度倍率；1.15 增高 15%。",
  },
  {
    name: "video-aspect-override",
    modes: ["set", "cycle-values"],
    values: "no、正数小数或宽:高，例如 16:9、4:3、2.35:1",
    description: "覆写视频比例；no 恢复来源比例，保留额外缩放与平移。填充模式仍拉伸至播放区域。不接受 0、-1 或超出 float 范围的比例。",
  },
] as const;

export const playbackCommandGroups: readonly CommandGroup[] = [
  {
    id: "playback",
    title: "播放与循环",
    support: "Exo、mpv",
    description: "播放、暂停、倍速与单片循环。",
    properties: ["pause", "speed", "loop-file"],
    commands: [
      ["播放／暂停", "cycle pause", "在播放与暂停之间切换。"],
      ["暂停", "set pause yes", "暂停目前视频。"],
      ["播放", "set pause no", "继续播放。"],
      ["指定倍速", "set speed 1.5", "以 1.5 倍速播放。"],
      ["调整倍速", "add speed 0.25", "目前倍速增加 0.25。"],
      ["切换倍速", "cycle-values speed 1 1.25 1.5 2", "依序轮切，最后回到原速。"],
      ["打开单片循环", "set loop-file inf", "重复播放目前视频。"],
      ["关闭单片循环", "set loop-file no", "恢复一般播放顺序。"],
      ["切换单片循环", "cycle-values loop-file no inf", "在一般播放与单片循环之间切换。"],
    ],
    notes: [],
  },
  {
    id: "audio",
    title: "音量与同步",
    support: "Exo、mpv",
    description: "调整播放器音量与声音同步。",
    properties: ["volume", "audio-delay"],
    commands: [
      ["指定音量", "set volume 60", "将播放器音量设为 60%。"],
      ["降低音量", "add volume -10", "目前播放器音量减少 10。"],
      ["切换音量", "cycle-values volume 30 60 100", "依序切换三个音量。"],
      ["声音延后 0.2 秒", "set audio-delay 0.2", "设置声音相对画面的延迟。"],
      ["声音提早 0.1 秒", "add audio-delay -0.1", "在目前延迟上减少 0.1 秒。"],
    ],
    notes: [],
  },
  {
    id: "track-selection",
    title: "音轨切换",
    support: "Exo、mpv",
    description: "切换音轨、关闭音频或恢复自动选轨。",
    properties: [],
    commands: [
      ["下一音轨", "cycle aid", "也可使用 cycle aid up；循环包含关闭音频。"],
      ["上一音轨", "cycle aid down", "反向循环，也包含关闭音频。"],
      ["指定音轨", "set aid 2", "需先确认目前视频有 ID 为 2 的可播放音轨。"],
      ["关闭音频", "set aid no", "停用音频，视频仍可继续播放。"],
      ["自动选轨", "set aid auto", "清除手动指定，依语言偏好与缺省旗标重新选轨。"],
      ["只在指定音轨间切换", "cycle-values aid 2 4 3", "依列出的 ID 顺序轮切，不加入关闭音频。"],
      ["反向切换指定音轨", "cycle-values !reverse aid 2 4 3", "按 ID 清单反向轮切。"],
    ],
    notes: [
      "audio 是 aid 的别名，可用于上述语法。范例 ID 需依目前视频调整。",
      "音轨 ID 不是清单索引，可能随视频或播放器改变。Exo 可使用不含空白或分号的字符串 ID。",
      "Exo 的 cycle-values 音轨清单只接受不重复的 ID；任一 ID 不存在、无法播放或有歧义时不运行。no、auto 请使用 set aid 设置。",
    ],
  },
  {
    id: "subtitles",
    title: "字幕调整",
    support: "Exo、mpv",
    description: "调整主字幕的时间，副字幕不变。",
    properties: ["sub-delay"],
    commands: [
      ["字幕延后 0.2 秒", "set sub-delay 0.2", "设置主字幕延迟。"],
      ["字幕提早 0.1 秒", "add sub-delay -0.1", "在目前延迟上减少 0.1 秒。"],
      ["清除字幕延迟", "set sub-delay 0", "恢复原始字幕时间。"],
      ["切换字幕延迟", "cycle-values sub-delay 0 0.1 0.2", "依序轮切三个延迟值。"],
    ],
    notes: [],
  },
  {
    id: "seek",
    title: "跳转与章节",
    support: "Exo、mpv",
    description: "跳到指定时间、视频比例或章节。",
    properties: ["chapter"],
    commands: [
      ["快转 90 秒", "seek +90", "缺省使用相对秒数。"],
      ["倒退 10 秒", "seek -10 relative", "从目前位置倒退。"],
      ["跳到第 120 秒", "seek 120 absolute", "使用从片头起算的秒数。"],
      ["跳到结束前 10 秒", "seek -10 absolute", "负数由片尾倒数。"],
      ["跳到视频一半", "seek 50 absolute-percent", "使用整部片长的百分比。"],
      ["快转片长的 10%", "seek 10 relative-percent", "从目前位置向后移动片长的 10%。"],
      ["跳到第三章", "set chapter 2", "章节索引从 0 起算。"],
      ["下一章", "add chapter 1", "跳到下一章。"],
      ["上一章", "add chapter -1", "本章已播放超过 5 秒时，先回到本章开头。"],
      ["轮切前两章", "cycle-values chapter 0 1", "视频需包含这两个章节。"],
    ],
    notes: ["来源需支持跳转；百分比与从片尾倒数都需要已知片长。超出时间范围时停在起点或终点。"],
  },
  {
    id: "video",
    title: "画面调整",
    support: "Exo、mpv",
    description: "调整视频宽高与比例。",
    properties: ["video-scale-x", "video-scale-y", "video-aspect-override"],
    commands: [
      ["加宽视频", "set video-scale-x 1.15", "宽度增加 15%。"],
      ["增高视频", "set video-scale-y 1.15", "高度增加 15%。"],
      ["切换视频高度", "cycle-values video-scale-y 1 1.15 1.3", "依序轮切高度倍率。"],
      ["指定视频比例", "set video-aspect-override 16:9", "将来源比例覆写为 16:9。"],
      ["切换视频比例", "cycle-values video-aspect-override no 16:9 4:3 2.35:1", "在来源比例与指定比例间轮切。"],
      ["恢复来源比例", "set video-aspect-override no", "清除比例覆写，保留额外缩放与平移。"],
    ],
    notes: ["缩放倍率设为 1，取消该方向的额外缩放，保留画面比例模式。放大可能裁切边缘；字幕、弹幕与控制接口大小不变。"],
  },
];

export const playbackSections = [
  ["start", "添加指令按钮"],
  ...playbackCommandGroups.map((group) => [group.id, group.title] as const),
  ["cycle-values", "轮切语法"],
  ["limits", "使用限制"],
] as const;
