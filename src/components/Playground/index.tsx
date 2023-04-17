import { Card, Col, Row, Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom'
import ResponsiveBox from '../Reponsive/Box'
import { FC } from 'react'
import chatPrompt from '@/assets/chatPrompt.png'
import chatAsset from '@/assets/chatAsset.png'
import chatSearch from '@/assets/chatSearch.png'

const gridConfig = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8
}

type PCardProps = {
  description: string
  title: string
  category: string
  to: string
  cover: string
}

const cardListData: PCardProps[] = [
  {
    title: 'Chat Asset',
    category: '文字',
    description:
      '基于私有知识库的问答工具，利用私有知识快速帮助用户回答领域内的知识。',
    to: '/apps/chatAsset',
    cover: chatAsset
  },
  {
    title: 'Chat Prompt',
    category: '文字',
    description:
      'AI绘画Prompts生成器，输入想要绘画的关键信息，帮你生成可以提高作画质量的Prompt',
    to: '/apps/chatPrompt',
    cover: chatPrompt
  },
  {
    title: 'Chat Search',
    category: '文字',
    description: 'ChatGPT用它从互联网搜索有用的文章作为参考，来回答你的问题',
    to: '/apps/chatSearch',
    cover: chatSearch
  }
]

const PCard: FC<PCardProps> = ({ category, description, title, to, cover }) => {
  const navigate = useNavigate()
  return (
    <div
      className="w-full cursor-pointer flex flex-col rounded-xl border border-solid h-full border-[transparent] p-4 backdrop-blur-md transition-all duration-[280ms] ease-in-out hover:-translate-y-3 hover:border-[hsla(0,0%,100%,.5)]"
      style={{
        background: 'rgba(43, 43, 46, 0.8)'
      }}
      onClick={() => {
        navigate(to)
      }}
    >
      <ResponsiveBox
        className="mb-4 rounded-lg overflow-hidden bg-[#576272]"
        ratio={2.3}
      >
        <img src={cover} alt="" />
      </ResponsiveBox>
      <div className="text-2xl text-white">{title}</div>
      <div className="min-h-[2.5rem] text-sm text-[#858E99] mb-4">
        {description}
      </div>
      <div className="mt-auto flex flex-row">
        <span
          className="inline-block"
          style={{
            gap: '10px',
            background: '#61CAFF',
            padding: '1px 8px',
            borderRadius: '4px'
          }}
        >
          {category}
        </span>
      </div>
    </div>
  )
}

const Playground = () => {
  return (
    <Row gutter={[32, 24]}>
      {cardListData.map((val, index) => {
        return (
          <Col {...gridConfig} key={index}>
            <PCard {...val} />
          </Col>
        )
      })}
    </Row>
  )
}

export default Playground
