import Image from "next/image";
import Link from "next/link";
import { assetPath } from "./site-config";
import { QuickSearch } from "./QuickSearch";
import { CodeBlock, Footer, Header } from "./ui";

const tracks = [
  {
    title: "开发爬虫",
    copy: "从 Java、Python 或 QuickJS 范例开始开发。",
    href: "/spider",
    action: "爬虫介接",
  },
  {
    title: "维护配置",
    copy: "从范例设置点播、直播、节目表与网络。",
    href: "/config",
    action: "配置字典",
  },
  {
    title: "使用 G.影视",
    copy: "了解搜索、播放、字幕与个人记录。",
    href: "/features",
    action: "App 功能",
  },
];

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main-content">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="hero-brand">G.影视</p>
            <h1>
              你的影音体验，
              <br />
              从这里开始。
            </h1>
            <p className="hero-lead">
              认识功能、设置来源，开始开发自己的爬虫。
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/config#examples">
                开始配置 <span aria-hidden="true">→</span>
              </Link>
              <Link className="button" href="/features">
                认识 App
              </Link>
            </div>
            <p className="hero-note">Android TV · Android 手机</p>
          </div>
          <div className="hero-identity" aria-hidden="true">
            <Image
              src={assetPath("/logo.svg")}
              alt=""
              width={256}
              height={256}
              priority
            />
          </div>
        </section>
        <section className="track-section wrap" aria-label="文档入口">
          <div className="track-grid">
            {tracks.map((track) => (
              <Link className="track-card" href={track.href} key={track.href}>
                <h2>{track.title}</h2>
                <p>{track.copy}</p>
                <span className="track-action">
                  {track.action}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="search-section wrap">
          <div>
            <p className="section-label">查找文档</p>
            <h2>快速找到需要的说明</h2>
            <p>搜索 API、配置字段或 App 功能。</p>
          </div>
          <QuickSearch />
        </section>
        <section className="contract-section wrap">
          <div>
            <p className="section-label">开发者起点</p>
            <h2>三种语言，共用一份数据格式。</h2>
            <p>
              爬虫取得数据，App 负责呈现。依 Result 格式回传分类、列表与播放信息。
            </p>
          </div>
          <CodeBlock label="JSON / Result" path="homeContent">{`{
  "class": [
    { "type_id": "movie", "type_name": "电影" }
  ],
  "list": [
    {
      "vod_id": "demo-1",
      "vod_name": "范实例目",
      "vod_pic": "https://example.com/poster.jpg",
      "vod_remarks": "示意"
    }
  ]
}`}</CodeBlock>
          <Link className="text-link" href="/spider#result">
            查看完整回传格式 →
          </Link>
        </section>
        <section className="source-strip wrap">
          <div>
            <h2>加入自己的内容来源</h2>
            <p>拷贝范例，替换成你的配置。</p>
          </div>
          <Link className="button" href="/config">
            查看配置指南 →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
