/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC } from 'react'
import ChatWindow from '@/pages/PlaygroundApp/ChatWindow'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Modal, Select, Space, Tour, TourProps, theme } from 'antd'
import { useFileStore } from '@/store/useFileStore'
import FileDropZone from '../../Upload'
import { useLocalStorageState } from 'ahooks'
import { useMaterialSelector } from '@/hooks/useMaterialSelector'
import showModal from '@/components/show-modal'
import { showGuide } from '@/utils'

const ensureArrary = (value: any) => {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

const SearchBarAreaPDF: FC = () => {
  const fileOptions = useFileStore.use.fileOptions()
  const fetchfileOptions = useFileStore.use.fetchFileOptions()
  const setselectedFiles = useFileStore.use.setselectedFiles()
  const { showMaterialSelector } = useMaterialSelector({
    filterCode: 'open-component-search-002',
    onOk(data) {
      console.log(data)
    }
  })

  const showUploadModal = () => {
    const modal = showModal({
      title: '上传文件',
      children: (
        <div className="flex flex-col items-center">
          <FileDropZone />
          <div className="mt-2 text-sm text-gray-500">上传PDF文件</div>
        </div>
      ),
      afterClose() {
        fetchfileOptions('pdf')
      },
      closable: true,
      onOk(e) {
        modal.destroy()
        // fetchfileOptions('pdf')
      }
    })
  }

  return (
    <Space className="w-full [&>div:nth-child(3)]:w-full">
      <Button onClick={showMaterialSelector} type="primary">
        素材选择器
      </Button>
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
        className="w-full xl:w-2/3"
        onChange={(values, opt) => {
          console.log(values, opt)
          // @ts-ignore
          setselectedFiles(ensureArrary(opt))
        }}
        options={fileOptions}
        loading={useFileStore.use.loading()}
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

  const selectedFlies = useFileStore.use.selectedFiles?.()

  const token = useToken()

  const steps: TourProps['steps'] = [
    {
      description:
        '基于私有知识库的问答工具，利用私有知识快速帮助用户回答领域内的知识。',
      title: 'Chat Asset'
    },
    {
      title: '上传文件',
      description: '在这里上传文件，目前只支持PDF文件。',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => document.querySelector('#uploadFiles') as HTMLDivElement
    },
    {
      title: '选择文件',
      description: '选择需要交互的文件。',
      target: () => document.querySelector('.selectFilesRoot') as HTMLDivElement
    }
  ]

  const fileOptions = useFileStore.use.fileOptions()

  return (
    <>
      <ChatWindow
        searchBarTopArea={<SearchBarAreaPDF />}
        apiEndPoint="https://service-qkv9clm1-1307467392.bj.apigw.tencentcs.com/v1/ChatAPP/ChatAsset"
        transformPayload={(val) => {
          return {
            ...val,
            file_ids: selectedFlies?.map((f) => f.value)
          }
        }}
        disabled={!selectedFlies?.length}
        cover={
          !fileOptions?.length ? (
            <>
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
            </>
          ) : null
        }
      />
      <Tour
        type="primary"
        open={open && showGuide}
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
