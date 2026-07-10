import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

// Render an assistant message (markdown) to HTML for display in the chat / ask box.
export function renderMarkdown(md: string): string {
  return marked.parse(md ?? '', { async: false }) as string
}
