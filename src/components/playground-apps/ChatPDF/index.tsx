/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC } from 'react'
import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Modal, Select, Space, Tour, TourProps, theme } from 'antd'
import { usePDFStore } from '@/store/usePDFStore'
import FileDropZone from '../../Upload'
import { useLocalStorageState } from 'ahooks'

const ensureArrary = (value: any) => {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

const SearchBarAreaPDF: FC = () => {
  const pdfOptions = usePDFStore.use.pdfOptions()
  const fetchPDFOptions = usePDFStore.use.fetchFileOptions()
  const setSelectedFile = usePDFStore.use.setSelectedFile()

  const showUploadModal = () => {
    Modal.info({
      title: '上传文件',
      content: (
        <div className="flex flex-col items-center">
          <FileDropZone />
          <div className="mt-2 text-sm text-gray-500">上传PDF文件</div>
        </div>
      ),
      afterClose() {
        fetchPDFOptions('pdf')
      },
      icon: null,
      closable: true
    })
  }
  return (
    <Space>
      <Button
        icon={<UploadOutlined />}
        type="primary"
        onClick={() => {
          showUploadModal()
        }}
        id="uploadFiles"
      >
        上传 PDF
      </Button>
      <Select
        defaultValue="lucy"
        className="min-w-[8rem] lg:min-w-[16rem]"
        onChange={(values, opt) => {
          console.log(values, opt)
          // @ts-ignore
          setSelectedFile(ensureArrary(values))
        }}
        options={pdfOptions}
        loading={usePDFStore.use.loading()}
        allowClear
        showSearch
        maxTagCount={'responsive'}
        placeholder="Select Files"
        mode="multiple"
        maxTagTextLength={15}
        rootClassName="selectFilesRoot"
      />
    </Space>
  )
}

const { useToken } = theme

function ChatPDF() {
  const [open, setOpen] = useLocalStorageState('tour:chatPDF', {
    defaultValue: true
  })

  const token = useToken()

  const steps: TourProps['steps'] = [
    {
      description:
        'Search related prompts from lexica.art as example, ChatGPT use example to generate new prompt.',
      title: 'Chat Asset'
    },
    {
      title: '上传文件',
      description: '在这里上传需要交互的文件',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => document.querySelector('#uploadFiles') as HTMLDivElement
    },
    {
      title: '选择文件',
      description: 'Click to see other actions.',
      target: () => document.querySelector('.selectFilesRoot') as HTMLDivElement
    }
  ]

  return (
    <>
      <ChatWindow searchBarTopArea={<SearchBarAreaPDF />} />
      <Tour
        type="primary"
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        mask={{
          color: token.token.colorPrimaryBgHover,
          style: {
            opacity: 0.4
          }
        }}
      />
    </>
  )
}

export default ChatPDF
