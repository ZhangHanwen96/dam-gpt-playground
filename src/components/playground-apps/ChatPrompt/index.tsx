import React, { useState } from 'react'
import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { InputNumber, Space, Form, TourProps, Tour, theme } from 'antd'
import { useLocalStorageState } from 'ahooks'
import { showGuide } from '@/utils'

const { Item } = Form

const { useToken } = theme

const ChatPrompt = () => {
  const [open, setOpen] = useLocalStorageState('tour:chatPrompt', {
    defaultValue: true
  })

  const steps: TourProps['steps'] = [
    {
      description:
        'AI绘画Prompts生成器，输入想要绘画的关键信息，帮你生成可以提高作画质量的Prompt',
      title: 'Chat Prompt'
    },

    {
      title: 'Generate Num',
      description: '生成的Prompt数量',
      target: () => document.querySelector('#generateNum') as HTMLDivElement
    },
    {
      title: '提问',
      description: '在这里输入您的问题。',
      target: () =>
        document.querySelector('#searchBarContainer') as HTMLDivElement
    }
  ]

  const { token } = useToken()

  const genNumRef = useRef(2)

  const searchBarArea = (
    <Space>
      <Item label="Generate Num">
        <InputNumber
          controls={true}
          onChange={(val) => {
            genNumRef.current = val as number
          }}
          min={1}
          max={5}
          defaultValue={2}
          className="w-24"
          id="generateNum"
        />
      </Item>
    </Space>
  )

  return (
    <>
      <ChatWindow
        apiEndPoint="https://service-qkv9clm1-1307467392.bj.apigw.tencentcs.com"
        transformPayload={(val) => {
          return {
            message: val.message,
            generate_num: genNumRef.current
          }
        }}
        searchBarTopArea={searchBarArea}
      />
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

export default ChatPrompt
