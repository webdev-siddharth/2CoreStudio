"use client";

import Markdown from "react-markdown";

function preprocessContent(raw: string): string {
  return raw.replace(/\\n/g, "\n");
}

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="md-body">
      <Markdown>{preprocessContent(content)}</Markdown>
    </div>
  );
}
