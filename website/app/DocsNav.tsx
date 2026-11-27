"use client";

import { useId, useState } from "react";

export function DocsNav({
  items,
}: {
  items: readonly (readonly [string, string])[];
}) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="docs-nav">
      <b>本页导览</b>
      <button
        className="docs-nav-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(!expanded)}
      >
        本页导览
        <span aria-hidden="true">{expanded ? "收合 −" : "展开 +"}</span>
      </button>
      <nav
        id={id}
        className="docs-nav-links"
        aria-label="本页导览"
        data-expanded={expanded}
      >
        {items.map(([anchor, title]) => (
          <a href={`#${anchor}`} key={anchor}>
            {title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
