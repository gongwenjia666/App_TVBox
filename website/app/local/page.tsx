import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, DocsLayout } from "../ui";
import { FieldTable } from "../FieldTable";
import { DocsNav } from "../DocsNav";
import {
  localSections,
  localActions,
  localControls,
  localRemoteControls,
  localRemoteFields,
  localRefresh,
  localFileEndpoints,
  localTransferEndpoints,
  localCacheActions,
  localMediaFields,
  localDeviceFields,
  localExamples,
} from "../local-api";

export const metadata: Metadata = {
  title: "本地 API",
  description:
    "G.影视 本地 HTTP API：播放控制、设备信息、文件管理、缓存与同步的参数及范例。",
};

function ReferenceTable({
  label,
  columns,
  rows,
}: {
  label: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="table-scroll">
      <table className="method-table" aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((value, index) => (
                <td key={columns[index]} data-label={columns[index]}>
                  {index === 0 ? <code>{value}</code> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LocalPage() {
  return (
    <DocsLayout
      title="本地 HTTP API"
      lead="通过 App 的局域网路服务，控制播放、管理文件与同步数据。"
    >
      <div className="docs-layout wrap">
        <DocsNav items={localSections} />
        <div className="docs-content">
          <section id="connection">
            <h2>先确认连接地址</h2>
            <p>
              启动 App，使用画面显示的服务地址。端口号从 <code>9978</code> 到 <code>9998</code>，
              取第一个可用的端口。
            </p>
            <div className="callout">
              <b>从其他设备连接</b>
              <span>
                <code>127.0.0.1</code> 指目前设备。从电脑或另一台手机操作时，
                请换成 App 设备的局域网路 IP 与端口号。范例网址与 IP 仅供示意。
              </span>
            </div>
            <CodeBlock
              label="HTTP"
              path="连接测试"
            >{`curl "http://127.0.0.1:9978/device"`}</CodeBlock>
            <p>
              一般参数放在 Query String 或 <code>application/x-www-form-urlencoded</code> 表单，
              不使用整包 JSON body。中文、URL 与 JSON 字符串以 <code>--data-urlencode</code> 编码。
            </p>
            <p>
              <code>/media</code>、<code>/device</code> 与目录列表以 <code>text/plain</code> 回传 JSON。
              其他回应请依实际 Content-Type 处理。
            </p>
            <div className="callout">
              <b>OK 不等于动作已完成</b>
              <span>
                <code>/action</code> 回传 OK 只表示已收到请求；未知指令、缺少参数或没有播放服务时，
                可能不运行。端点没有通用 token 验证，仅限可信任的局域网路使用。
              </span>
            </div>
          </section>

          <section id="action">
            <h2>/action：动作指令</h2>
            <p>
              使用 GET 或表单 POST，以 <code>do</code> 选择操作。
            </p>
            <ReferenceTable
              label="动作参数"
              columns={["do", "参数", "用途"]}
              rows={localActions}
            />
            <h3>播放控制与即时弹幕</h3>
            <ReferenceTable
              label="播放控制指令"
              columns={["type", "用途"]}
              rows={localControls}
            />
            <CodeBlock
              label="HTTP"
              path="播放控制"
            >{`curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=control" --data-urlencode "type=pause"

curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=danmaku" --data-urlencode "text=范例弹幕"`}</CodeBlock>
            <h3>刷新与推送数据</h3>
            <ReferenceTable
              label="刷新类型"
              columns={["type", "额外参数", "用途"]}
              rows={localRefresh}
            />
            <CodeBlock
              label="HTTP"
              path="刷新范例"
            >{`curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=refresh" --data-urlencode "type=category"

curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=refresh" --data-urlencode "type=subtitle" --data-urlencode "path=https://example.com/subtitle.srt"`}</CodeBlock>
            <h3 id="vod-refresh">播放详情更新</h3>
            <p>
              播放详情使用 <code>playerContent</code>／<code>play</code> 回传结果的 <code>list[0]</code>。
              格式与套用时机见 <Link className="inline-link" href="/spider#playback-details">爬虫详情更新</Link>。
            </p>
            <h3>播放、搜索、配置与文件</h3>
            <CodeBlock
              label="HTTP"
              path="推送与设置"
            >{`curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=push" --data-urlencode "url=https://example.com/video.m3u8"

curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=search" --data-urlencode "word=范例"

curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=setting" --data-urlencode "text=https://example.com/vod.json" --data-urlencode "name=示意配置"

curl -G "http://127.0.0.1:9978/action" --data-urlencode "do=file" --data-urlencode "path=/TV/subtitle.srt"`}</CodeBlock>
            <p>
              <code>do=file</code> 依小写扩展名分派：<code>.apk</code>{" "}
              交给安装流程；<code>.srt</code>、<code>.ssa</code>、
              <code>.ass</code>{" "}
              交给字幕流程；其他交给设置流程。它使用设备文件位置，不会把电脑上的文件上传。
            </p>
            <h3>投放既有观看纪录</h3>
            <p>
              <code>config</code> 使用 App 保存的 Config 记录，<code>device</code> 取自目标设备的
              <code>/device</code>，<code>history</code> 沿用既有 History 记录。
              请将范例替换为实际数据，config 不可改填整份站点配置。
            </p>
            <CodeBlock
              label="HTTP"
              path="投放表单"
            >{`curl "http://127.0.0.1:9978/action?do=cast" --data-urlencode 'config={"type":0,"url":"https://example.com/vod.json","name":"示意配置"}' --data-urlencode 'device={"uuid":"demo-android-id","name":"示意电视","ip":"http://192.0.2.10:9978","type":0}' --data-urlencode 'history={"key":"demo@@@demo-1@@@7","vodName":"范实例目","vodFlag":"Demo","vodRemarks":"第 1 集","episodeUrl":"demo://episode/1","position":120000}'`}</CodeBlock>
          </section>

          <section id="sync">
            <h2>/action?do=sync：设备同步</h2>
            <p>
              以表单 POST 发送 JSON 字符串。mode 的方向以收到请求的 App 为准；
              HTTP OK 不代表数据已合并完成。
            </p>
            <ReferenceTable
              label="同步参数"
              columns={["参数", "用途"]}
              rows={[
                ["type", "history＝观看纪录；keep＝收藏。"],
                ["mode", "0＝发送并接收（缺省）；1＝只接收；2＝只发送。"],
                [
                  "device",
                  "mode 0 / 2 发送时使用的目标 Device 对象字符串；没有 device 就不主动发送。",
                ],
                ["force", "字符串 true 才激活先删后合并；未填或其他值不先删除。"],
                [
                  "config",
                  "history 使用的 Config 对象字符串；接收时需要有效 url，可能先加载该配置。",
                ],
                [
                  "targets",
                  "History[] 或 Keep[] 的 JSON 字符串；类型依 type 决定。",
                ],
                [
                  "configs",
                  "keep 使用的 Config[] 对象数组字符串，不是 URL 字符串数组；以来源 id 对应 Keep.cid。",
                ],
              ]}
            />
            <div className="callout">
              <b>force=true 会删除既有数据</b>
              <span>
                history 删除对应配置的观看纪录；keep 删除全部收藏。
                一般同步请省略 force 或填 false。
              </span>
            </div>
            <h3>收藏同步的数据关系</h3>
            <CodeBlock label="JSON / Sync" path="两个表单字段的解码内容">
              {JSON.stringify(localExamples.sync, null, 2)}
            </CodeBlock>
            <p>
              将 <code>configs</code> 与 <code>targets</code> 分别转为 JSON 表单字符串。
              每笔 Keep.cid 须对应所属的 Config.id，合并时会转为本机配置 ID。
            </p>
            <CodeBlock
              label="HTTP"
              path="只接收收藏，不先删除"
            >{`curl "http://127.0.0.1:9978/action?do=sync&type=keep&mode=1&force=false" --data-urlencode 'configs=${JSON.stringify(localExamples.sync.configs)}' --data-urlencode 'targets=${JSON.stringify(localExamples.sync.targets)}'`}</CodeBlock>
            <p>
              观看纪录使用 <code>type=history</code>、单一 <code>config</code>{" "}
              与 History 数组；合并会比较同名项目的
              createTime，不是盲目覆写全部纪录。同步可能加载另一份配置，请先备份个人数据。
            </p>
          </section>

          <section id="remote">
            <h2>网页播放与遥控器</h2>
            <p>
              在浏览器打开 App 的服务网址。「播放」页显示封面、标题与进度，
              可控制播放、切换集数或频道、单集循环、跳转与倍速。
              缺省打开「搜索」页，搜索与网址推送各自保留输入内容及浏览器纪录。
            </p>
            <p>
              拖曳进度滑杆预览时间，放手后跳转；方向键每次调整五秒。
              直播隐藏进度、循环与倍速控制，不能跳转的视频停用滑杆。
              网页提供 0.5×、1.0×、2.0×、3.0× 四个倍速按钮。
            </p>
            <h3 id="navigation">分页网址</h3>
            <p>
              使用语意分页参数；旧数字分页不再对应原页面，未知值会回到搜索页。
              文件页可另带 <code>path</code>，例如 <code>/?tab=files&amp;path=/TV</code>。
            </p>
            <ReferenceTable
              label="网页分页网址"
              columns={["网址", "用途"]}
              rows={[
                ["/?tab=search", "搜索；未指定 tab 时的缺省页。"],
                ["/?tab=push", "网址推送。"],
                ["/?tab=play", "播放控制。"],
                ["/?tab=subtitles", "字幕上传与套用。"],
                ["/?tab=danmaku", "即时弹幕与弹幕来源。"],
                ["/?tab=settings", "配置、设备操作、日志与爬虫测试入口。"],
                ["/?tab=files", "设备文件与传输。"],
              ]}
            />
            <h3>/remote：查找与控制</h3>
            <p>
              GET 查找状态，POST 以表单字段 <code>type</code> 送出指令。
              成功回传 JSON（application/json），禁止缓存；没有本机播放时回传
              <code>{'{"active":false}'}</code>。
              回应不包含播放网址；完整网址由日志信息 API 提供。
              网页仅在播放页位于前景时约每秒查找，返回播放页立即更新。
            </p>
            <CodeBlock label="HTTP" path="查找、设置循环与跳转">
              {`curl "http://127.0.0.1:9978/remote"
curl --data-urlencode "type=repeat_on" "http://127.0.0.1:9978/remote"
curl --data-urlencode "type=repeat_off" "http://127.0.0.1:9978/remote"
curl --data-urlencode "type=seek" --data-urlencode "position=120000" "http://127.0.0.1:9978/remote"
curl --data-urlencode "type=speed" --data-urlencode "speed=1.5" "http://127.0.0.1:9978/remote"`}
            </CodeBlock>
            <ReferenceTable
              label="网页遥控指令"
              columns={["type", "用途"]}
              rows={localRemoteControls}
            />
            <FieldTable label="Remote" fields={localRemoteFields} />
            <p>
              <code>artwork</code> 指向同一服务的 <code>/remote/artwork?key=…</code>，
              成功回传 PNG；浏览器不需发送来源网址、Referer 或 Cookie。
              key 须对应目前封面；更换封面或停止播放后，旧 key 回传 404。
              缺少或格式不正确的 key 为 400；加载逾时为 503，加载或编码失败为 500。
            </p>
            <p>
              既有 <code>/action?do=control&amp;type=repeat</code> 仍为切换循环。
              上一项、下一项及停止可能先派送至播放接口，应以后续 GET 确认结果。
            </p>
            <p>
              <code>seek</code> 的 <code>position</code> 是非负整数毫秒，超过总长时跳到结尾；
              缺少、格式错误或超过 64 比特整数范围时回传 400。
              <code>canSeek</code> 为 false 时回传 409。
              支持 <Link className="inline-link" href="/spider#timeshift">直播回看</Link> 的来源也可跳转，位置以目前回看范围的起点计算。
              <code>speed</code> 必须是 0.1–5.0 范围内的有限数值，否则回传 400；
              <code>canSetSpeed</code> 为 false 时回传 409。
            </p>
            <p>
              缺少或未知指令回传 400，跨来源的浏览器控制请求回传 403；
              无可控制的播放、直播循环或不支持上一项／下一项回传 409。
              不支持的 HTTP 方法回传 405，主线程忙碌或请求中断回传 503。
            </p>
            <h3 id="remote-keys">/remote/key：独立遥控器</h3>
            <p>
              从 App 网页右上角打开 <code>/remote.html</code>，即可操作遥控器。
              返回时会保留原分页与文件目录。
            </p>
            <CodeBlock label="HTTP" path="送出遥控器按键">
              {`curl --data-urlencode "key=ok" "http://127.0.0.1:9978/remote/key"`}
            </CodeBlock>
            <ReferenceTable
              label="遥控器按键参数"
              columns={["POST 表单参数", "说明"]}
              rows={[
                ["key", "up／down／left／right（方向）、ok（确认）、back（返回）、menu（菜单）或 0–9。"],
                ["action", "press＝单按（缺省）。长按依序送 down（按住）、repeat（持续）、up（放开）；取消用 cancel。"],
                ["id", "非 press 必填，限 1–64 个英数字或 -。同次长按沿用相同的 key 与 id。"],
              ]}
            />
            <p>
              单按或开始长按需有前景页面或取得焦点的对话框，否则回传 409。
              成功回传 <code>{'{"accepted":true,"holding":false}'}</code>；holding 为 true 表示仍按住。
            </p>
            <p>
              长按 5 秒未续送 repeat 会自动放开；正常结束仍请送 up 或 cancel。
            </p>
            <h3 id="remote-media">字幕上传与弹幕套用</h3>
            <p>
              先以 GET <code>/remote</code> 取得目前 <code>mediaKey</code>，
              再以 POST 表单的 <code>key</code> 与 <code>path</code> 套用来源。
              字幕须先上传到设备共用保存区，支持 SRT／SSA／ASS；
              弹幕可使用同范围内的既有文件，或 HTTP(S) 网址。
            </p>
            <CodeBlock label="HTTP" path="将 MEDIA_KEY 替换成刚查到的 mediaKey">
              {`curl --data-urlencode "key=MEDIA_KEY" --data-urlencode "path=/TV/subtitle.srt" "http://127.0.0.1:9978/remote/subtitle"
curl --data-urlencode "key=MEDIA_KEY" --data-urlencode "path=https://example.com/danmaku.xml" "http://127.0.0.1:9978/remote/danmaku"`}
            </CodeBlock>
            <p>
              没有可控制的本机播放、直播或已换成另一个播放来源时回传 409；
              key 格式不正确、文件无效或超出允许路径时回传 400。
              这些 POST 与播放控制、按键 API 均检查浏览器 Origin，跨来源请求回传 403。
            </p>
            <h3 id="remote-info">/remote/info：连接状态与设备信息</h3>
            <p>
              点主页连接状态可查看 App 版本、variant、buildType、设备名称、Android 版本、SDK 与 ABI。
              数据由 GET <code>/remote/info</code> 提供，回传 JSON 并禁止缓存；
              与提供设备探索及同步数据的 <code>/device</code> 分开。
              网页脱机时保留最后一次成功读取的信息。
            </p>
          </section>

          <section id="logs">
            <h2>日志下载与分享</h2>
            <p>
              打开 <code>/logs.html</code> 查看日志，自动截取最长 60 分钟。
              「停止截取」停止来源设备的收集；「暂停显示」只暂停画面更新。
            </p>
            <p>
              「下载日志」与「分享日志」导出同一份日志文件，
              包含版本、设备、播放摘要、诊断数据与原始日志。
              浏览器不支持文件分享时改为下载，可从下载项目再分享；读取信息失败可按「重新读取信息」，保留日志。
            </p>
            <p>
              导出不受搜索与等级筛选影响，上限 512 KiB；超限保留较新日志并标示缺漏。
              文件包含导出时间、状态采样时间与日志笔数。
            </p>
            <p>
              手机版的设备清单提供「操作」与「日志」按钮，长按设备名称可命名。
              别名只存于目前手机，依有效设备识别码保留，不受 IP 改变影响；清空即恢复原名。
            </p>
            <h3>日志信息 API</h3>
            <CodeBlock label="HTTP" path="取得日志信息">
              {`curl "http://127.0.0.1:9978/log/info"`}
            </CodeBlock>
            <ReferenceTable
              label="日志信息字段"
              columns={["字段", "用途"]}
              rows={[
                ["version / versionCode / variant / buildType", "应用版本与建置信息。"],
                ["device / android / sdk / abis", "设备与 Android 信息。"],
                ["playback", "播放状态，不含 artwork。"],
                ["playback.url", "解析后的完整网址，保留 query；无来源为空字符串。"],
                ["collection", "日志收集状态，含 READ_LOGS 权限、目前 UID／PID 等诊断信息。"],
                ["playbackLog", "目前播放的诊断采样；无播放器时仍依实际状态回传。"],
                ["lastPlaybackError", "最近一次保存的播放错误，没有错误时可为 null。"],
              ]}
            />
            <p>
              GET 回传 JSON；停止或失败后仍保留来源时，网址也会保留。
              不含封面 URL、UUID、序号或 MAC。
            </p>
          </section>

          <section id="media">
            <h2>/media：播放状态</h2>
            <CodeBlock
              label="HTTP"
              path="查找播放状态"
            >{`curl "http://127.0.0.1:9978/media"`}</CodeBlock>
            <p>
              没有播放服务、播放器已释放，或读取失败时回传 <code>{"{}"}</code>
              。有数据时回传以下结构；Content-Type 是
              text/plain，客户端需自行解析 JSON。
            </p>
            <CodeBlock label="JSON / Media" path="/media 回应">
              {JSON.stringify(localExamples.media, null, 2)}
            </CodeBlock>
            <FieldTable label="Media" fields={localMediaFields} />
          </section>

          <section id="device">
            <h2>/device：设备信息</h2>
            <CodeBlock label="JSON / Device" path="/device 回应">
              {JSON.stringify(localExamples.device, null, 2)}
            </CodeBlock>
            <p>
              内容为 JSON 字符串，Content-Type 是 text/plain。不要把设备识别码或
              MAC 地址填入公开范例；下方只列字段用途。
            </p>
            <FieldTable label="Device" fields={localDeviceFields} />
          </section>

          <section id="files">
            <h2>文件与目录管理</h2>
            <p>
              一般相对路径以 Android 共用外部保存根目录 <code>Path.root()</code>{" "}
              为基准，不是 App 的私有 data 目录；实际访问仍受系统保存权限限制。
            </p>
            <ReferenceTable
              label="文件端点"
              columns={["端点", "使用方式", "参数与行为"]}
              rows={localFileEndpoints}
            />
            <CodeBlock
              label="HTTP"
              path="列目录与创建文件夹"
            >{`curl "http://127.0.0.1:9978/file/TV"

curl -G "http://127.0.0.1:9978/newFolder" --data-urlencode "path=TV" --data-urlencode "name=demo-empty"`}</CodeBlock>
            <CodeBlock label="JSON / Folder" path="浏览 /file/TV 的示意回应">
              {JSON.stringify(localExamples.folder, null, 2)}
            </CodeBlock>
            <ReferenceTable
              label="目录回应字段"
              columns={["字段", "用途"]}
              rows={[
                [
                  "parent",
                  "位于根目录时为 .；上一层是根目录时为空字符串；其他回传上一层相对路径。",
                ],
                ["files[].name", "文件或目录名称。"],
                [
                  "files[].path",
                  "根目录内的路径通常带前导 /，例如 /TV/demo.mp4。",
                ],
                [
                  "files[].time",
                  "最后修改时间，以设备时区格式化为 yyyy/MM/dd HH:mm:ss。",
                ],
                ["files[].dir", "1＝目录；0＝一般文件。"],
              ]}
            />
            <h3>下载、Range 与缓存</h3>
            <p>
              一般下载回传 200；单一有效 Range 回传
              206，支持起迄、开放结尾及尾端字节范围。多段或无效范围回传
              416；If-None-Match 命中 ETag 时回传 304，If-Range
              不符时改回完整文件。
            </p>
            <CodeBlock
              label="HTTP"
              path="读取前 1 KiB"
            >{`curl "http://127.0.0.1:9978/file/TV/demo.mp4" -H "Range: bytes=0-1023" --output demo-part.bin`}</CodeBlock>
            <h3>重命名与搬移</h3>
            <CodeBlock label="HTTP" path="重命名后搬到另一个既有目录">
              {`curl --data-urlencode "path=/TV/subtitle.srt" --data-urlencode "name=demo.srt" "http://127.0.0.1:9978/rename"
curl --data-urlencode "path=/TV/demo.srt" --data-urlencode "target=/TV/subtitles" "http://127.0.0.1:9978/move"`}
            </CodeBlock>
            <p>
              文件与目录均可操作；新名称只是一个名称，不能包含路径分隔符。
              目标已存在时不覆盖，搬移也不能把目录放进自己里面。
              网页提供批量搬移与删除，逐项操作并回报结果。
            </p>
            <h3>一般上传与删除</h3>
            <CodeBlock
              label="HTTP"
              path="上传至已存在的 TV 目录"
            >{`curl "http://127.0.0.1:9978/upload?path=TV" -F "file=@./subtitle.srt"`}</CodeBlock>
            <p>
              multipart 字段名称可自订，上例使用
              file；文件名由上传字段提供，不能是空字符串、.、..
              或包含路径分隔符。ZIP
              会解压到指定目录，其他文件使用原子拷贝；缺少文件、目录不存在或操作失败会回传
              500 与文本消息。
            </p>
            <div className="callout">
              <b>删除端点会直接删除数据</b>
              <span>
                /delFile 与 /delFolder
                目前使用同一段递归删除程序；不要依端点名称假设目录不会被删除。下例只针对先前创建的示意目录，运行前务必确认内容。
              </span>
            </div>
            <CodeBlock
              label="HTTP"
              path="删除示意目录"
            >{`curl -G "http://127.0.0.1:9978/delFolder" --data-urlencode "path=TV/demo-empty"`}</CodeBlock>
            <p>
              上传、新建、重命名、搬移与删除都限制在共用保存根目录内，禁止删除或搬移根目录本身。/file
              的区网请求也限制于此范围；本机 loopback 请求可由 Path.local
              解析其他可访问路径。
            </p>
          </section>

          <section id="transfers">
            <h2>可续传上传与设备下载</h2>
            <p>
              上传中断后，重新选取相同文件即可续传。「设备下载」会将网址内容存入 App 设备。
            </p>
            <p>
              以下均使用 POST；<code>/upload/chunk</code> 用 multipart，其余用表单。
              JSON 回应使用 <code>text/plain</code>，禁止缓存。
            </p>
            <ReferenceTable
              label="续传与设备下载端点"
              columns={["端点", "参数", "行为"]}
              rows={localTransferEndpoints}
            />
            <h3>分块上传</h3>
            <p>
              先计算整个文件的 SHA-256，以固定 id 调用 start；同一 id 续传时，
              path、name、size 与 sha256 必须保持一致。
              回应包含 <code>offset</code>、<code>complete</code> 及 <code>chunkSize</code>（目前 4 MiB）。
              依 offset 发送下一块，全部上传后调用 finish；服务器检查 SHA-256 后才完成落档。
            </p>
            <p>
              start 指定 <code>parallel=true</code> 时，另外回传 <code>revision</code>、
              <code>chunks</code> 及 <code>threads</code>（目前 4）。
              chunks 是已收到的分块索引；chunk 与 finish 均须带回 revision。
              不要只依 offset 判断并行分块是否全部完成；若版本改变，重新 start 取得状态。
              过期上传回传 404，重新选取原文件创建或恢复传输。
            </p>
            <h3>设备下载任务</h3>
            <CodeBlock label="HTTP" path="由 App 设备下载到既有 TV 目录">
              {`curl --data-urlencode "url=https://example.com/video.mp4" --data-urlencode "path=/TV" --data-urlencode "name=demo.mp4" "http://127.0.0.1:9978/download/start"
curl -X POST "http://127.0.0.1:9978/download/status"`}
            </CodeBlock>
            <p>
              每次回应包含任务 <code>id</code>、name、path、state、total、downloaded、speed 与 error。
              大小以字节、speed 以字节／秒表示；未知 total 为 -1。
              pause、resume、cancel 必须带回同一 id，旧 id 回传 409；尚无任务时回传 404。
              每个 App 服务同时只运行一个设备下载，进行中再次 start 回传 409。
            </p>
            <p>
              暂停或取消可能先回报 pausing／cancelling，请继续查找并以最终状态为准；
              只有 completed 才代表完成，failed 时查看 error。
              可用 status 重新取得遗失的任务回应，但任务状态不保证跨 App 重启保留。
              下载暂存由 App 管理，文件列表隐藏 <code>.tv-downloads</code> 目录。
            </p>
          </section>

          <section id="cache">
            <h2>/cache：键值缓存</h2>
            <p>
              使用 GET 或表单 POST。实际保存键为{" "}
              <code>{'"cache_" + (rule 为空 ? "" : rule + "_") + key'}</code>
              ；rule 可用来隔离不同爬虫的命名空间。
            </p>
            <ReferenceTable
              label="缓存操作"
              columns={["do", "参数", "回应"]}
              rows={localCacheActions}
            />
            <CodeBlock
              label="HTTP"
              path="写入、读取与移除"
            >{`curl -G "http://127.0.0.1:9978/cache" --data-urlencode "do=set" --data-urlencode "rule=demo" --data-urlencode "key=greeting" --data-urlencode "value=Hello"

curl "http://127.0.0.1:9978/cache?do=get&rule=demo&key=greeting"

curl "http://127.0.0.1:9978/cache?do=del&rule=demo&key=greeting"`}</CodeBlock>
          </section>

          <section id="internal">
            <h2>代理与 App 内部端点</h2>
            <ReferenceTable
              label="内部端点"
              columns={["端点", "参数与行为"]}
              rows={[
                [
                  "/proxy",
                  "把 Query / 表单参数、请求标头、parseBody 产生的 files 依序合并后交给 BaseLoader.proxy；后加入的同名键会覆盖前者。",
                ],
                [
                  "/parse",
                  "jxs 为以分号分隔的解析前缀；url 为目标网址。parse.html 会以每个前缀 + url 创建 iframe，回传 text/html。",
                ],
                [
                  "/image/{key}",
                  "读取 ImgUtil 已缓存的图片数据，使用图片本身的 MIME；找不到 key 时回传 404。不是任意网址的图片下载 API。",
                ],
                [
                  "/tvbus",
                  "回传目前直播配置 Core 的 RESP 字符串，不是频道列表。",
                ],
                [
                  "/",
                  "回传 App 内置的 index.html 控制页；其他未匹配路径会尝试读取内置资源，不存在则回传 404。",
                ],
              ]}
            />
            <p>
              /proxy 的 POST body 不是一律直接摊平成参数：一般表单进入
              parms，multipart 会提供暂存盘信息，原始 body 依 NanoHTTPD 的
              parseBody
              结果传递。爬虫回应决定状态、Content-Type、串流与标头；无效回应或例外会回传
              500。
            </p>
            <CodeBlock
              label="HTTP"
              path="解析页范例"
            >{`curl -G "http://127.0.0.1:9978/parse" --data-urlencode "jxs=https://example.com/parse?url=" --data-urlencode "url=https://example.com/watch/demo-1"`}</CodeBlock>
            <p>
              代理回传格式与各语言差异请见{" "}
              <Link className="inline-link" href="/spider#proxy">
                Spider Proxy 回传
              </Link>
              ；RESP 字段请见{" "}
              <Link className="inline-link" href="/config#core">
                Core 配置
              </Link>
              。
            </p>
          </section>
        </div>
      </div>
    </DocsLayout>
  );
}
