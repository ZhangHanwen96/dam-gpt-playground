import React, { useCallback } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { useFileStore } from '@/store/useFileStore'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'
import { UploadPDFResponse } from '@/services/uploadPDF'
import { RcFile } from 'antd/es/upload'

const { Dragger } = Upload

const FileDropZone: React.FC = () => {
  const setFileOptions = useFileStore.use.setFileOptions()
  const [fileList, setFileList] = useState<RcFile[]>([])

  const props: UploadProps = {
    name: 'files',
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
    // action: 'https://mock.apifox.cn/m1/610743-0-default/upload',
    action: 'http://49.233.4.96:30209/v1/ChatAPP/UploadPDF',
    // beforeUpload(file, fileList) {
    //   console.log(file.size, 1024 * 1024 * 20)
    //   if (file.size >= 1024 * 1024 * 20) {
    //     message.error('文件大小不能超过20MB')
    //     setFileList(fileList.filter((f) => f.size <= 1024 * 1024 * 20))
    //   }

    // },
    listType: 'text'
    // withCredentials: true,
    // headers: {},
  }

  const onChange = useCallback<Required<UploadProps>['onChange']>((info) => {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
      const res = info.file.response as {
        data: UploadPDFResponse[]
      }

      if (res.data[0].parse_status === 'success') {
        const fileID = res.data[0].file_id
        const filename = res.data[0].file_name
        setFileOptions([{ value: fileID, label: filename }])
      } else {
        message.error('文件上传成功，但解析失败')
      }
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
