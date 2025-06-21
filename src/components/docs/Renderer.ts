import { docPath } from '.';
import type { DocMeta } from '@shared-types';

const markdownFiles = import.meta.glob('./content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function renderDoc(slug?: string): { meta: DocMeta; content: string } {
  const resolvedSlug = docPath.pages.some((d) => d.slug === slug)
    ? slug
    : docPath.default;

  const meta = docPath.pages.find((d) => d.slug === resolvedSlug);
  if (!meta)
    throw new Error(`⚠️ No doc metadata found for slug "${resolvedSlug}"`);

  const filePath = `./content/${meta.file}`;
  const raw = markdownFiles[filePath];
  if (!raw)
    throw new Error(`⚠️ Markdown file "${meta.file}" not found at ${filePath}`);

  return {
    meta,
    content: raw as string,
  };
}
