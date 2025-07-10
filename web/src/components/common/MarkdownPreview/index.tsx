import { useUser } from '@contexts/UserContext'
import UIWMarkdownPreview, {
  MarkdownPreviewProps
} from '@uiw/react-markdown-preview'
import rehypeSanitize from 'rehype-sanitize'
import { pdfjs } from 'react-pdf'
import PDFViewer from '../PDFViewer'
import { Image } from 'antd'
import ReactPlayer from 'react-player'
import { audios, videos } from '@constants/files'
import ReactAudioPlayer from 'react-audio-player'
import { CustomImage } from '@components/Article/Editor'

interface PreviewProps extends MarkdownPreviewProps { }
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
const APP_URL = import.meta.env.VITE_OPEN_URL

export function rewriteFunc(node: any, index: any, parent: any) {
  if (node.tagName === 'img') {
    node.properties.src = node.properties?.src.replace(
      '/kb/attachment/',
      `${APP_URL}/kb/attachment/`
    )
    if (parent) parent.children[index] = node
    return node
  }
  return node
}

export const rehypePlugins = [rehypeSanitize]

const OpenFile = ({ alt, src }: any) => {
  if (alt?.endsWith('.pdf')) return <PDFViewer url={src} />
  if (audios.some(a => alt.endsWith(a)))
    return <ReactAudioPlayer src={src} controls style={{ width: '60%' }} />
  if (videos.some(v => alt.endsWith(v)))
    return <ReactPlayer url={src} controls width={'100%'} height={'100%'} />
  return <Image width={300} src={src} height="auto" style={{ maxWidth: 500 }} />
}

export const AttachImage = ({ src, alt }: any) => {
  return src?.indexOf('/kb/attachment') !== -1 ? (
    <OpenFile {...{ alt, src }} />
  ) : (
    <a href={src} download={src}>
      Download File
    </a>
  )
}

export const AttachParagraph = ({ children }: any) => {
  //
  const splitted =
    typeof children === 'string'
      ? children?.split(/(?:^|\s)(#\d+)(?=\s|$)/g)
      : undefined

  if (splitted && splitted?.length > 1) {
    return (
      <p>
        {splitted.map(text => (
          <span>{text}</span>
        ))}
      </p>
    )
  }
  return <p>{children}</p>
}

const MarkdownPreview = ({ ...props }: PreviewProps) => {
  const { isThemeDark } = useUser()
  return (
    <UIWMarkdownPreview
      {...props}
      wrapperElement={{
        'data-color-mode': `${isThemeDark ? 'dark' : 'light'}`
      }}
      components={{
        img: ({ src, alt }) => CustomImage({ src, alt }),
        p: AttachParagraph
      }}
      rehypePlugins={rehypePlugins}
      rehypeRewrite={(node, index, parent) => rewriteFunc(node, index, parent)}
      style={{ overflowX: 'auto' }}
    />
  )
}

export default MarkdownPreview
