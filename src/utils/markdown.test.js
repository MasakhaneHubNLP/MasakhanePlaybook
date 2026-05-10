// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  splitFrontmatter,
  slugify,
  setFrontmatterField,
  inlineMd,
  mdToHtml,
  htmlToMd,
} from './markdown.js';

/* ── splitFrontmatter ──────────────────────────────────────────────────── */

describe('splitFrontmatter', () => {
  it('splits frontmatter from content', () => {
    const md = '---\ntitle: Hello\n---\n\nBody text.';
    const { frontmatter, content } = splitFrontmatter(md);
    expect(frontmatter).toBe('---\ntitle: Hello\n---\n');
    expect(content).toBe('\nBody text.');
  });

  it('returns empty frontmatter when none present', () => {
    const md = 'Just a plain paragraph.';
    const { frontmatter, content } = splitFrontmatter(md);
    expect(frontmatter).toBe('');
    expect(content).toBe(md);
  });

  it('handles empty string input', () => {
    const { frontmatter, content } = splitFrontmatter('');
    expect(frontmatter).toBe('');
    expect(content).toBe('');
  });

  it('does not crash on non-string input', () => {
    // String(md) is used for matching only; the original value is returned as content
    const { frontmatter, content } = splitFrontmatter(null);
    expect(frontmatter).toBe('');
    expect(content).toBe(null);
  });
});

/* ── slugify ───────────────────────────────────────────────────────────── */

describe('slugify', () => {
  it('converts spaces to hyphens and lowercases', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips special characters', () => {
    expect(slugify('Héllo! @World#')).toBe('h-llo-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  --foo--  ')).toBe('foo');
  });

  it('truncates to 50 characters', () => {
    const long = 'a'.repeat(60);
    expect(slugify(long)).toHaveLength(50);
  });

  it('collapses consecutive special chars into one hyphen', () => {
    expect(slugify('foo   bar---baz')).toBe('foo-bar-baz');
  });
});

/* ── setFrontmatterField ───────────────────────────────────────────────── */

describe('setFrontmatterField', () => {
  it('updates an existing field', () => {
    const md = '---\ntitle: Old\n---\n\nBody.';
    const result = setFrontmatterField(md, 'title', 'New');
    expect(result).toContain('title: New');
    expect(result).not.toContain('title: Old');
  });

  it('adds a new field to existing frontmatter', () => {
    const md = '---\ntitle: Hello\n---\n\nBody.';
    const result = setFrontmatterField(md, 'sidebar_position', '3');
    expect(result).toContain('sidebar_position: 3');
    expect(result).toContain('title: Hello');
  });

  it('wraps content with frontmatter when none exists', () => {
    const md = 'Plain content.';
    const result = setFrontmatterField(md, 'title', 'Auto');
    expect(result).toMatch(/^---\ntitle: Auto\n---\n/);
    expect(result).toContain('Plain content.');
  });
});

/* ── inlineMd ──────────────────────────────────────────────────────────── */

describe('inlineMd', () => {
  it('converts bold', () => {
    expect(inlineMd('**bold**')).toBe('<strong>bold</strong>');
  });

  it('converts italic', () => {
    expect(inlineMd('*italic*')).toBe('<em>italic</em>');
  });

  it('converts inline code', () => {
    expect(inlineMd('`code`')).toBe('<code>code</code>');
  });

  it('converts links', () => {
    expect(inlineMd('[label](https://example.com)')).toBe(
      '<a href="https://example.com">label</a>',
    );
  });

  it('converts images', () => {
    expect(inlineMd('![alt](img.png)')).toBe(
      '<img alt="alt" src="img.png" style="max-width:100%;height:auto">',
    );
  });

  it('converts bold-italic', () => {
    expect(inlineMd('***both***')).toBe('<strong><em>both</em></strong>');
  });
});

/* ── mdToHtml ──────────────────────────────────────────────────────────── */

describe('mdToHtml', () => {
  it('converts headings', () => {
    expect(mdToHtml('## Section')).toBe('<h2>Section</h2>');
  });

  it('converts a paragraph', () => {
    expect(mdToHtml('Hello world')).toBe('<p>Hello world</p>');
  });

  it('converts an unordered list', () => {
    const html = mdToHtml('- alpha\n- beta');
    expect(html).toBe('<ul><li>alpha</li><li>beta</li></ul>');
  });

  it('converts an ordered list', () => {
    const html = mdToHtml('1. first\n2. second');
    expect(html).toBe('<ol><li>first</li><li>second</li></ol>');
  });

  it('converts a fenced code block', () => {
    const html = mdToHtml('```\nconst x = 1;\n```');
    expect(html).toBe('<pre><code>const x = 1;</code></pre>');
  });

  it('converts a blockquote', () => {
    const html = mdToHtml('> A quote');
    expect(html).toBe('<blockquote><p>A quote</p></blockquote>');
  });

  it('skips blank lines', () => {
    const html = mdToHtml('Para one\n\nPara two');
    expect(html).toBe('<p>Para one</p>\n<p>Para two</p>');
  });
});

/* ── htmlToMd ──────────────────────────────────────────────────────────── */

describe('htmlToMd', () => {
  it('converts a paragraph', () => {
    expect(htmlToMd('<p>Hello</p>')).toBe('Hello');
  });

  it('converts bold and italic', () => {
    expect(htmlToMd('<strong>bold</strong> and <em>italic</em>')).toBe(
      '**bold** and *italic*',
    );
  });

  it('converts a link', () => {
    expect(htmlToMd('<a href="https://example.com">click</a>')).toBe(
      '[click](https://example.com)',
    );
  });

  it('converts an unordered list', () => {
    const md = htmlToMd('<ul><li>one</li><li>two</li></ul>');
    expect(md).toBe('- one\n- two');
  });

  it('converts an ordered list', () => {
    const md = htmlToMd('<ol><li>first</li><li>second</li></ol>');
    expect(md).toBe('1. first\n2. second');
  });
});
