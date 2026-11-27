import type { Metadata } from "next";
import { CodeBlock, DocsLayout } from "../ui";
import { CopyButton } from "../CopyButton";
import { DocsNav } from "../DocsNav";
import {
  playbackSections,
  playbackProperties,
  playbackCommandGroups,
  type PlaybackCommand,
} from "../playback-commands";

export const metadata: Metadata = {
  title: "播放指令",
  description:
    "依功能查找 Exo 与 mpv 支持的播放指令：播放、音量、音轨、字幕、跳转、章节与画面调整。",
};

function CommandTable({ title, commands }: { title: string; commands: readonly PlaybackCommand[] }) {
  return (
    <div className="table-scroll">
      <table className="method-table command-examples" aria-label={title + "指令"}>
        <thead>
          <tr><th scope="col">功能</th><th scope="col">指令</th><th scope="col">说明</th></tr>
        </thead>
        <tbody>
          {commands.map(([name, command, description]) => (
            <tr key={command}>
              <td data-label="功能">{name}</td>
              <td data-label="指令">
                <div className="command-example">
                  <code>{command}</code>
                  <CopyButton text={command} label={name + "指令"} />
                </div>
              </td>
              <td data-label="说明">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CommandsPage() {
  return (
    <DocsLayout title="播放指令" lead="依功能找到需要的指令，拷贝后存成播放按钮。">
      <div className="docs-layout wrap">
        <DocsNav items={playbackSections} />
        <div className="docs-content">
          <section id="start">
            <h2>添加指令按钮</h2>
            <ol>
              <li>播放时，打开控制列的「指令」。</li>
              <li>按「添加」，填入名称、粘贴指令。</li>
              <li>保存后，按一下即可运行。</li>
            </ol>
            <p>
              mpv：进入「脚本」→「按钮」→「添加」→「添加指令按钮」。
              每个按钮填一条指令，不需加上 <code>mp.commandv(...)</code>。
            </p>
            <p>各区块会标示支持的播放器；表内指令可直接拷贝。</p>
          </section>

          {playbackCommandGroups.map((group) => (
            <section id={group.id} key={group.id}>
              {group.id === "playback" && <><span id="examples" /><span id="properties" /></>}
              <h2>{group.title}</h2>
              <p><b>支持：{group.support}。</b> {group.description}</p>
              <CommandTable title={group.title} commands={group.commands} />
              {playbackProperties.filter((property) => group.properties.includes(property.name)).map((property) => (
                <p id={property.name} key={property.name}>
                  <code>{property.name}</code>：{property.values}。支持 {property.modes.join("、")}。
                  {property.description}
                </p>
              ))}
              {group.notes.map((note) => <p key={note}>{note}</p>)}
            </section>
          ))}

          <section id="cycle-values">
            <h2>轮切语法</h2>
            <p>
              <code>cycle-values 属性 值1 值2</code> 依目前值轮切，末项后回到首项。
              Exo 支持各区块列出的共用属性；目前值不在清单时，从首项开始。
            </p>
            <p>
              加上 <code>!reverse</code> 反向切换；目前值不在清单时，从末项开始。
            </p>
            <CodeBlock label="指令" path="反向倍速轮切">
              {"cycle-values !reverse speed 1 1.25 1.5 2"}
            </CodeBlock>
            <p>
              Exo 会先检查整份清单，任一值无效就不运行。
              Exo 的 <code>cycle</code> 支持 <code>pause</code>、<code>aid</code> 与 <code>audio</code>。
              音轨可加上 <code>up</code> 或 <code>down</code> 指定方向。属性名称请用小写。
            </p>
          </section>

          <section id="limits">
            <h2>使用限制</h2>
            <div className="callout">
              <b>功能取决于目前视频</b>
              <span>未播放或视频不支持该操作时，会提示「目前播放无法运行此指令」。</span>
            </div>
            <p>Exo 不支持分号串接、额外前缀或 seek 旗标。</p>
            <p>Lua 插件与 <code>mpv.conf</code> 仅限 mpv，可自行导入插件。</p>
            <p>共用属性的数值范围以 Exo 为准；mpv 依原生规则，音量与循环行为可能不同。</p>
          </section>
        </div>
      </div>
    </DocsLayout>
  );
}