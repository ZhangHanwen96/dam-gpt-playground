/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC } from 'react'
import { Input, Button, Collapse, theme, ConfigProvider } from 'antd'
import {
  SendOutlined,
  CaretRightOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import clx from 'classnames'
import styles from './index.module.scss'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import {
  ChatMessage,
  PDFDoc,
  SearchDoc,
  SourceDoc
} from '@/interface/ChatMessage'
import { useFileStore } from '../../store/useFileStore'
import MdChatMessage from './components/MDChatMessage'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
// import useMaterialSelector from 'components/MaterialSelector'

const { TextArea } = Input

const { defaultAlgorithm } = theme

const testMessages = [
  {
    role: 'user',
    content: 'hello'
  },
  {
    role: 'assistant',
    content:
      '抱歉，这个问题无法回答，因为它不符合上下文的历史对话。请提供更具体的问题，以便我可以为您提供更好的帮助。'
  },
  {
    role: 'user',
    content: 'hello'
  },
  {
    role: 'assistant',
    content:
      '抱歉，这个问题无法回答，因为它不符合上下文的历史对话。请提供更具体的问题，以便我可以为您提供更好的帮助。'
  }
]

type EventData =
  | {
      type: 'generate_token'
      gen_token: string
    }
  | {
      type: 'extra_info'
      reference_index?: SourceDoc[]
      total_links?: { link: string; title: string; text: string }[]
      used_links?: { link: string; title: string; text: string }[]
    }

let rafId: number

interface ChatWindowProps {
  searchBarTopArea?: React.ReactNode
  apiEndPoint: string
  transformPayload?: (value: {
    message: string
    chat_history: [string, string][]
  }) => any
  disabled?: boolean
  cover?: React.ReactNode
}

const ChatWindow: FC<ChatWindowProps> = ({
  searchBarTopArea,
  apiEndPoint,
  transformPayload = (v) => v,
  disabled = false,
  cover
}) => {
  const chatRoomRef = useRef<HTMLDivElement | null>(null)
  const [question, setQ] = useState<string>('')
  const questionRef = useRef<string>('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [messageState, setMessageState] = useState<{
    history: [string, string][] // question, answer
    messages: ChatMessage[]
    pending?: string
    pendingSourceDocs?: SourceDoc[]
  }>({
    history: [],
    messages: [
      {
        role: 'assistant',
        content: '您好，请问有什么可以帮助你的吗? 😀'
      }
    ]
  })
  const [networkError, setNetworkError] = useState<any>()

  const { type: appType } = useParams<{ type: 'chatSearch' | 'chatAsset' }>()

  const { history, messages, pending, pendingSourceDocs } = messageState

  useUpdateEffect(() => {
    console.log(messages)
  }, [messages])

  const isCompositionMode = useRef(false)

  useEffect(() => {
    if (chatRoomRef.current) {
      rafId && cancelAnimationFrame(rafId)
      // if (
      //   chatRoomRef.current.scrollTop + chatRoomRef.current.clientHeight + 30 <
      //   chatRoomRef.current.scrollHeight
      // ) {
      //   return
      // }
      rafId = requestAnimationFrame(() => {
        chatRoomRef.current!.scrollTop = chatRoomRef.current!.scrollHeight
      })
    }
  }, [chatRoomRef.current, pending, messages])

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(!isNil(pending)
        ? [
            {
              role: 'assistant',
              content: pending,
              sourceDocs: pendingSourceDocs
            } as ChatMessage
          ]
        : [])
    ]
  }, [messages, pending])

  const abortCtrlRef = useRef<AbortController>()

  const handleSearch = (isRetry = false) => {
    if (isStreaming) return
    const q = questionRef.current
    chatRoomRef.current!.scrollTop = chatRoomRef.current!.scrollHeight

    if (networkError) {
      setNetworkError(null)
    }

    setMessageState((state) => {
      const newMessages = [...state.messages]
      // keep the last one
      if (!isRetry) {
        newMessages.push({
          role: 'user',
          content: q
        })
      }
      return {
        ...state,
        messages: newMessages,
        pending: ''
      }
    })

    setIsStreaming(true)
    setQ('')

    const abortCtrl = (abortCtrlRef.current = new AbortController())

    const payload = transformPayload({
      message: q,
      chat_history: history
    })

    fetchEventSource(apiEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: abortCtrl.signal,
      onclose() {
        setIsStreaming(false)
        console.log('close')
      },
      onmessage: (event) => {
        // @zilong 的接口
        if (event.event === 'delta') {
          const parsedData = JSON.parse(event.data) as EventData

          console.log(parsedData)

          if (parsedData.type === 'generate_token') {
            if (parsedData.gen_token === '[EOS]') {
              setIsStreaming(false)
              setMessageState((state) => ({
                history: [...state.history, [q, state.pending ?? '']],
                messages: [
                  ...state.messages,
                  {
                    role: 'assistant',
                    content: state.pending ?? '',
                    sourceDocs: state.pendingSourceDocs
                  }
                ],
                pending: undefined,
                pendingSourceDocs: undefined
              }))
              abortCtrl.abort()
            } else {
              setMessageState((state) => ({
                ...state,
                pending: (state.pending ?? '') + parsedData.gen_token
              }))
            }
          }

          // reference docs
          if (parsedData.type === 'extra_info') {
            // PDF
            if (parsedData.reference_index) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: parsedData.reference_index
              }))
            }
            if (parsedData.total_links) {
              setMessageState((state) => ({
                ...state,
                pendingSourceDocs: parsedData.total_links
              }))
            }
          }
        }
      },
      onerror(err) {
        console.error(err)
        abortCtrl.abort()
        setIsStreaming(false)
        setNetworkError(err)
      },
      async onopen(response) {
        console.log('[OPEN]: ', response)
      }
    })
  }

  const panelStyle = {
    marginBottom: 8,
    border: 'none'
  }

  const stopStreaming = () => {
    abortCtrlRef.current?.abort()
    setIsStreaming(false)
  }

  return (
    <div className="w-ful relative h-full">
      <div
        ref={chatRoomRef}
        className={`h-full w-full overflow-y-scroll ${styles.gradient}`}
        style={{
          border: '1px solid #595959'
        }}
      >
        <div className={styles['box-gradient-sm']} />
        <div className="mx-auto flex w-[100%] flex-col justify-center rounded-md px-4 lg:px-20">
          <div className="conversation-list flex-1 justify-center py-6 ">
            {chatMessages.map((m, index, arr) => (
              <div
                key={index}
                className={clx({
                  'mb-40': index === arr.length - 1
                })}
              >
                <MdChatMessage
                  message={m}
                  loading={
                    index === arr.length - 1 &&
                    isStreaming &&
                    isEmpty(pending) &&
                    m.role === 'assistant'
                  }
                  error={
                    index === arr.length - 1 &&
                    networkError &&
                    m.role === 'assistant'
                  }
                />
                {m.role === 'assistant' && m.sourceDocs?.length ? (
                  <div className="max-w-[100%] lg:max-w-[90%]">
                    <div className="reference-list">
                      {appType === 'chatAsset' &&
                        (m.sourceDocs as PDFDoc[]).map((doc, index) => {
                          return (
                            <Collapse
                              bordered={false}
                              expandIcon={({ isActive }) => (
                                <CaretRightOutlined
                                  className="text-light-7 dark:text-dark-7"
                                  rotate={isActive ? 90 : 0}
                                />
                              )}
                              className="bg-light-0 dark:bg-dark-0"
                            >
                              <Collapse.Panel
                                header={
                                  <p className="text-light-7 dark:text-dark-7">
                                    Reference{' '}
                                    <span className="">[{index}]:</span>
                                    <span>
                                      {doc.file_name} - page: {doc.page}
                                    </span>
                                  </p>
                                }
                                key={index}
                                style={panelStyle}
                                className="tex-t bg-light-0 text-inherit dark:bg-dark-0"
                              >
                                <div className="text-light-7 dark:text-dark-7">
                                  <p>{doc.page_content}</p>
                                </div>
                              </Collapse.Panel>
                            </Collapse>
                          )
                        })}

                      {appType === 'chatSearch' && (
                        <Collapse
                          bordered={false}
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined
                              className="text-light-7 dark:text-dark-7"
                              rotate={isActive ? 90 : 0}
                            />
                          )}
                          className="bg-light-0 dark:bg-dark-0"
                        >
                          <Collapse.Panel
                            header={
                              <p className="text-light-7 dark:text-dark-7">
                                References
                              </p>
                            }
                            key="1"
                            style={panelStyle}
                            className="tex-t bg-light-0 text-inherit dark:bg-dark-0"
                          >
                            <div className="text-light-7 dark:text-dark-7 overflow-x-auto items-start">
                              {m.sourceDocs.map((d, idx) => {
                                const doc = d as SearchDoc
                                return (
                                  <Button
                                    type="link"
                                    href={doc.link}
                                    target="_blank"
                                  >
                                    [{idx}] {doc.title}
                                  </Button>
                                )
                              })}
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-20 w-auto self-center">
        <div
          id="searchBarContainer"
          className="relative mx-auto w-4/5 shrink-0 rounded-lg bg-white py-2 pl-4 pr-0 drop-shadow-md md:w-3/5"
        >
          <ConfigProvider
            theme={{
              token: {},
              algorithm: defaultAlgorithm
            }}
          >
            <TextArea
              style={{
                pointerEvents: disabled ? 'none' : 'auto',
                cursor: disabled ? 'not-allowed' : 'auto'
              }}
              size="middle"
              id="searchBar"
              placeholder="Send a message..."
              autoSize={{ minRows: 1, maxRows: 6 }}
              showCount={false}
              className="resize-none pr-10"
              value={question}
              onChange={(e) => {
                setQ(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.code === 'Enter' && !isCompositionMode.current) {
                  e.preventDefault()
                  // @ts-ignore
                  questionRef.current = e.target.value
                  handleSearch()
                }
              }}
              onCompositionStart={() => {
                isCompositionMode.current = true
              }}
              onCompositionEnd={() => {
                isCompositionMode.current = false
              }}
            />
            <Button
              disabled={disabled}
              type="text"
              onClick={() => {
                questionRef.current = question
                handleSearch()
              }}
              // disabled={disabled}
              icon={<SendOutlined />}
              className="absolute bottom-2 right-2 flex items-center justify-center"
              ghost
            ></Button>
          </ConfigProvider>

          <div className="absolute left-0 top-full mt-1 w-full">
            {searchBarTopArea}
          </div>

          {networkError && (
            <Button
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-[#333]"
              icon={<ReloadOutlined />}
              type="ghost"
              size="large"
              onClick={() => {
                setNetworkError(undefined)
                // remove last assistant message
                setMessageState((state) => {
                  const lastMessage = state.messages[state.messages.length - 1]
                  if (lastMessage.role === 'assistant') {
                    return {
                      ...state,
                      messages: state.messages.slice(0, -1),
                      pending: undefined
                    }
                  }
                  return state
                })
                handleSearch(true)
              }}
            >
              重新加载
            </Button>
          )}
          {isStreaming && (
            <Button
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2"
              icon={<ReloadOutlined />}
              size="large"
              type="default"
              onClick={() => {
                setMessageState((state) => {
                  return {
                    ...state,
                    messages: [
                      ...state.messages,
                      {
                        role: 'assistant',
                        content: state.pending ?? ''
                      }
                    ],
                    pending: undefined
                  }
                })
                stopStreaming()
              }}
            >
              停止
            </Button>
          )}
        </div>
      </div>

      {cover && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          {cover}
        </div>
      )}
    </div>
  )
}

export default ChatWindow
