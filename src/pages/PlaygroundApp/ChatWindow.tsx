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
import { ChatMessage, SourceDoc } from '@/interface/ChatMessage'
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
      reference_index: SourceDoc[]
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
}

const ChatWindow: FC<ChatWindowProps> = ({
  searchBarTopArea,
  apiEndPoint,
  transformPayload = (v) => v,
  disabled = false
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
      },
      ...testMessages,
      ...testMessages,
      ...testMessages,
      ...testMessages
    ]
  })
  const [networkError, setNetworkError] = useState<any>()

  const { history, messages, pending, pendingSourceDocs } = messageState

  useUpdateEffect(() => {
    console.log(messages)
  }, [messages])

  const selectedFiles = useFileStore.use.selectedFiles?.()
  const fileOptions = useFileStore.use.fileOptions()

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
            setMessageState((state) => ({
              ...state,
              pendingSourceDocs: parsedData.reference_index
            }))
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
                {m.role === 'assistant' && m.sourceDocs && (
                  <div className="max-w-[70%]">
                    <div className="reference-list">
                      {m.sourceDocs.map((doc) => (
                        <Collapse
                          bordered={false}
                          expandIcon={({ isActive }) => (
                            <CaretRightOutlined
                              className="text-light-7 dark:text-dark-7"
                              rotate={isActive ? 90 : 0}
                            />
                          )}
                          className="bg-light-0 dark:bg-dark-0"
                          style={
                            {
                              // marginBottom: '8px'
                            }
                          }
                        >
                          <Collapse.Panel
                            header={
                              <p className="text-light-7 dark:text-dark-7">
                                Reference <span className="">[{index}]:</span>
                                <span>
                                  {doc.file_name} - page: {doc.page}
                                </span>
                              </p>
                            }
                            key="1"
                            style={panelStyle}
                            className="tex-t bg-light-0 text-inherit dark:bg-dark-0"
                          >
                            <div className="text-light-7 dark:text-dark-7">
                              <p>{doc.page_content}</p>
                            </div>
                          </Collapse.Panel>
                        </Collapse>
                      ))}
                    </div>
                  </div>
                )}
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

      {!fileOptions?.length && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <svg
            width="112"
            height="90"
            viewBox="0 0 112 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M54.9592 88.1629C79.0788 88.1629 98.6332 68.785 98.6332 44.7978C98.6332 20.8106 79.0788 1.43298 54.9592 1.43298C30.8397 1.43298 11.2856 20.8106 11.2856 44.7978C11.2856 68.785 30.8397 88.1629 54.9592 88.1629Z"
              fill="#454956"
              stroke="#7F8695"
              strokeWidth="2.0142"
              strokeMiterlimit="10"
            />
            <path
              d="M102.158 23.055C104.105 23.055 105.683 21.488 105.683 19.5551C105.683 17.6221 104.105 16.0552 102.158 16.0552C100.211 16.0552 98.6333 17.6221 98.6333 19.5551C98.6333 21.488 100.211 23.055 102.158 23.055Z"
              fill="#5D6985"
            />
            <path
              d="M40.3915 15.0911C21.6596 15.0911 6.51709 28.5783 6.51709 45.1865C6.51709 54.7724 11.5646 63.3551 19.4163 68.8169V81.3009C19.4163 82.9728 21.3232 83.9761 22.6691 82.8614L33.4372 74.6131C35.6805 75.0589 37.9239 75.2818 40.2793 75.2818C59.0112 75.2818 74.1537 61.7947 74.1537 45.1865C74.1537 28.5783 59.0112 15.0911 40.3915 15.0911Z"
              fill="#99A3AB"
              stroke="#7F8695"
              strokeWidth="2.0625"
              strokeMiterlimit="10"
            />
            <path
              d="M79.6709 46.0388C90.1669 46.0388 98.6334 53.6181 98.6334 62.9357C98.6334 68.2898 95.8347 73.0877 91.4264 76.2167V83.2397C91.4264 84.2132 90.3068 84.6999 89.6071 84.1437L83.5894 79.4848C82.3299 79.6935 81.0704 79.8325 79.7409 79.8325C69.245 79.8325 60.7783 72.2533 60.7783 62.9357C60.7783 53.6181 69.245 46.0388 79.6709 46.0388Z"
              fill="#646D81"
              stroke="#7F8695"
              strokeWidth="2.0625"
              strokeMiterlimit="10"
            />
            <circle cx="26.9028" cy="45.6355" r="3.5" fill="#687286" />
            <circle cx="41.9028" cy="45.6355" r="3.5" fill="#687286" />
            <circle cx="56.9028" cy="45.6355" r="3.5" fill="#687286" />
            <circle cx="71.8125" cy="63.6621" r="2.5" fill="#3E465A" />
            <circle cx="80.8125" cy="63.6621" r="2.5" fill="#3E465A" />
            <circle cx="89.8125" cy="63.6621" r="2.5" fill="#3E465A" />
            <path
              d="M20.4097 15.151C20.3055 15.209 20.2012 15.267 20.0969 15.325C19.4495 15.3881 18.8211 14.995 18.6098 14.3698L16.9102 7.14438C16.8031 6.46118 17.1349 5.83083 17.7192 5.65424C18.3667 5.5911 18.9951 5.98428 19.2065 6.60946L21.0103 13.7768C21.1586 14.2886 20.9309 14.861 20.4097 15.151Z"
              fill="#5D6985"
            />
            <path
              d="M14.2687 20.193C13.8234 20.3939 13.2282 20.2629 12.8058 19.9208L5.96685 12.4855C5.49448 12.0327 5.529 11.2181 5.98589 10.7456C6.44286 10.2731 7.26067 10.3036 7.73296 10.7564L14.572 18.1917C15.0443 18.6445 15.0098 19.4591 14.5529 19.9316C14.4914 20.0925 14.3801 20.1427 14.2687 20.193Z"
              fill="#5D6985"
            />
            <path
              d="M8.22764 25.4582C7.85844 25.5834 7.5715 25.5465 7.24359 25.3891L2.03919 22.9913C1.38358 22.6765 1.13847 21.9538 1.4673 21.3051C1.79621 20.6564 2.53463 20.406 3.19024 20.7208L8.39464 23.1186C9.05037 23.4335 9.29545 24.156 8.96653 24.8048C8.80213 25.1292 8.47375 25.3748 8.22764 25.4582Z"
              fill="#5D6985"
            />
          </svg>
          <div className="mt-4 text-light-10 dark:text-dark-10">
            上传PDF，开启一段问答吧
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatWindow
