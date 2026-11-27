"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );

  async function copy() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <span className="copy-control">
      <button
        type="button"
        className="copy-button"
        onClick={copy}
        aria-label={`拷贝 ${label}`}
        aria-busy={status === "copying"}
        disabled={status === "copying"}
      >
        {status === "copying"
          ? "稍候"
          : status === "copied"
            ? "已拷贝"
            : "拷贝"}
      </button>
      <span className="sr-only" role="status" aria-atomic="true">
        {status === "copying"
          ? `正在拷贝 ${label}`
          : status === "copied"
            ? `${label}已拷贝`
            : ""}
      </span>
      {status === "error" && (
        <span className="copy-error" role="alert">
          无法访问剪贴板，请选取代码后拷贝。
        </span>
      )}
    </span>
  );
}
