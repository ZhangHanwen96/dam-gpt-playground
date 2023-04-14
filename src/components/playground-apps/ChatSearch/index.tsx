import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { useLocalStorageState } from 'ahooks'
import { Tour, TourProps, theme } from 'antd'

const { useToken } = theme

const ChatSearch = () => {
  const [open, setOpen] = useLocalStorageState('tour:chatSearch', {
    defaultValue: true
  })

  const steps: TourProps['steps'] = [
    {
      description:
        'Search related prompts from lexica.art as example, ChatGPT use example to generate new prompt.',
      title: 'Chat Search'
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
      target: () =>
        document.querySelector('#searchBarContainer') as HTMLDivElement
    }
  ]

  const { token } = useToken()

  return (
    <>
      <ChatWindow />
      <Tour
        type="primary"
        open={open}
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
