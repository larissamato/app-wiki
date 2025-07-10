import { Marked, Renderer as RendererMarkdown } from '@ts-stack/markdown'
import hljs from 'highlight.js'
import { Typography } from 'antd'
import 'highlight.js/styles/github-dark.css'
import { useTheme } from 'styled-components'

const { Text } = Typography

class Renderer extends RendererMarkdown {
  private color: string

  constructor(color: string) {
    super()
    this.color = color
  }

  override heading(text: string, level: number) {
    return `<h${level} id="${text}" data-cy="mark-heading" style="color: ${this.color}">${text}</h${level}>`
  }
  override code(code: string, lang: string | undefined) {
    const highlightedCode = lang
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value
    return `<pre style="background-color: #262626; color: white"><code data-cy="mark-code" class="language-${lang}">${highlightedCode}</code></pre>`
  }
  override paragraph(text: string) {
    return `<p style="color: ${this.color}">${text?.replace(/\\n|\n/g, '<br>')}</p>`
  }
}

const TextMarkdown = ({ text, color }: { text: string; color?: string }) => {
  const theme = useTheme()
  const textColor = color ? color : theme.text
  const processText = setReference(escapeHtml(text), textColor)

  Marked.setOptions({
    renderer: new Renderer(textColor)
  })

  return (
    <Text>
      <div
        style={{ color: color }}
        dangerouslySetInnerHTML={{
          __html: Marked.parse(processText)
        }}
      />
    </Text>
  )
}

function setReference(text: string, color: string) {
  const reg = /(?:^|\s)#(\d+)(?:\s|$)/g
  const regEmail = /<mailto:(.*)>/g
  return text
    ?.replace(
      reg,
      ` <a style="color: ${color}; text-decoration: underline" href="/ticket/$1">#$1</a> `
    )
    ?.replace(
      regEmail,
      `<a style="color: ${color}; text-decoration: underline" href="mailto:$1">mailto:&lt;$1&gt;</a> `
    )
}

function escapeHtml(html: string | null | undefined): string {
  if (typeof html !== 'string') {
    return '';
  }

  return html.replace(/[<>&]/g, function(char) {
    switch (char) {
      case '<': return '<';
      case '>': return '>';
      case '&': return '&';
      default: return char;
    }
  });
}

export default TextMarkdown
