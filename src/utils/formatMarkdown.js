function tokenizeInline(text) {
  const tokens = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > cursor) tokens.push({ text: text.slice(cursor, match.index), bold: false });
    tokens.push({ text: match[1], bold: true });
    cursor = match.index + match[0].length;
    match = pattern.exec(text);
  }
  if (cursor < text.length) tokens.push({ text: text.slice(cursor), bold: false });
  return tokens;
}

/**
 * Parses a safe subset of Markdown into text tokens; render tokens as React nodes
 * so model output is never interpreted as HTML.
 */
export default function formatMarkdown(markdown) {
  const safeText = String(markdown ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  const lines = safeText.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', lines: paragraph });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: 'list', items: list });
    list = [];
  };

  lines.forEach((line) => {
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(tokenizeInline(bullet[1]));
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(tokenizeInline(line));
    }
  });
  flushParagraph();
  flushList();
  return blocks;
}
