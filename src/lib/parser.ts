export function extractHashtags(text: string | null | undefined): string[] {
  if (!text) return [];
  const regex = /#([a-zA-Z0-9_]+)/g;
  const matches = text.match(regex);
  if (!matches) return [];
  const tags = matches.map((tag) => tag.slice(1).toLowerCase());
  return Array.from(new Set(tags));
}

export function extractMentions(text: string | null | undefined): string[] {
  if (!text) return [];
  const regex = /@([a-zA-Z0-9_]+)/g;
  const matches = text.match(regex);
  if (!matches) return [];
  const mentions = matches.map((m) => m.slice(1).toLowerCase());
  return Array.from(new Set(mentions));
}

export interface TextToken {
  type: 'text' | 'hashtag' | 'mention';
  value: string;
  href?: string;
}

export function tokenizeCaption(text: string | null | undefined): TextToken[] {
  if (!text) return [];
  const tokens: TextToken[] = [];
  const regex = /(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        value: text.slice(lastIndex, match.index),
      });
    }

    const token = match[0];
    if (token.startsWith('#')) {
      const tag = token.slice(1).toLowerCase();
      tokens.push({
        type: 'hashtag',
        value: token,
        href: `/explore?tag=${tag}`,
      });
    } else if (token.startsWith('@')) {
      const username = token.slice(1);
      tokens.push({
        type: 'mention',
        value: token,
        href: `/${username}`,
      });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      value: text.slice(lastIndex),
    });
  }

  return tokens;
}
