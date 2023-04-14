/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Input,
  Avatar,
  Button,
  Collapse,
  theme,
  Select,
  Space,
  Modal
} from 'antd'
import {
  SendOutlined,
  UserOutlined,
  CaretRightOutlined,
  ReloadOutlined,
  UploadOutlined
} from '@ant-design/icons'
import clx from 'classnames'
import ReactMd from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from '../index.module.scss'
import { ChatMessage } from '@/interface/ChatMessage'

const AssistantAvatar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.4 3.6H3.6V14.4H14.4V3.6ZM0 0V18H18V0H0Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.4 3.6H3.6V14.4H14.4V3.6ZM0 0V18H18V0H0Z"
      fill="url(#paint0_linear_82_3232)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_82_3232"
        x1="-1.74879e-07"
        y1="-0.129837"
        x2="17.775"
        y2="18.225"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E02E2E" />
        <stop offset="0.239573" stopColor="#FFDB1E" />
        <stop offset="0.494791" stopColor="#13DB4B" />
        <stop offset="0.755219" stopColor="#3C4FFF" />
        <stop offset="1" stopColor="#C629D4" />
      </linearGradient>
    </defs>
  </svg>
)

const MdChatMessage: React.FC<{
  message: ChatMessage
  className?: string
}> = ({ message, className }) => {
  const userRole = message.role === 'user'
  const cls = userRole ? styles.user : styles.assistant
  return (
    <div className={clx([cls, 'flex', className])}>
      <Avatar
        icon={
          userRole ? (
            <UserOutlined />
          ) : (
            <span className="anticon">
              <AssistantAvatar />
            </span>
          )
        }
      />
      <div
        className={clx([
          styles.message,
          userRole
            ? 'text-light-10 bg-light-4 dark:text-dark-10 dark:bg-dark-4'
            : 'bg-light-10 dark:bg-dark-10 text-light-0 dark:text-dark-0',
          'px-5 py-2'
        ])}
        style={{}}
      >
        <ReactMd
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="markdown-code-block">
                  <div className="-mb-2 w-full rounded-t-md bg-[rgb(116,109,109)] py-2 text-white">
                    {' '}
                    {match[1]}
                  </div>
                  <SyntaxHighlighter
                    {...props}
                    style={materialLight}
                    language={match[1]}
                    PreTag="div"
                    className={`${className}`}
                  >
                    {String(children)
                      .replaceAll('```', '~~~')
                      .replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <div className="markdown-code-block">
                  <div className="w-full rounded-t-md bg-[rgb(116,109,109)] py-2 text-white">
                    {'  '}
                  </div>
                  <div className="overflow-auto">
                    <code {...props} className={className}>
                      {children}
                    </code>
                  </div>
                </div>
              )
            }
          }}
        >
          {message.content}
        </ReactMd>
      </div>
    </div>
  )
}

export default MdChatMessage
