import React, { useCallback } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { useFileStore } from '@/store/useFileStore'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: false,
  // onChange(info) {
  //   const { status } = info.file
  //   if (status !== 'uploading') {
  //     console.log(info.file, info.fileList)
  //   }
  //   if (status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully.`)
  //     console.log(info.file.name)
  //   } else if (status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`)
  //   }
  // },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  },
  accept: '.pdf',
  action: 'https://mock.apifox.cn/m1/610743-0-default/upload',
  // beforeUpload(file, FileList) {
  //   console.log(file, this.fileList)
  // },
  listType: 'text'
  // withCredentials: true,
  // headers: {},
}

const FileDropZone: React.FC = () => {
  const setFileOptions = useFileStore.use.setFileOptions()

  const onChange = useCallback<Required<UploadProps>['onChange']>((info) => {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
      console.log(info.file.response)
      const fileID = info.file.response.fileID ?? info.file.uid
      setFileOptions([{ value: fileID, label: info.file.name }])
      // setFileOptions()
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }, [])

  return (
    <Dragger {...props} onChange={onChange}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  )
}

export default FileDropZone
