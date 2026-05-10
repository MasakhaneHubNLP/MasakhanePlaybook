/**
 * Shared markdown / frontmatter utilities used by EditModal and StructureEditor.
 */

export function splitFrontmatter(md) {
  const m = String(md).match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m
    ? { frontmatter: `---\n${m[1]}\n---\n`, content: m[2] }
    : { frontmatter: '', content: md };
}

export function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

export function setFrontmatterField(content, key, value) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (m) {
    const raw = m[1];
    const body = m[2];
    const newRaw = raw.match(new RegExp(`^${key}:`, 'm'))
      ? raw.replace(new RegExp(`^${key}:.*`, 'm'), `${key}: ${value}`)
      : `${raw}\n${key}: ${value}`;
    return `---\n${newRaw}\n---\n${body}`;
  }
  return `---\n${key}: ${value}\n---\n\n${content}`;
}

export function inlineMd(text) {
  return text
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/_([^_\n]+)_/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%;height:auto">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
