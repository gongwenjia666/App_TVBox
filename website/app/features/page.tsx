import type { Metadata } from "next";
import Link from "next/link";
import { DocsLayout } from "../ui";
import { features } from "../feature-content";

export const metadata: Metadata = {
  title: "App 功能",
  description:
    "G.影视 的电视与手机接口、Android Auto、独立模块、爬虫测试、远程控制与文件传输功能。",
};

export default function FeaturesPage() {
  return (
    <DocsLayout
      title="认识 G.影视"
      lead="为 Android 电视与手机设计，加入自己的来源即可开始使用。"
    >
      <div className="wrap feature-page">
        <section className="feature-grid">
          {features.map(([title, meta, copy, id]) => (
            <article key={title} id={id}>
              <h2>{title}</h2>
              <p className="feature-meta">{meta}</p>
              <p className="feature-copy">{copy}</p>
            </article>
          ))}
        </section>
        <section className="start-panel">
          <div>
            <p className="start-label">自订播放控制</p>
            <h2>常用操作，一键运行。</h2>
            <p>
              用指令按钮调整倍速、音量、延迟与视频缩放。
            </p>
          </div>
          <Link className="button" href="/commands">
            查看播放指令 <span aria-hidden="true">→</span>
          </Link>
        </section>
        <section className="start-panel">
          <div>
            <p className="start-label">开始使用</p>
            <h2>第一次使用，从配置开始。</h2>
            <p>
              加入点播或直播配置，加载自己的站点与频道。
            </p>
          </div>
          <Link className="button primary" href="/config">
            查看配置字典 <span>→</span>
          </Link>
        </section>
      </div>
    </DocsLayout>
  );
}
