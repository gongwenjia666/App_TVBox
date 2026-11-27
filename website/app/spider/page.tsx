import type { Metadata } from "next";
import { DocsNav } from "../DocsNav";
import Link from "next/link";
import { CodeTabs, type CodeSample } from "../CodeTabs";
import { CodeBlock, DocsLayout } from "../ui";
import { FieldTable } from "../FieldTable";
import { resultFields, objectGroups, methods, networkMethods, liveDanmakuFields, dialogFields } from "../spider-fields";

export const metadata: Metadata = {
  title: "爬虫介接",
  description: "Java、Python、QuickJS 爬虫范例、共用接口与回传数据格式。",
};

const dialogSamples: CodeSample[] = [
  {
    id: "java", label: "Java", file: "Spider.action",
    code: `JSONObject options = new JSONObject("""
    {"title":"输入内容","inputs":[{"name":"text","label":"内容","required":true}]}
    """);
JSONObject result = dialog(options);
if (result == null) return "{}";
String text = result.getJSONObject("values").getString("text");`,
  },
  {
    id: "python", label: "Python", file: "Spider.action",
    code: `options = {
    "title": "输入内容",
    "inputs": [{"name": "text", "label": "内容", "required": True}],
}
result = self.dialog(options)
if result is None:
    return {}
text = result["values"]["text"]`,
  },
  {
    id: "quickjs", label: "QuickJS", file: "Spider.action",
    code: `const result = await this.dialog({
  title: "输入内容",
  inputs: [{name: "text", label: "内容", required: true}]
});
if (result === null) return {};
const text = result.values.text;`,
  },
];

const java = `// 最小点播范例；example.com 为示意网址。
package com.github.catvod.spider;

import com.github.catvod.bean.Class;
import com.github.catvod.bean.Vod;
import com.github.catvod.crawler.Spider;
import com.github.catvod.utils.Response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Demo extends Spider {

    // 回传分类清单。
    @Override
    public String homeContent(boolean filter) {
        return Response.create().classes(List.of(Class.create().id("movie").name("电影"))).string();
    }

    // 范例只有一页；第二页起回传空清单。
    @Override
    public String categoryContent(String tid, String pg, boolean filter, HashMap<String, String> extend) {
        List<Vod> items = List.of(card("demo-1", "范实例目"));
        return Response.page(items, Integer.parseInt(pg), 20).string();
    }

    // 集数先使用稳定 ID，播放时再取得网址。
    @Override
    public String detailContent(List<String> ids) {
        List<Vod> items = new ArrayList<>();
        for (String id : ids) items.add(detailVod(id));
        return Response.create().vods(items).string();
    }

    // 将播放 ID 换成实际网址。
    @Override
    public String playerContent(String flag, String id, List<String> vipFlags) {
        String url = id.replace("demo://", "https://example.com/");
        return Response.create().url(url).string();
    }

    private Vod detailVod(String id) {
        return card(id, "范实例目").playFrom("Demo").playUrl("第 1 集$demo://episode/1");
    }

    private Vod card(String id, String name) {
        return Vod.create().id(id).name(name).pic("https://example.com/poster.jpg");
    }
}`;

const python = `# 最小点播范例；example.com 为示意网址。
from base.spider import Spider as BaseSpider


class Spider(BaseSpider):
    def init(self, extend=""):
        pass

    # 回传分类清单。
    def homeContent(self, filter):
        return {"class": [{"type_id": "movie", "type_name": "电影"}]}

    # 完整清单交给共用方法分页。
    def categoryContent(self, tid, pg, filter, extend):
        items = [self.card("demo-1", "范实例目")]
        return self.page(items, pg, 20)

    # 集数先使用稳定 ID，播放时再取得网址。
    def detailContent(self, ids):
        items = []
        for video_id in ids:
            item = self.card(video_id, "范实例目")
            item.update({"vod_play_from": "Demo", "vod_play_url": "第 1 集$demo://episode/1"})
            items.append(item)
        return {"list": items}

    # 将播放 ID 换成实际网址。
    def playerContent(self, flag, id, vipFlags):
        url = id.replace("demo://", "https://example.com/")
        return {"parse": 0, "url": url}

    def card(self, id, name):
        return {
            "vod_id": id,
            "vod_name": name,
            "vod_pic": "https://example.com/poster.jpg"
        }`;

const javascript = `// 最小点播范例；example.com 为示意网址。
import {Spider} from "catvod";

const card = (id, name) => ({
  vod_id: id,
  vod_name: name,
  vod_pic: "https://example.com/poster.jpg"
});

export default class Demo extends Spider {
  // 回传分类清单。
  homeContent(filter) {
    return {
      class: [{ type_id: "movie", type_name: "电影" }]
    };
  }

  // 完整清单交给共用方法分页。
  categoryContent(tid, pg, filter, extend) {
    const items = [card("demo-1", "范实例目")];
    return this.page(items, pg, 20);
  }

  // 集数先使用稳定 ID，播放时再取得网址。
  detailContent(ids) {
    const list = ids.map(id => ({
      ...card(id, "范实例目"),
      vod_play_from: "Demo",
      vod_play_url: "第 1 集$demo://episode/1"
    }));
    return {list};
  }

  // 将播放 ID 换成实际网址。
  playerContent(flag, id, vipFlags) {
    const url = id.replace("demo://", "https://example.com/");
    return { parse: 0, url };
  }
}`;

const resultExplore = `{
  "class": [
    { "type_id": "movie", "type_name": "电影" }
  ],
  "filters": {
    "movie": [
      {
        "key": "area",
        "name": "地区",
        "init": "",
        "value": [
          { "n": "全部", "v": "" },
          { "n": "台湾", "v": "tw" }
        ]
      }
    ]
  },
  "list": [
    {
      "vod_id": "demo-1",
      "vod_name": "范实例目",
      "vod_pic": "https://example.com/poster.jpg",
      "vod_remarks": "示意"
    }
  ],
  "pagecount": 1,
  "msg": "选填提示"
}`;

const resultPlay = `{
  "url": "https://example.com/video/demo-1.m3u8",
  "parse": 0,
  "header": {
    "User-Agent": "ExampleClient/1.0",
    "Referer": "https://example.com/"
  },
  "format": "application/x-mpegURL",
  "subs": [
    {
      "url": "https://example.com/subs/demo-1.vtt",
      "name": "繁体中文",
      "lang": "zh-TW",
      "format": "text/vtt",
      "flag": 0
    }
  ],
  "danmaku": [
    { "url": "https://example.com/danmaku/demo-1.xml", "name": "示意弹幕" }
  ],
  "artwork": "https://example.com/poster.jpg",
  "desc": "示意播放信息",
  "position": 120000
}`;

const samples: CodeSample[] = [
  {
    id: "java",
    label: "Java",
    file: "com/github/catvod/spider/Demo.java",
    code: java,
  },
  { id: "python", label: "Python", file: "demo.py", code: python },
  { id: "javascript", label: "QuickJS", file: "demo.js", code: javascript },
];

const streamSamples: CodeSample[] = [
  {
    id: "java",
    label: "Java",
    file: "Demo.java / proxy",
    code: String.raw`NetOptions options = NetOptions.from("{\"timeout\":15000,\"callTimeout\":15000}");
Net.StreamResult response = net.requestStreamAsync("https://example.com/data.bin", options).get();
return new Object[]{response.code, response.contentType, response, response.headers};`,
  },
  {
    id: "python",
    label: "Python",
    file: "spider.py / proxy",
    code: `response = self.net.stream("https://example.com/data.bin", {
    "timeout": 15000, "callTimeout": 15000
})
return [response["code"], response["contentType"], response["stream"], response["headers"]]`,
  },
  {
    id: "javascript",
    label: "QuickJS",
    file: "spider.js / proxy",
    code: `const response = await net.stream("https://example.com/data.bin", {
  timeout: 15000, callTimeout: 15000
});
return [response.code, response.contentType, response.stream, response.headers];`,
  },
];

export default function SpiderPage() {
  return (
    <DocsLayout
      title="爬虫介接指南"
      lead="从 Java、Python、QuickJS 范例开始，了解加载、共用接口与回传格式。"
    >
      <div className="docs-layout wrap">
        <DocsNav items={[
          ["start", "加载爬虫"],
          ["modules", "安装运行模块"],
          ["testing", "测试爬虫"],
          ["demo", "三语言 Demo"],
          ["lifecycle", "方法与调用时机"],
          ["playback-details", "播放详情更新"],
          ["network", "共用网络"],
          ["streams", "串流读取与代理"],
          ["websocket", "WebSocket"],
          ["cache", "缓存与保存"],
          ["scripts", "运行 JavaScript"],
          ["runtime", "Android UI"],
          ["result", "Result 回传格式"],
          ["objects", "数据对象"],
          ["episodes", "播放分组与集数"],
          ["episode-selection", "指定播放"],
          ["proxy", "Proxy 回传"],
          ["live-danmaku", "即时弹幕"],
          ["timeshift", "直播回看"],
          ["skips", "片段跳过"],
          ["web", "开网页"],
          ["node", "Node.js 加载"],
        ]} />
        <div className="docs-content">
          <section id="start">
            <h2>加载爬虫</h2>
            <h3>Site 最小配置</h3>
            <CodeBlock label="JSON / Site" path="sites[] 对象片段">{`{
  "key": "demo",
  "name": "Demo",
  "type": 3,
  "api": "./demo.js",
  "ext": {}
}`}</CodeBlock>
            <div className="loader-list">
              <article>
                <strong>Java JAR</strong>
                <code>{'api: "csp_Demo"'}</code>
                <p>
                  类别放在 <code>com.github.catvod.spider.Demo</code>
                  ，并继承抽象 Spider；主配置必须提供 <code>spider</code>{" "}
                  或站点的 <code>jar</code>。使用 <code>catvod-api.jar</code>{" "}
                  作为 <code>compileOnly</code> 编译依赖，由 TV 根任务{" "}
                  <code>:apiJar</code> 产生于{" "}
                  <code>build/outputs/api/catvod-api.jar</code>。
                </p>
              </article>
              <article>
                <strong>Python</strong>
                <code>{'api: "./demo.py"'}</code>
                <p>
                  相对路径以配置档所在位置为基准；输出 <code>Spider</code>{" "}
                  类别并继承 <code>base.spider.Spider</code>。
                </p>
              </article>
              <article>
                <strong>QuickJS</strong>
                <code>{'api: "./demo.js"'}</code>
                <p>
                  JavaScript 由 QuickJS 运行；相对路径以配置档所在位置为基准。
                  从 <code>catvod</code> 导入 Spider，缺省导出继承它的类别。
                </p>
              </article>
            </div>
          </section>
          <section id="modules">
            <h2>安装运行模块</h2>
            <p>
              在 App 的模块页安装 Python、QuickJS 或 Node.js 的独立 APK。
              Thunder、mpv 与 BD-J 也在此管理，按需要安装。
            </p>
            <div className="loader-list">
              <article>
                <strong>安装与更新</strong>
                <p>
                  选择模块、下载并完成系统安装。
                  版本需与 App 的模块接口及设备 ABI 兼容。
                </p>
              </article>
              <article>
                <strong>测试与重启</strong>
                <p>
                  安装后运行模块测试，确认能初始化。
                  若提示重新启动，重开 App 后再加载爬虫。
                </p>
              </article>
            </div>
            <p>
              QuickJS 使用 QuickJS-NG 引擎，不能直接运行 Node.js 套件；
              Node.js 请依 <Link className="inline-link" href="/spider#node">独立加载方式</Link> 设置。
              使用新接口时，请一并更新 App 与对应模块。
            </p>
          </section>
          <section id="testing">
            <h2>测试爬虫</h2>
            <p>
              连接 App 的网页，从「设置 → 爬虫测试」打开 <code>/spider.html</code>。
              Python 与 QuickJS 需先安装对应模块。
            </p>
            <ol>
              <li>加载 Java JAR 并选择类别，或加载 .py／.js；ext 为选填。</li>
              <li>选择方法，以 JSON 数组填入参数，运行并查看结果与网络纪录。</li>
              <li>修改后保存、重新加载并重测；可格式化来源或还原版本。</li>
              <li>playerContent 回传有效结果后，送到 App 确认播放。</li>
            </ol>
            <p>
              方法名称使用 homeContent、categoryContent、detailContent、playerContent 等完整入口。
              searchContent 可传 [key, quick]，省略的 pg 为字符串 <code>{'"1"'}</code>；布尔值使用 true／false，分类的 extend 与 proxy params 使用字符串键值对象。
            </p>
            <p>
              App 不编译 Java，修改 .java 后需重新产生并加载 JAR。
              测试逾时缺省 30 秒，可设为 1–300 秒；重新加载、取消或离开会清理测试工作。
              来源若已被其他页面修改，先重新读取再保存。
            </p>
            <div className="callout">
              <b>先确认回传，再确认播放</b>
              模块测试与正确的 URL 不代表播放成功，仍需在 App 确认画面、声音、字幕与弹幕。
            </div>
          </section>
          <section id="demo">
            <h2>三语言 Demo</h2>
            <p>
              范例流程为「分类 → 列表 → 详情 → 播放」。请将 example.com 换成自己的来源，
              并补上搜索与错误处理。
            </p>
            <div className="callout">
              <b>回传格式</b>Java 用 <code>Class</code>／<code>Vod</code> 组装数据，
              由 <code>Response</code> 产生 JSON 字符串；Python 回传
              dict／list，QuickJS 回传对象／数组，由 App 串行化。
              直播可回传 Group 数组或 TXT／M3U 原始文本。
            </div>
            <p>
              三种语言的 detailContent 都接收完整 ID 集合，依输入顺序回传，保留重复 ID；空集合回传空 list。
              单笔失败时整个批量回报错误；未上架等合法空结果可合并，并保留各笔 msg。
            </p>
            <p>
              QuickJS 使用完整的 homeContent／categoryContent／detailContent／playerContent 等入口名称。
              constructor 维持同步，异步初始化放在 init；入口可回传同步值或 Promise。
              Python／QuickJS 的 init 接收原始 ext 字符串，需要 JSON 时由来源解析；categoryContent 的 extend 仍是筛选对象。
              init 可省略；未覆写的首页、列表、播放／操作、直播及代理分别使用空 class、空 list、空对象、空字符串与 404 回应。
            </p>
            <CodeTabs samples={samples} />
            <p>
              完整范例见 CatVodSpider 的{" "}
              <a href="https://github.com/FongMi/CatVodSpider/blob/main/app/src/main/java/com/github/catvod/spider/Demo.java">Java</a>、
              <a href="https://github.com/FongMi/CatVodSpider/blob/main/examples/python/spider.py">Python</a> 与{" "}
              <a href="https://github.com/FongMi/CatVodSpider/blob/main/examples/javascript/spider.js">QuickJS</a>，
              涵盖筛选、搜索分页、直播、缓存与网页操作。
            </p>
          </section>
          <section id="lifecycle">
            <h2>方法与调用时机</h2>
            <p>
              本表适用 Java、Python 与 QuickJS；Node.js 使用 <Link className="inline-link" href="/spider#node">独立 HTTP 端点</Link>。
            </p>
            <p>
              在 <code>destroy</code> 释放自建 Session、WebSocket 与背景工作。
              QuickJS 最多等待 5 秒（含 Promise），逾时仍会继续清理引擎。
            </p>
            <div className="table-scroll">
              <table
                className="method-table"
                aria-label="Spider 方法与调用时机"
              >
                <thead>
                  <tr>
                    <th scope="col">方法</th>
                    <th scope="col">何时调用</th>
                    <th scope="col">责任</th>
                    <th scope="col">主要回传</th>
                  </tr>
                </thead>
                <tbody>
                  {methods.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) => (
                        <td
                          key={index}
                          data-label={
                            ["方法", "何时调用", "责任", "主要回传"][index]
                          }
                        >
                          {index === 0 ? <code>{cell}</code> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section id="playback-details">
            <h2>播放详情更新</h2>
            <p>
              <code>playerContent</code> 可在播放结果的 <code>list[0]</code> 带回 VOD 详情。
              App 采用结果时更新页面；预载结果在切集时套用，取消或过期的结果会丢弃。
            </p>
            <CodeBlock label="JSON / Result" path="播放结果附带详情">{`{
  "parse": 0,
  "url": "https://example.com/video.mp4",
  "list": [
    {
      "vod_id": "demo-1",
      "vod_name": "范实例目",
      "vod_pic": "https://example.com/cover.jpg",
      "type_name": "动画",
      "vod_year": "2026",
      "vod_area": "台湾",
      "vod_director": "示范导演",
      "vod_actor": "演员甲、演员乙",
      "vod_content": "完整简介",
      "vod_remarks": "更新至第 2 集",
      "vod_play_from": "主要线",
      "vod_play_url": "第1集$episode-1#第2集$episode-2"
    }
  ]
}`}</CodeBlock>
            <p>
              Java 使用 <code>Response.vod(vod)</code>，Python／QuickJS 使用 <code>list: [vod]</code>；
              Node.js 的 <code>/play</code> 与 type=4 API 使用相同的 JSON 格式。
              范例见 <a className="inline-link" href="https://github.com/FongMi/CatVodSpider">CatVodSpider Demo</a>。
            </p>
            <p>
              同名播放分组合并 episode，相同名称与播放值去重，其余追加，保留目前选集位置。
              <code>vod_id</code> 可省略，提供时会连动历史与收藏识别。
            </p>
          </section>
          <section id="network">
            <h2>共用网络</h2>
            <p>
              App 在初始化前提供网络接口：Java 使用 <code>net</code>、Python 使用 <code>self.net</code>、QuickJS 使用 <code>this.net</code>。
              QuickJS 辅助模块也可从 <code>catvod</code> 明确导入 net、local、js、dialog 等资源，下文以 net 简写。
              时间单位为毫秒。完整参数与范例见 <a href="https://github.com/FongMi/CatVodSpider/blob/main/docs/development.md#网络">CatVodSpider 开发说明</a>。
            </p>
            <div className="table-scroll">
              <table className="method-table" aria-label="共用网络方法">
                <thead>
                  <tr><th scope="col">方法</th><th scope="col">用途</th></tr>
                </thead>
                <tbody>
                  {networkMethods.map(([name, description]) => (
                    <tr key={name}>
                      <td data-label="方法"><code>{name}</code></td>
                      <td data-label="用途">{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>HTTP</h3>
            <p>
              只取 JSON 用 <code>net.json(url, options)</code>；连接失败、HTTP 非 2xx 或无效 JSON 会抛出例外。
              需要状态码、错误正文或 bytes 时用 <code>net.req</code>，QuickJS 用 <code>await net.req</code>。
              Java 的 options 除特别标示外使用 JSON 字符串，json／req 也回传 JSON 字符串。
            </p>
            <p>
              QuickJS 的 req／json 都以 await 取得结果，没有同步 req 或 http 别名。Python／QuickJS 使用对象传 options，
              二进位回应用 <code>buffer: 3</code>，分别取得 bytes／ArrayBuffer。
              <code>net.getUserAgent()</code> 取得 App 的 UA，需要时自行放入 headers。
            </p>
            <p>
              原始 POST 用 <code>body</code>，与 data 择一并提供 Content-Type。
              body 支持文本或 0～255 整数数组，例如 <code>{"body: [0, 127, 128, 255]"}</code>；buffer 只控制回应格式。
            </p>
            <h3>Cookie 与 Session</h3>
            <p>
              <code>cookie: true</code> 使用并更新 WebView Cookie；以 <code>getCookie(url)</code> 读取、
              <code>setCookie(url, cookie)</code> 写入单笔 Set-Cookie。
              <code>net.session()</code> 自动管理隔离 Cookie，不共用站点的 Cookie 或 TTL 缓存，也不支持 persist。
            </p>
            <p>
              Session 用完须关闭：Java 用 try-with-resources、Python 用 with、QuickJS 用 finally。
              关闭会取消其请求、串流与连接，之后不可继续使用。
            </p>
            <h3>批量与下载</h3>
            <p>
              <code>net.batch(requests, limit)</code> 每笔传入 <code>&#123;url, options&#125;</code>，缺省最多 4 笔并行，按输入顺序回传。
              每项还需缓存、签名或解析时用 <code>net.map(items, mapper, limit)</code>，回呼收 item／index，各项自行检查 HTTP 状态。
              抛错后停止派送，已开始的工作继续完成；Java／Python 在背景线程回呼，QuickJS 可用 async。
            </p>
            <p>
              Java 下载用 <code>net.download(url, optionsJson, file)</code>，Python／QuickJS 用 <code>net.download(url, path, options)</code>。
              <code>threads</code> 为 0 自动、1 单连接、2–4 并行上限；<code>size</code> 指定完整 bytes，<code>maxBytes</code> 限制写入大小。
              续传与分段依来源的 Range 与验证信息决定，cookie:true／Session 不续传；完成后仍须确认文件内容。
            </p>
          </section>
          <section id="streams">
            <h2>串流读取与代理</h2>
            <p>
              Java 用 <code>net.requestStreamAsync(url, NetOptions)</code>，Future 回传继承 InputStream 的 <code>Net.StreamResult</code>。
              Python 用 <code>self.net.openStream(url, options)</code>，QuickJS 用 <code>await net.openStream(url, options)</code>。
              用完以 try-with-resources、with 或 finally 关闭。
            </p>
            <h3>原样转送</h3>
            <p>
              将下列片段放入对应的 proxy 方法。成功交付后由 App 关闭 stream，不交付时自行 close。
              QuickJS handle 只供当次 proxy 使用一次，不存入 Local／缓存；Java 需引入 Net 与 NetOptions。
            </p>
            <CodeTabs samples={streamSamples} />
            <h3>自订串流正文</h3>
            <p>
              Python 用 <code>self.net.stream(generator())</code>，yield bytes／bytearray／连续 memoryview；
              QuickJS 用 <code>await net.stream(asyncGenerator())</code>，yield ArrayBuffer／TypedArray。
              将回应的 stream 放入 proxy 第三格；Java 直接回传自订 InputStream。
            </p>
            <p>
              产生器在播放器读取时才运行，不接受 HTTP options。reader 在产生器内打开，以 with／finally 关闭；
              App 关闭 body 时取消其等待中的串流请求与读取，再关闭产生器。
            </p>
            <p>
              直播可用 <code>callTimeout: 0</code> 关闭整次 HTTP 期限，保留 timeout 防止读取卡住；Demo 使用 15 秒期限。
              读取大小、EOF 与取消限制见 <a href="https://github.com/FongMi/CatVodSpider/blob/main/docs/development.md#串流读取与代理">开发说明</a>。
            </p>
          </section>
          <section id="websocket">
            <h2>WebSocket</h2>
            <p>
              一次交换用 <code>net.ws(url, options)</code>，取得首个完整消息后关闭。
              持续收讯用 <code>net.connect(url, options, callback)</code>，回呼接收 <code>(socket, event)</code>，
              事件为 open／message／retry／error／close。
            </p>
            <p>
              content 为文本，二进位则为 Java byte[]、Python bytes 或 QuickJS Uint8Array。
              使用回呼传入的 <code>socket.send()</code> 发送、<code>socket.close()</code> 关闭，需立即中断时用 cancel。
              站点或 Session 释放时也会取消连接。
            </p>
            <p>
              timeout 只限制创建连接；ping 是协定 Ping 的毫秒间隔。
              idle 是未收到文本／二进位消息的逾时毫秒数，缺省 0 关闭；送出消息与 Ping／Pong 不会重设期限。
              平台订阅与应用层心跳由爬虫处理，只在来源保证持续回讯时设置 idle。
            </p>
            <p>
              <code>reconnect: true</code> 激活断线恢复，缺省关闭，等待从 1 秒倍增至 30 秒。
              每次 open 重新订阅，retry 时停止心跳并清除残包。
              主动关闭、释放或认证／凭证／协定／回呼错误后不再重连。
            </p>
          </section>
          <section id="cache">
            <h2>缓存与保存</h2>
            <h3>TTL 缓存</h3>
            <p>
              <code>net.cached(key, options, loader)</code> 按站点缓存 JSON，同 key 合并加载。
              ttl 必填；stale 缺省 true，过期先回旧值并背景更新；persist 缺省 false，激活时持久化公开数据。
              播放网址使用短 TTL、<code>stale: false</code>，不持久化。
            </p>
            <p>
              <code>peek(key)</code> 只读已有值，包括过期值；<code>refresh(key, options, loader)</code> 立即返回，依 TTL 背景更新。
              <code>clearCache(key)</code> 清一笔，省略 key 清除目前站点全部 TTL 缓存并取消加载。
            </p>
            <p>
              Python 的 <code>self.net.cachedText(key, options, loader)</code> 取得 JSON 原文；cached 则解码为 Python 值，两者共用 TTL 与清除规则。
              Java 的 cached 回传 JSON 字符串。
            </p>
            <h3>Local</h3>
            <p>
              小型设置用 Java 的 <code>local</code>、Python 的 <code>self.local</code> 或 QuickJS 的 <code>local</code>。
              以 get(key)／set(key, value)／delete(key) 读写，App 按站点隔离；Java 使用 JSON 字符串，Python／QuickJS 使用 JSON 值。
              set／delete 没有回传值。
              清 TTL 缓存不会删除 Local。
            </p>
          </section>
          <section id="scripts">
            <h2>运行 JavaScript</h2>
            <p>
              用 <code>js.eval(source, options)</code> 在独立环境运行短段 JavaScript。
              Java 的 options 与回传值使用 JSON 字符串；Python 用 <code>self.js.eval</code>，QuickJS 用 <code>await js.eval</code>。
            </p>
            <p>
              <code>globals</code> 传 JSON 变量，<code>timeout</code> 为正整数毫秒，缺省 5000；内置 <code>md5X</code>。
              回传最后一个表达式的 JSON 值，不接受 Promise。环境不提供网络、DOM 或模块导入，完成、逾时或取消后即关闭。
              三种语言都需要 QuickJS 模块。
            </p>
          </section>
          <section id="runtime">
            <h2>Android UI</h2>
            <p>
              共用 SDK 的 <code>com.github.catvod.Runtime</code> 以 <code>Runtime.context()</code>
              取得 Application Context、<code>Runtime.activity()</code> 取得目前 Activity，
              <code>Runtime.toast()</code> 显示文本提示。Java 需明确导入这个类别；Python
              使用 <code>jclass</code> 取得。这些接口由宿主提供，爬虫 JAR 使用
              <code>compileOnly</code> 依赖 SDK。
            </p>
            <p>
              继承 Spider 的 Java／Python 爬虫也可使用 <code>getActivity()</code>／
              <code>self.getActivity()</code>。Activity 可能为 null／None；自订原生 UI
              在主线程显示时才取得 Activity，不保存页面引用。
              <code>Runtime.toast()</code> 由 App 切到主线程显示。
              QuickJS 的文本提示可从 action 回传 <code>msg</code> 字段。
            </p>
            <p>
              三语言共用 Dialog 参数与宿主接口，可显示文本、QR Code、图片与自订表单。
              Java 用 <code>dialog(options)</code>，Python 用 <code>self.dialog(options)</code> 同步取得结果；
              QuickJS 用 <code>await this.dialog(options, callback)</code>，回呼以第二参数传入。
            </p>
            <p>
              关窗时回传 <code>{"{button, values}"}</code>：button 是按钮 id，values 以字段 name 对应字符串，多选字段使用字符串数组。
              允许的返回或点外侧操作、缺省取消按钮及页面销毁时回传 null／None。
              宿主、参数或回呼错误时，Java／Python 抛出例外，QuickJS Promise reject。
              调用取消或爬虫释放会关窗并停止等待。
            </p>
            <p>
              Java／Python 在爬虫工作线程调用，回呼也在原工作线程运行；宿主负责显示 UI。
              Java 的 options／event／结果使用 JSONObject，Python 使用 dict，QuickJS 使用对象。
              Java／Python 回呼同步回传更新，QuickJS 回呼可回传 Promise；皆可省略回呼。
            </p>
            <p>
              Java 需更新编译用 SDK 与 App，Python／QuickJS 需使用配套 App 与模块。
            </p>
            <CodeTabs samples={dialogSamples} />
            <FieldTable fields={dialogFields} label="Dialog" />
            <p>
              三语言 Demo 的 dialog 示范字段更新与验证，qrcode 示范 QR Code 更新与拷贝，dialog_steps 示范图片更新与连续对话框。
              以下以 QuickJS 展示共用参数；范例不记录或保存输入内容。
            </p>
            <CodeBlock>{`let version = 1;
const initial = "https://example.com/?v=" + version;
await this.dialog({
  title: "QR Code 范例",
  message: initial,
  qrcode: initial,
  copyable: true,
  buttons: [{id: "refresh", label: "更新", close: false}, {id: "close", label: "关闭"}]
}, async ({button}) => {
  if (button !== "refresh") return;
  await this.net.sleep(250);
  const content = "https://example.com/?v=" + (++version);
  return {qrcode: content, message: content};
});`}</CodeBlock>
            <p>
              QR Code 在本机产生，内容不必是网址。message、QR Code、图片与输入栏共用卷动区域。
              copyable 为 true 且 message 非空时提供拷贝全文按钮；拷贝不关窗，也不触发 callback。
              callback 更新 message 后拷贝的是最新全文，保留换行与前导零。
              要拷贝 QR Code 原始内容，可将相同字符串填入 message；省略 qrcode 即可显示纯文本。
            </p>
            <CodeBlock>{`const result = await this.dialog({
  title: "表单范例",
  cancelable: true,
  inputs: [
    {name: "text", label: "内容", helperText: "可输入多行文本，换行会保留", type: "textarea", enabled: false, required: true, maxLength: 80},
    {name: "choice", label: "选项", type: "select", required: true,
      options: [{value: "first", label: "选项一"}, {value: "second", label: "选项二"}]},
    {name: "choices", label: "多选", type: "multiselect", required: true, maxItems: 2,
      options: [{value: "first", label: "选项一"}, {value: "second", label: "选项二"}, {value: "third", label: "选项三"}]}
  ],
  buttons: [
    {id: "fill", label: "带入范例", close: false, validate: []},
    {id: "confirm", label: "确认", enabled: false},
    {id: "error", label: "错误提示", close: false, validate: []}
  ]
}, async ({button}) => {
  await this.net.sleep(250);
  if (button === "fill") return {
    values: {text: "范例内容", choice: "first", choices: ["first", "second"]},
    inputs: [{name: "text", enabled: true}],
    buttons: [{id: "confirm", enabled: true}]
  };
  if (button === "error") return {errors: {text: "这是字段错误提示示范"}};
  return {close: true};
});
if (result === null) return {};
const text = result.values.text;`}</CodeBlock>
            <p>
              宿主只负责显示表单与回传；按钮用途、站点请求及业务验证由爬虫决定。
              callback 可回传 message／qrcode／image 更新显示内容、values 更新字段值、errors 显示字段错误，close 覆盖按钮的关窗设置。
              有非空字段错误时保留窗口与输入值；回传 null／None 沿用按钮设置，QuickJS 也可回传 undefined。
            </p>
            <p>
              回呼期间停用字段与按钮并显示处理中，结束后恢复各自的 enabled 设置。
              可修正的字段错误用 errors 显示；回呼抛出例外时会关窗并回报错误。
            </p>
            <p>
              cancelable 缺省 true，允许返回或点外侧取消；false 时两种操作都不取消。
              缺省取消按钮、页面销毁及调用取消仍会清理窗口。
            </p>
            <p>
              textarea 保留换行；select 显示 label，回传所选 value，长度验证也依 value 计算。
              multiselect 打开原生勾选清单，确认后才套用，取消保留原值；回传依 options 顺序排列的字符串数组。
            </p>
            <p>
              上下键移动焦点，多行输入在首尾行才移出字段；确认键打开单选／多选清单，返回后回到原字段。
            </p>
            <p>
              values 只更新指定字段，空字符串可清空文本或取消单选，空数组可清空多选。
              整批 values 先核对字段、类型与选项再套用，未知字段、类型错误、不存在或重复的选项会关窗并回报错误。
              更新不触发 callback，必填与长度检查仍在按钮操作时运行；带入或重设按钮可设 validate:[]。
              更新字段会清除其旧错误，同次回传的 errors 随后套用；关窗结果包含更新后的 values。
            </p>
            <p>
              回传 inputs 数组以 name、buttons 数组以 id 指定既有控制项，只更新 enabled；省略保持原值。
              未知控制项、重复更新或无效布尔值会关窗并回报错误；布尔参数不接受字符串或数字。
              停用字段略过内置验证，values 仍包含其值。
            </p>
            <p>
              回传 qrcode 可更新或添加 QR Code；省略 qrcode 保留原 QR Code，提供时须为可编码的非空白字符串，否则关窗并回报错误。
              更新 QR Code 保留输入值；按钮设置 close:false 或回传 close:false 可继续操作。
            </p>
            <p>
              等待输入暂停目前调用及 App 工作的期限，callback 运行及 QuickJS 等待 Promise 时恢复计时；网络期限照常生效。
            </p>
            <CodeBlock>{`const first = await this.dialog({
  title: "第一步",
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAwCAIAAABhdOiYAAAAbklEQVR4nO3QwQkAIAwEQUuzdDvTDgQJRtE59hsIU1qtmlSOf3B5gAABAvQlUF8ZIECAAAHKFUm7BQQIECBAgAABAgToKaDIAAECBAjQZqC0W0CAAAECBAgQIECAAAECBAgQIAECBAjQLQECFGsAofuPsjrQFugAAAAASUVORK5CYII=",
  inputs: [{name: "text", label: "内容", helperText: "确认后进入下一步", required: true}]
});
if (first === null) return {};
const second = await this.dialog({
  title: "第二步",
  message: first.values.text,
  copyable: true
});
if (second === null) return {};`}</CodeBlock>
            <p>
              连续对话框依序调用即可，QuickJS 使用 await；前一个窗口完成关闭后才回传。
              每一步都检查 null／None，可在取消时停止后续步骤；步骤与数据传递由爬虫控制。
            </p>
            <p>
              image 接收爬虫提供的 base64 图片 data URI，使用 Android 支持的位图片；图片取得由爬虫负责。
              callback 可回传 image 更新图片，省略时保留原图，空字符串移除；解码失败时，尚未结束的 dialog 会关窗并回报错误。
              关窗会取消并释放该图片请求。
            </p>
            <p>
              helperText 显示字段说明，错误清除后会恢复显示。
            </p>
            <p>
              手机验证可把 phone 与 code 放在同一表单，发码按钮使用 <code>close: false</code> 与 <code>{'validate: ["phone"]'}</code>。
              登录成功后关窗，确认 dialog 回传后才保存凭据；取消时不套用登录结果。验证码保持字符串，保留前导零。
            </p>
            <p>
              JAR 自己的 <code>com.github.catvod.spider.Init.init(Context)</code>
              是可选的初始化入口，与 <code>Runtime</code> 分开；每个爬虫仍由 App
              调用 <code>Spider.init(Context, ext)</code>。
            </p>
          </section>
          <section id="result">
            <h2>Result 回传格式</h2>
            <div className="schema-grid">
              <article>
                <h3>探索类</h3>
                <CodeBlock label="JSON / Result" path="homeContent · categoryContent">
                  {resultExplore}
                </CodeBlock>
                <p>
                  <code>homeContent</code> 使用 class /
                  filters；列表、搜索、详情使用 list。filters
                  第一层键必须等于分类的 type_id 值，本例是 movie。
                </p>
              </article>
              <article>
                <h3>播放类</h3>
                <CodeBlock label="JSON / Result" path="playerContent">
                  {resultPlay}
                </CodeBlock>
                <p>
                  <code>url</code> 是内核字段；<code>parse=0</code>{" "}
                  表示此字段未要求解析，但 <code>jx=1</code>{" "}
                  或配置旗标比对仍可能触发解析。
                </p>
              </article>
            </div>
            <h3>完整 Result 字段</h3>
            <FieldTable fields={resultFields} label="Result" />
            <h3>url 的多画质写法</h3>
            <p>
              单一 URL
              见上方播放范例。数组必须以「名称、URL」成对排列，不是单纯的 URL
              清单；也可改用 values 对象。顶层 position 是毫秒，Url.position
              则是从 0 起算的画质索引，实际选取仍会由 App 调整。
            </p>
            <div className="schema-grid">
              <article>
                <h3>名称与 URL 成对数组</h3>
                <CodeBlock label="JSON / Result" path="playerContent">{`{
  "parse": 0,
  "url": [
    "主画质", "https://example.com/video/main.m3u8",
    "低画质", "https://example.com/video/low.m3u8"
  ]
}`}</CodeBlock>
              </article>
              <article>
                <h3>Url 对象</h3>
                <CodeBlock label="JSON / Result" path="playerContent">{`{
  "parse": 0,
  "url": {
    "values": [
      { "n": "主画质", "v": "https://example.com/video/main.m3u8" },
      { "n": "低画质", "v": "https://example.com/video/low.m3u8" }
    ],
    "position": 0
  }
}`}</CodeBlock>
              </article>
            </div>
            <p>
              <code>drm</code> 的子字段请参考
              <Link className="inline-link" href="/config#common">
                共用对象字典
              </Link>
              ；详情的播放分组见 <Link className="inline-link" href="/spider#episodes">集数格式</Link>。
            </p>
          </section>
          <section id="objects">
            <h2>数据对象</h2>
            <p>
              演员或分类超链接使用 Java 的 <code>Json.link(name, target)</code>、
              Python 的 <code>self.link(name, target)</code> 或 QuickJS 的 <code>link(name, target)</code>。
              target 包含目标分类及筛选，可用 id、name、type_flag、filter。
            </p>
            <div className="object-grid">
              {objectGroups.map((group) => (
                <article key={group.name}>
                  <h3>{group.name}</h3>
                  <dl>
                    {group.fields.map(([name, description]) => (
                      <div key={name}>
                        <dt>{name}</dt>
                        <dd>{description}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          </section>
          <section id="episodes">
            <h2>播放分组与集数</h2>
            <div className="delimiter-grid">
              <div>
                <b>$$$</b>
                <span>分隔播放分组</span>
              </div>
              <div>
                <b>#</b>
                <span>分隔同组集数</span>
              </div>
              <div>
                <b>$</b>
                <span>分隔集数名称与 id</span>
              </div>
            </div>
            <CodeBlock
              label="JSON / Vod fields"
              path="list[] 中的 Vod 字段片段"
            >{`{
  "vod_play_from": "主线路$$$备用线路",
  "vod_play_url": "第 01 集$demo://ep/1#第 02 集$demo://ep/2$$$第 01 集$backup://ep/1"
}`}</CodeBlock>
            <p>
              用户点击某集后，<code>$</code> 右侧的 value 会成为{" "}
              <code>playerContent(flag, id, …)</code> 的 <code>id</code>。
            </p>
          </section>
          <section id="episode-selection">
            <h2>指定播放</h2>
            <p>
              推荐、分类与搜索的 <code>list[]</code> 项目可用选填字符串 <code>vod_play_id</code> 指定集数，不限 folder。
              <code>vod_id</code> 维持作品 ID，<code>vod_remarks</code> 只显示角标。
            </p>
            <CodeBlock label="JSON / 列表项目" path="list[] 中的 Vod 项目">{`{
  "list": [{
    "vod_id": "demo-01",
    "vod_name": "示范视频",
    "vod_remarks": "看到第4集",
    "vod_play_id": "episode-4"
  }]
}`}</CodeBlock>
            <p>
              上例对应详情的 <code>第4集$episode-4</code>；以 <code>$</code> 右侧的播放值为准。
              也可填 <code>第4集</code>、<code>第04集</code>、<code>EP04</code> 或 <code>4</code>，数字为集数，非索引。
              Java 用 <code>{'.playId("episode-4")'}</code>；Python／QuickJS 填同名字段。
            </p>
            <ul>
              <li>先精确比对所有线路的原始 ID，再于各线路按完整集名、集数与文本相符程度选集；集名沿用 App 转字规则。</li>
              <li>每阶段优先本机历史线路，其余依详情顺序；找不到则提示重选，不改播第一集或其他来源。</li>
              <li>指定值优先于本机选集，只生效一次；同 ID 保留本机进度，换 ID 清除进度，不含官方观看秒数。</li>
              <li>省略、null 或空字符串维持续播；folder 仍依列表名称选集。</li>
            </ul>
          </section>
          <section id="proxy">
            <h2>Proxy 回传</h2>
            <CodeBlock label="JSON / Proxy 数组" path="proxy(params)">{`[
  200,
  "text/plain; charset=utf-8",
  "demo response",
  { "Cache-Control": "no-cache" }
]`}</CodeBlock>
            <p>
              上例是 Python／QuickJS
              一般数组模式：状态码、Content-Type、内容、选填标头。三语言的入口统一为{" "}
              <code>proxy(params)</code>；Python 第三格也可直接回传 bytes。
            </p>
            <p>
              params 是一个扁平的字符串键值集合：Java 为 Map、Python 为 dict、QuickJS 为对象。
              请求参数、HTTP 标头与文件信息依序合并，后者覆写同名字段；也会包含 do／siteKey。
              来源依需要读取 url、id、type 等字段，网址参数已由 HTTP 层解码。
            </p>
            <p>
              Python／QuickJS 的回应 headers 接受字符串或字符串数组，多值以逗号与空格合并；一般与串流回应使用相同规则，无效类型会回报错误。
            </p>
            <p>
              Java 的一般 <code>Object[]</code> 回传格式中，第三格必须是{" "}
              <code>InputStream</code>，第四格标头选填，不能直接放字符串或
              bytes；也可只回传一格 <code>NanoHTTPD.Response</code>。QuickJS 使用上述数组模式；Node Proxy
              则直接转接 HTTP 回应。
            </p>
            <p>
              使用 <code>proxyUrl(params, local)</code> 产生网址，Python／QuickJS 分别用{" "}
              <code>self.proxyUrl</code>／<code>this.proxyUrl</code>。
              App 自动加入 <code>do</code>、<code>siteKey</code> 并编码参数，params 不可覆写两者。JAR 模式没有
              siteKey 时会找{" "}
              <code>com.github.catvod.spider.Proxy.proxy(Map)</code> 静态入口。
            </p>
            <p>
              params 的键和值都须为字符串，不自动转型；省略 params 或传入 null／None 时视为空集合。
              local 只接受布尔，缺省 true 使用本机，false 使用局域网路 IP；Python 可写{" "}
              <code>self.proxyUrl(params, local=False)</code>。
            </p>
          </section>
          <section id="live-danmaku">
            <h2>即时弹幕</h2>
            <p>
              Java／Python／QuickJS 的播放回应沿用 <code>danmaku: [&#123;name, url&#125;]</code>。
              即时来源的 url 用 <code>danmakuUrl(id)</code> 产生，Python 使用{" "}
              <code>self.danmakuUrl(id)</code>；App 会调用该站点的 <code>danmaku(id, emit)</code>。
              HTTP(S) 来源仍按弹幕文件加载。
            </p>
            <CodeBlock label="JSON / 即时弹幕" path="emit(item)">{`{
  "text": "即时弹幕",
  "color": 6737151,
  "size": 25,
  "type": 1,
  "colors": [6737151, 13408767]
}`}</CodeBlock>
            <FieldTable fields={liveDanmakuFields} label="即时弹幕" />
            <p>
              状态也使用 <code>emit</code>，不可同时包含 text。
              state 为 ready（订阅可用）、retrying（恢复中）或 error（终止失败）；
              msg 选填，最多 512 字符，不放 Cookie、token 或签名网址。
              ready 须确认平台订阅可用，不能仅以 WebSocket open 判断。
            </p>
            <CodeBlock label="JSON / 订阅状态" path="emit(item)">{`{
  "state": "retrying",
  "msg": "连接中断，等待恢复"
}`}</CodeBlock>
            <p>
              App 自行设置 connecting、合并相同 state／msg；初始化例外转成 error。
              error 后停止订阅并忽略后续回呼，主动停止则清除状态，不需回报 closed。
              状态记录在日志，不会当成弹幕或反复跳出提示。
            </p>
            <p>
              <code>emit</code> 接收 Java JSONObject、Python dict 或 QuickJS 对象；Java 用{" "}
              <code>emit.accept(item)</code> 并回传 AutoCloseable，Python／QuickJS 回传停止函数。
              切台或关闭时，App 调用停止；爬虫须取消自己的连接与心跳。
            </p>
            <p>
              爬虫负责协定、解码与样式转换，App 负责显示限制，超量或过期消息可能丢弃。
              完整范例见 CatVodSpider 的三语言 Demo。
            </p>
          </section>
          <section id="timeshift">
            <h2>直播回看</h2>
            <p>
              来源支持依时间取源时，在播放回应或直播列表的 <code>Channel</code> 加入 <code>timeshift</code>。
              App 会显示可拖曳的时间轴，最右侧为直播。
            </p>
            <CodeBlock label="JSON / Result" path="playerContent">{`{
  "parse": 0,
  "url": "https://example.com/live.flv",
  "timeshift": {
    "url": "https://example.com/replay?time={time}",
    "start": 1792700000000,
    "window": 7200000
  }
}`}</CodeBlock>
            <p>
              <code>start</code> 是本场直播开始的 Unix 毫秒，<code>window</code> 是最多可回看的毫秒数。
              时间轴从本场开始累加，最长不超过 window；可用范围由来源决定。
            </p>
            <p>
              App 将网址的 <code>{"{time}"}</code> 换成目标 Unix 毫秒后 GET；0 表示重新取得直播来源。
              端点回传直接播放的 <code>url</code>，并可附上 <code>header</code> 与 <code>format</code>。
              使用本地代理时，以 <code>proxyUrl</code> 产生网址。
            </p>
            <p>
              连续拖曳或切台会取消旧请求；失败时提示并保留目前播放。
              回看期间暂停爬虫即时弹幕，回到直播后恢复。
              从节目表选取回看则使用 <Link className="inline-link" href="/config#catchup"><code>catchup</code></Link>，时间轴以该节目为范围。
            </p>
          </section>
          <section id="skips">
            <h2>片段跳过</h2>
            <p>
              在每集的 <code>playerContent</code> 回应顶层加入 <code>skips</code>：
            </p>
            <CodeBlock label="JSON / Result" path="playerContent">{`{
  "parse": 0,
  "url": "https://example.com/video.m3u8",
  "skips": [
    {"type": "opening", "start": 0, "end": 90000},
    {"type": "middle", "start": 600000, "end": 630000},
    {"type": "ending", "start": 1200000}
  ]
}`}</CodeBlock>
            <p>
              <code>opening</code> 为片头、<code>middle</code> 为片中、<code>ending</code> 为片尾。
              时间单位是毫秒；<code>start</code> 是开始跳过的时间，<code>end</code> 是要跳到的时间。
              上例片中会从 10:00 跳到 10:30。
            </p>
            <p>
              片头与片中必填 end，且须晚于 start；片中可提供多段。
              片尾可在 start 大于 0 时省略 end，表示换下一集，没有下一集则跳到片尾。
            </p>
            <p>
              用户手动设置的片头或片尾会优先套用；片中跳过不受影响。
            </p>
          </section>
          <section id="web">
            <h2>开网页</h2>
            <p>
              卡片的 <code>action</code> 触发后，在回应顶层提供 <code>web</code>。
            </p>
            <div className="schema-grid">
              <article>
                <h3>一般网页</h3>
                <CodeBlock label="JSON / Result" path="action">{`{
  "web": {
    "url": "https://example.com/"
  }
}`}</CodeBlock>
              </article>
              <article>
                <h3>独立内容窗口</h3>
                <CodeBlock label="JSON / Result" path="action">{`{
  "web": {
    "url": "https://example.com/game",
    "mode": "view"
  }
}`}</CodeBlock>
              </article>
            </div>
            <p>
              <code>url</code> 必填，只接受 HTTP 或 HTTPS。<code>mode</code> 省略或填{" "}
              <code>browser</code> 为一般网页；<code>view</code> 为独立内容窗口，
              不启动外部 App，也不会自动全屏幕。两者返回都先退出全屏幕，
              再依网页历史回上一页；没有历史才关闭。
            </p>
            <h3>登录后自动关闭</h3>
            <CodeBlock label="JSON / Result" path="action">{`{
  "web": {
    "url": "https://example.com/login",
    "cookie": [
      {"keys": ["sid", "token"]},
      {"url": "https://login.example.com/", "keys": ["auth"]}
    ]
  }
}`}</CodeBlock>
            <p>
              <code>cookie</code> 为选填数组，每组 url 省略时使用打开网址。同组 keys 必须全部非空，
              不同组任一组完成即可；至少一个指定 Cookie 比打开前改变，且目前页面与该组的
              scheme、host、port 相同，才自动关闭。此条件不代表站点已验证帐号授权。
            </p>
          </section>
          <section id="node">
            <h2>Node.js 加载</h2>
            <p>
              一般 <code>./demo.js</code> 仍由 QuickJS 运行。Node.js 必须以{" "}
              <code>index.js.md5</code> 作为配置入口，同目录提供{" "}
              <code>index.js</code>、<code>index.config.js</code> 与{" "}
              <code>index.config.js.md5</code>。
            </p>
            <p>
              App 启动 bundle 后，读取 <code>/config</code> 回应的{" "}
              <code>video</code> 或 <code>data.video</code>，把{" "}
              <code>video.sites</code> 映射为 <code>node:</code>{" "}
              站点路由。爬虫以 HTTP JSON 处理接在各站点路由后的{" "}
              <code>/init</code>、<code>/home</code>、<code>/category</code>、
              <code>/detail</code>、<code>/search</code> 与 <code>/play</code>。
            </p>
            <p>
              <code>/play</code> 的详情回传格式见 <Link className="inline-link" href="#playback-details">播放详情更新</Link>。
            </p>
            <div className="callout">
              <b>不要只替换 api 前缀</b>Node.js 不使用 QuickJS 的 Spider 子类别入口；
              单独把普通配置的 api 改成 node:，不会完成 Node bundle 初始化。
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  );
}
