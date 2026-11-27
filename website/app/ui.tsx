import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "./SiteNav";
import { assetPath } from "./site-config";
export { CodeBlock } from "./CodeBlock";

export function Header() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link className="brand" href="/" aria-label="G.影视 首页">
            <Image
              src={assetPath("/logo.svg")}
              alt=""
              width={32}
              height={32}
              priority
            />
            <b>G.影视</b>
            <span className="brand-caption">使用与开发指南</span>
          </Link>
          <SiteNav />
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <Link className="brand" href="/">
          <Image src={assetPath("/logo.svg")} alt="" width={26} height={26} />
          <b>G.影视</b>
        </Link>
        <p>G.影视 基于 <a className="inline-link" href="https://github.com/FongMi/TV">FongMi/TV</a> 二次打包，App 本身不内置或提供任何内容来源。</p>
        <a href="#top">回到顶端 ↑</a>
      </div>
    </footer>
  );
}

export function DocsLayout({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell" id="top">
      <Header />
      <main id="main-content">
        <section className="docs-hero wrap">
          <h1>{title}</h1>
          <p>{lead}</p>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
