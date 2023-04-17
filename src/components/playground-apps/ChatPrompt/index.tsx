import React, { useState } from 'react'
import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { InputNumber, Space, Form, TourProps, Tour, theme } from 'antd'
import { useLocalStorageState } from 'ahooks'

const { Item } = Form

const { useToken } = theme

const ChatPrompt = () => {
  const [open, setOpen] = useLocalStorageState('tour:chatPrompt', {
    defaultValue: true
  })

  const steps: TourProps['steps'] = [
    {
      description:
        'Search related prompts from lexica.art as example, ChatGPT use example to generate new prompt.',
      title: 'Chat Prompt'
    },

    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => document.querySelector('#generateNum') as HTMLDivElement
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
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
        apiEndPoint="http://49.233.4.96:30209/v1/ChatAPP/ChatPrompt"
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

export default ChatPrompt
