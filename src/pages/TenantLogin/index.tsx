import React from 'react'
import { Input } from 'antd'


const TenantLogin = () => {
  return (
    <div className='tenant-login h-screen w-screen flex items-center justify-center flex-col'>
        <h1>输入租户 ID</h1>
        <div>
            <Input title='ID' />
        </div>
    </div>
  )
}

export default TenantLogin