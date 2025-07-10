import {
  AttachImage,
  AttachParagraph,
  rehypePlugins,
  rewriteFunc
} from '@components/common/MarkdownPreview'
import { api } from '@helpers/api'
import { getBase64 } from '@helpers/getBase64'
import MDEditor, {
  MDEditorProps,
  TextAreaTextApi,
  TextState,
  commands,
  title
} from '@uiw/react-md-editor'
import { useEffect, useRef } from 'react'
import rehypeSanitize from 'rehype-sanitize'

const VideoEmbed = ({ src }: { src: string }) => {
  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = regExp.exec(url)
    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeId = getYoutubeId(src)

  if (youtubeId) {
    return (
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <video controls src={src} style={{ maxWidth: '100%' }}>
      <track kind="captions" srcLang="en" label="English captions" />
    </video>
  )
}

interface SvgBoxProps {
  d: string
}
const SvgBox = ({ d }: SvgBoxProps) => {
  return (
    <svg viewBox="0 0 1024 1024" width="12" height="12">
      <path fill="currentColor" d={d} />
    </svg>
  )
}

const alignGroup = {
  name: 'align',
  groupName: 'alignment',
  icon: (
    <SvgBox d="M128 192h768v64H128v-64zm128 192h512v64H256v-64zm-128 192h768v64H128v-64zm128 192h512v64H256v-64z" />
  ),
  buttonProps: { 'aria-label': 'Change Alignment' }
}

const alignItemsArr = [
  {
    name: 'center',
    icon: (
      <SvgBox d="M128 192h768v64H128v-64zm128 192h512v64H256v-64zm-128 192h768v64H128v-64zm128 192h512v64H256v-64z" />
    )
  },
  {
    name: 'left',
    icon: (
      <SvgBox d="M128 192h768v64H128v-64zm0 192h512v64H128v-64zm0 192h768v64H128v-64zm0 192h512v64H128v-64z" />
    )
  },
  {
    name: 'right',
    icon: (
      <SvgBox d="M128 192h768v64H128v-64zm256 192h512v64H384v-64zm-256 192h768v64H128v-64zm256 192h512v64H384v-64z" />
    )
  }
]

const alignArr = alignItemsArr.map(e => ({
  keyCommand: `${e.name}Align`,
  name: `${e.name}Alignment`,
  buttonProps: { 'aria-label': `align on ${e.name}` },
  icon: e.icon,
  execute: async (state: TextState, api: TextAreaTextApi) => {
    api.replaceSelection(
      `<div align=${e.name}> \n\n ${state.selectedText}\n </div>`
    )
  }
}))

const titleArr = [
  commands.title1,
  commands.title2,
  commands.title3,
  commands.title4,
  commands.title5,
  commands.title6
]

const textCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.codeBlock,
  commands.code,
  commands.orderedListCommand,
  commands.unorderedListCommand,
  commands.table,
  commands.group(alignArr, alignGroup)
]

interface ArticleEditorProps extends MDEditorProps {
  value: string
  onChange: (text?: string | undefined) => void
}

const imageUploadHandler = async (
  image: File
): Promise<string | null> => {
  if (image && image.size === 0) return null
  const base = await getBase64(image)
  return await api
    .post('/kb/attachment', {
      name: image.name,
      content: base.replace(new RegExp(/data:.*base64,/), '')
    })
    .then(e => e.data)
    .catch(() => null)
}

const uploadFile = async (
  event: EventTarget & HTMLInputElement,
  value: string,
  onChange?: ((text: string) => void) | undefined
) => {
  if (event?.files?.length === 1 && onChange) {
    const myfile = event.files[0]
    const url = await imageUploadHandler(myfile)

    if (!url) {
      onChange(value.concat('ERROR Image has not been stored on server'))
      return
    }

    onChange(value.concat(`${url}\n`))
  }
}

const onPaste = async (event: DataTransfer) => {
  if (event?.files?.length === 1) {
    const myfile = event.files[0]
    const url = await imageUploadHandler(myfile)
    if (url) {
      document.execCommand('insertText', false, `${url}\n`)
    } else {
      document.execCommand(
        'insertText',
        false,
        'ERROR Image has not been stored on server'
      )
    }
  }
}

const useArticleEditor = () => {
  const listener = (e: Event) => {
    e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('dragover', listener, false)
    window.addEventListener('drop', listener, false)
    return () => {
      window.removeEventListener('dragover', listener)
      window.removeEventListener('drop', listener)
    }
  })
}

const UploadIcon = () => {
  return (
    <svg viewBox="0 0 1024 1024" width="12" height="12">
      <path
        fill="currentColor"
        d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z"
      />
    </svg>
  )
}
export const CustomImage = ({ src, alt }: { src: string; alt?: string }) => {
  if (alt === 'YouTube Video') {
    return <VideoEmbed src={src} />
  }
  return <AttachImage src={src} alt={alt} />
}

const FileInput = ({
  fileRef,
  value,
  onChange
}: {
  fileRef: any
  value: string
  onChange?: (text: string) => void
}) => {
  return (
    <input
      id="article-upload-file"
      type="file"
      ref={fileRef}
      style={{ display: 'none' }}
      onChange={e => uploadFile(e.target, value, onChange)}
    />
  )
}

const ArticleEditor = ({ value, onChange, ...props }: ArticleEditorProps) => {
  useArticleEditor()
  const fileRef = useRef<any>(null)

  const youtubeCommand = {
    name: 'youtube',
    keyCommand: 'youtube',
    buttonProps: { 'aria-label': 'Insert YouTube video' },
    icon: (
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path
          fill="currentColor"
          d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.43.029 5.804 0 12c-.029 6.185.458 8.566 4.385 8.816 3.599.245 11.626.246 15.23 0C23.512 20.57 23.971 18.196 24 12c.029-6.185-.458-8.566-4.385-8.816zM9 16V8l8 4-8 4z"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      const url = prompt('Enter YouTube URL:')
      if (url) {
        api.replaceSelection(`![YouTube Video](${url})`)
      }
    }
  }

  return (
    <MDEditor
      {...{ value, onChange, ...props }}
      onPaste={e => onPaste(e.clipboardData)}
      onDrop={e => onPaste(e.dataTransfer)}
      style={{ width: '100%', height: 'auto' }}
      commands={[
        title,
        commands.divider,
        commands.group(titleArr, {
          name: 'title',
          groupName: 'title',
          buttonProps: { 'aria-label': 'Insert title' }
        }),
        ...textCommands,
        commands.divider,
        commands.link,
        commands.image,
        youtubeCommand, // Add the YouTube command
        commands.group([], {
          name: 'upload',
          groupName: '',
          icon: <UploadIcon />,
          execute: () => {
            fileRef.current.click()
          },
          buttonProps: { 'aria-label': 'Insert title' },
          children: () => FileInput({ fileRef, value, onChange })
        })
      ]}
      height="85vh"
      components={{ img: AttachImage, p: AttachParagraph }}
      previewOptions={{
        components: {
          img: ({ src, alt }) => CustomImage({ src, alt }),
          p: AttachParagraph
        },
        rehypePlugins: [...rehypePlugins, [rehypeSanitize]],
        rehypeRewrite: rewriteFunc
      }}
    />
  )
}

export default ArticleEditor
