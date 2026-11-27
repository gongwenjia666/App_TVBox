import type { Metadata } from "next";
import Link from "next/link";
import { FieldTable } from "../FieldTable";
import { DocsNav } from "../DocsNav";
import {
  vodTop,
  siteFields,
  parseFields,
  liveFields,
  channelFields,
  commonFields,
  coreFields,
} from "../config-fields";
import { CodeBlock, DocsLayout } from "../ui";

export const metadata: Metadata = {
  title: "配置字典",
  description: "VodConfig、LiveConfig 与相关对象的完整字段说明。",
};

const examples = {
  vod: `{
  "spider": "./spider.jar",
  "sites": [
    {
      "key": "java_demo",
      "name": "Java Demo",
      "type": 3,
      "api": "csp_Demo"
    },
    {
      "key": "py_demo",
      "name": "Python Demo",
      "type": 3,
      "api": "./demo.py"
    },
    {
      "key": "js_demo",
      "name": "QuickJS Demo",
      "type": 3,
      "api": "./demo.js",
      "ext": { "region": "tw" }
    }
  ],
  "parses": [
    {
      "name": "JSON 解析范例",
      "type": 1,
      "url": "https://example.com/parse?url=",
      "ext": {
        "flag": ["demo"],
        "header": { "User-Agent": "ExampleClient/1.0" }
      }
    }
  ]
}`,
  depot: `{
  "urls": [
    { "name": "同目录配置", "url": "./vod.json" },
    { "name": "远程配置", "url": "https://example.com/vod.json" }
  ]
}`,
  externalArrays: `{
  "doh": "./doh.json",
  "headers": [
    "./headers.json",
    {
      "host": "media.example.com",
      "header": { "Referer": "https://example.com/" }
    }
  ],
  "proxy": "./proxy.json",
  "rules": [
    "./rules.json",
    {
      "name": "媒体请求范例",
      "hosts": ["player.example.com"],
      "regex": [".*m3u8.*"],
      "exclude": [".*preview.*"]
    }
  ]
}`,
  site: `{
  "key": "js_demo",
  "name": "QuickJS Demo",
  "type": 3,
  "api": "./demo.js",
  "ext": { "region": "tw" },
  "searchable": 1,
  "changeable": 1,
  "categories": ["电影", "戏剧"],
  "header": { "User-Agent": "ExampleClient/1.0" },
  "style": { "type": "rect", "ratio": 1.33 }
}`,
  parse: `[
  {
    "name": "WebView 解析范例",
    "type": 0,
    "url": "https://example.com/web?url="
  },
  {
    "name": "JSON API 解析范例",
    "type": 1,
    "url": "https://example.com/api?url=",
    "ext": {
      "flag": ["demo"],
      "header": { "Referer": "https://example.com/" }
    }
  }
]`,
  liveExternal: `{
  "lives": [
    {
      "name": "M3U 范例",
      "url": "./live.m3u",
      "epg": "https://example.com/epg.xml",
      "logo": "https://example.com/logo/{id}.png",
      "ua": "ExampleClient/1.0",
      "timeZone": "Asia/Taipei",
      "boot": false
    }
  ]
}`,
  liveInline: `{
  "lives": [
    {
      "name": "内嵌 JSON 范例",
      "groups": [
        {
          "name": "新闻",
          "channel": [
            {
              "name": "范例一台",
              "number": "1",
              "tvgId": "demo-1",
              "urls": [
                "https://example.com/live/main.m3u8$主线",
                "https://example.com/live/backup.m3u8$备线"
              ],
              "header": { "Referer": "https://example.com/" }
            }
          ]
        }
      ]
    }
  ]
}`,
  jsonLive: `[
  {
    "name": "新闻",
    "channel": [
      {
        "name": "范例一台",
        "number": "1",
        "tvgId": "demo-1",
        "urls": [
          "https://example.com/live/main.m3u8$主线",
          "https://example.com/live/backup.m3u8$备线"
        ]
      }
    ]
  }
]`,
  m3u: `#EXTM3U url-tvg="https://example.com/epg.xml"
#EXTINF:-1 tvg-id="demo-1" tvg-name="范例一台" tvg-chno="1" tvg-logo="https://example.com/logo/demo-1.png" group-title="新闻",范例一台
#EXTVLCOPT:http-user-agent=ExampleClient/1.0
#EXTVLCOPT:http-referrer=https://example.com/
https://example.com/live/demo.m3u8`,
  txt: `新闻,#genre#
ua=ExampleClient/1.0
referer=https://example.com/
format=hls
范例一台,https://example.com/live/main.m3u8$主线#https://example.com/live/backup.m3u8$备线`,
  core: `{
  "name": "特殊内核示意",
  "url": "./live.m3u",
  "core": {
    "auth": "https://example.com/core/auth",
    "name": "demo",
    "pass": "demo-pass",
    "broker": "https://example.com/core/broker",
    "domain": "example.com",
    "so": "https://example.com/core/libcore.so",
    "option": []
  }
}`,
  shared: `{
  "doh": [
    {
      "name": "Example DoH",
      "url": "https://dns.example.com/dns-query",
      "ips": ["203.0.113.53"]
    }
  ],
  "proxy": [
    {
      "name": "本机代理范例",
      "hosts": ["media.example.com"],
      "urls": ["http://127.0.0.1:8080", "socks5://127.0.0.1:1080"]
    }
  ],
  "hosts": ["media.example.com=203.0.113.10"],
  "ads": ["ads.example.com"]
}`,
  catchup: `{
  "name": "节目回看示意",
  "url": "./live.m3u",
  "catchup": {
    "type": "append",
    "days": "7",
    "regex": "example.com/live/",
    "source": "?playseek=\${(b)yyyyMMddHHmmss}-\${(e)yyyyMMddHHmmss}",
    "replace": "live/,archive/"
  }
}`,
};

export default function ConfigPage() {
  return (
    <DocsLayout
      title="配置字典"
      lead="从范例设置点播与直播，再查阅字段用途、默认值与格式。"
    >
      <div className="docs-layout wrap">
        <DocsNav items={[
          ["examples", "完整范例"],
          ["vod", "Vod 顶层"],
          ["site", "Site"],
          ["parse", "Parse"],
          ["live", "Live"],
          ["channel", "Group / Channel"],
          ["formats", "直播格式"],
          ["core", "Core"],
          ["common", "共用对象"],
        ]} />
        <div className="docs-content">
          <section id="examples">
            <h2>拷贝配置范例</h2>
            <p>
              选择点播或直播范例，换成自己的名称与网址。标示为「对象片段」的范例，需放入对应字段。
            </p>
            <div className="callout">
              <b>范例路径</b>
              <span>
                主配置的 <code>./</code> 与 <code>../</code> 以配置档位置为基准；
                外部数组与直播列表内请用完整网址。<code>example.com</code> 与测试 IP 仅供示意。
              </span>
            </div>
            <div className="schema-grid">
              <article>
                <h3>点播配置：Java、Python、QuickJS</h3>
                <CodeBlock label="JSON / VodConfig" path="vod.json">
                  {examples.vod}
                </CodeBlock>
                <p>
                  Java 使用 <code>csp_</code> 类别名称；Python 与 QuickJS 文件使用{" "}
                  <code>./</code> 相对路径。
                </p>
              </article>
              <article>
                <h3>直播配置：外部 M3U</h3>
                <CodeBlock label="JSON / LiveConfig" path="live-config.json">
                  {examples.liveExternal}
                </CodeBlock>
                <p>
                  <code>url</code> 也可改成 <code>./live.txt</code> 或{" "}
                  <code>./live.json</code>；内容格式会由 LiveParser 判断。
                </p>
              </article>
            </div>
          </section>
          <section id="vod">
            <h2>VodConfig 顶层字段</h2>
            <p>
              <code>headers</code>、<code>proxy</code>、<code>rules</code> 与 <code>doh</code>
              支持对象数组、外部 JSON 数组网址，或两者混用。
            </p>
            <FieldTable fields={vodTop} label="VodConfig" />
            <div className="schema-grid">
              <article>
                <h3>配置仓库 Depot</h3>
                <CodeBlock label="JSON / Depot" path="depot.json">
                  {examples.depot}
                </CodeBlock>
                <p>
                  顶层出现 <code>urls</code> 时，App
                  登记清单后会加载第一项配置，清单不可为空；每一项包含{" "}
                  <code>name</code> 与 <code>url</code>。
                </p>
              </article>
              <article>
                <h3>可引用外部数组的字段</h3>
                <CodeBlock label="JSON / arrays" path="VodConfig 顶层字段片段">
                  {examples.externalArrays}
                </CodeBlock>
                <p>
                  整个字段可以是一个位置，也可以在数组中混用外部 JSON
                  位置与内嵌对象。外部文件本身必须回传 JSON 数组。
                </p>
              </article>
            </div>
          </section>
          <section id="site">
            <h2>Site 点播站点</h2>
            <div className="type-strip">
              <span>
                <b>0</b>XML HTTP
              </span>
              <span>
                <b>1</b>JSON HTTP
              </span>
              <span>
                <b>3</b>JAR / PY / JS
              </span>
              <span>
                <b>4</b>HTTP 扩充
              </span>
            </div>
            <FieldTable fields={siteFields} label="Site" />
            <h3>Type 3 站点范例</h3>
            <CodeBlock label="JSON / Site" path="sites[] 对象片段">
              {examples.site}
            </CodeBlock>
            <p>
              改用 Python 时只需把 <code>api</code> 换成 <code>./demo.py</code>
              ；Java 类别则填 <code>csp_Demo</code>。相对路径也适用于{" "}
              <code>ext</code> 与 <code>jar</code>。
            </p>
            <p>
              Python、QuickJS 与 Node.js 需先完成{" "}
              <Link className="inline-link" href="/spider#modules">模块安装</Link>
              ，再用{" "}
              <Link className="inline-link" href="/spider#testing">爬虫测试页</Link>
              检查回传结果。
            </p>
          </section>
          <section id="parse">
            <h2>Parse URL 处理规则</h2>
            <FieldTable fields={parseFields} label="Parse" />
            <h3>WebView 与 JSON API 范例</h3>
            <CodeBlock label="JSON / Parse" path="parses 字段值">
              {examples.parse}
            </CodeBlock>
            <p>
              <code>parses</code> 的值是数组；<code>ext.flag</code> 是 type 4
              并行解析的优先比对条件，不是全域白名单。<code>ext.header</code>{" "}
              也可能作为解析结果的缺省播放标头，详见上表。
            </p>
          </section>
          <section id="live">
            <h2>LiveConfig 与直播来源</h2>
            <p>
              独立 LiveConfig 的 JSON 顶层使用 <code>lives</code>，并支持{" "}
              <code>spider</code>、<code>headers</code>、<code>proxy</code>、
              <code>rules</code>、<code>hosts</code>、<code>ads</code>、
              <code>urls</code> 与 <code>msg</code>；不读取独立的{" "}
              <code>doh</code>。下表说明 <code>lives[]</code> 中的 Live
              来源对象。
            </p>
            <p>
              <code>url</code> 与 <code>groups</code> 通常择一；
              <code>groups</code> 为空且提供 <code>api</code> 时，会先调用
              Spider 的 <code>liveContent(url)</code> 取得文本，再交由
              LiveParser 判断格式。
            </p>
            <p>
              同名配置已保存的 <code>boot</code>、<code>pass</code> 与{" "}
              <code>keep</code> 可能覆盖配置值；请同时检查 App 内的已保存设置。
            </p>
            <FieldTable fields={liveFields} label="Live" />
            <div className="schema-grid">
              <article>
                <h3>加载外部列表</h3>
                <CodeBlock label="JSON / LiveConfig" path="live-config.json">
                  {examples.liveExternal}
                </CodeBlock>
                <p>
                  这是含 <code>lives</code> 数组的完整 LiveConfig；
                  <code>url</code> 指向可独立维护的 M3U、TXT 或 JSON 文件。
                </p>
              </article>
              <article>
                <h3>直接内嵌 Group / Channel</h3>
                <CodeBlock label="JSON / LiveConfig" path="live-config.json">
                  {examples.liveInline}
                </CodeBlock>
                <p>
                  <code>$主线</code>、<code>$备线</code>{" "}
                  是线路标签；同一频道可以提供多个位置。直接内嵌 groups
                  不经外部列表的自动编号与默认值继承，请在 Channel
                  明确设置需要的字段。
                </p>
              </article>
            </div>
          </section>
          <section id="channel">
            <h2>分组与频道字段</h2>
            <FieldTable fields={channelFields} label="Group / Channel" />
            <p>
              若 JSON 是由 <code>Live.url</code> 加载，文件最外层直接放 Group
              数组，如下一节的 JSON 范例；若写在主配置内，则放进{" "}
              <code>lives[].groups</code>。
            </p>
          </section>
          <section id="formats">
            <h2>直播列表的三种完整输入</h2>
            <div className="schema-grid">
              <article>
                <h3>JSON</h3>
                <CodeBlock label="JSON / Group[]" path="live.json">
                  {examples.jsonLive}
                </CodeBlock>
                <p>最外层是 Group 数组，适合完整保存频道字段与多线路。</p>
              </article>
              <article>
                <h3>M3U</h3>
                <CodeBlock label="M3U" path="live.m3u">
                  {examples.m3u}
                </CodeBlock>
                <p>
                  支持节目表、分组、频道 ID、号码、Logo、User-Agent 与 Referer。
                </p>
              </article>
              <article>
                <h3>TXT</h3>
                <CodeBlock label="TXT" path="live.txt">
                  {examples.txt}
                </CodeBlock>
                <p>
                  <code>#genre#</code> 创建分组；同一频道的多个位置使用{" "}
                  <code>#</code> 分隔。
                </p>
              </article>
            </div>
            <div className="callout">
              <b>TXT / M3U 设置行</b>
              <code>
                ua= · parse= · click= · header= · format= · origin= · referer= ·
                forceKey=
              </code>
            </div>
          </section>
          <section id="core">
            <h2>特殊播放内核字段</h2>
            <p>
              <code>Live.core</code>{" "}
              只在对应播放内核初始化时使用；一般直播配置不需要填写。以下示范它在
              Live 对象中的位置；<code>option</code>{" "}
              的名称与值由该内核实作定义，不是通用配置参数。
            </p>
            <FieldTable fields={coreFields} label="Core" />
            <CodeBlock label="JSON / Live.core" path="lives[] 对象片段">
              {examples.core}
            </CodeBlock>
          </section>
          <section id="common">
            <h2>共用对象</h2>
            <FieldTable fields={commonFields} label="共用对象" />
            <div className="schema-grid">
              <article>
                <h3>DoH、Proxy、Hosts 与 Ads</h3>
                <CodeBlock label="JSON / shared" path="VodConfig 顶层字段片段">
                  {examples.shared}
                </CodeBlock>
                <p>
                  代理位置必须包含 scheme、host 与 port；<code>hosts</code> 使用{" "}
                  <code>原主机=目标主机或 IP</code>。
                </p>
              </article>
              <article id="catchup">
                <h3>节目回看 Catchup</h3>
                <CodeBlock label="JSON / Live.catchup" path="lives[] 对象片段">
                  {examples.catchup}
                </CodeBlock>
                <p>
                  <code>{"${(b)yyyyMMddHHmmss}"}</code> 与{" "}
                  <code>{"${(e)yyyyMMddHHmmss}"}</code>{" "}
                  会分别替换为节目开始与结束时间，格式化使用设备系统时区，不使用{" "}
                  <code>Live.timeZone</code>。
                </p>
                <p>
                  <code>catchup</code> 用于从节目表选取回看，时间轴以该节目为范围。
                  来源若支持依时间取源，可在频道提供 <Link className="inline-link" href="/spider#timeshift"><code>timeshift</code></Link>，
                  使用可拖曳的直播时间轴。
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </DocsLayout>
  );
}
