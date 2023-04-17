import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { showGuide } from '@/utils'
import { useLocalStorageState } from 'ahooks'
import { Tour, TourProps, theme } from 'antd'

const { useToken } = theme

const ChatSearch = () => {
  const [open, setOpen] = useLocalStorageState('tour:chatSearch', {
    defaultValue: true
  })

  const steps: TourProps['steps'] = [
    {
      description: 'ChatGPT用它从互联网搜索有用的文章作为参考，来回答你的问题',
      title: 'Chat Search'
    },
    {
      title: '提问',
      description: '在这里输入您的问题。',
      target: () =>
        document.querySelector('#searchBarContainer') as HTMLDivElement
    }
  ]

  const { token } = useToken()

  return (
    <>
      <ChatWindow apiEndPoint="http://49.233.4.96:30209/v1/ChatAPP/ChatSearch" />
      <Tour
        type="primary"
        open={open && showGuide}
        onClose={() => setOpen(false)}
        steps={steps}
        mask={{
          color: token.colorPrimaryBgHover,
          style: {
            opacity: 0.4
          }
        }}
      />
    </>
  )
}

export default ChatSearch
