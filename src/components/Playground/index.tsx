import { Card, Col, Row, Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom'
import ResponsiveBox from '../Reponsive/Box'
import { FC } from 'react'

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
}

const cardListData: PCardProps[] = [
  {
    title: 'Chat Asset',
    category: 'C2',
    description: 'This is the description',
    to: '/apps/chatAsset'
  },
  {
    title: 'Chat Prompt',
    category: 'C1',
    description: 'This is the description',
    to: '/apps/chatPrompt'
  },
  {
    title: 'Chat Search',
    category: 'C1',
    description: 'This is the description',
    to: '/apps/chatSearch'
  }
]

const PCard: FC<PCardProps> = ({ category, description, title, to }) => {
  const navigate = useNavigate()
  return (
    <div
      className="w-full cursor-pointer rounded-xl border border-solid border-[transparent] p-4 backdrop-blur-md transition-all duration-[280ms] ease-in-out hover:-translate-y-3 hover:border-[hsla(0,0%,100%,.5)]"
      style={{
        background: 'rgba(43, 43, 46, 0.8)'
      }}
      onClick={() => {
        navigate(to)
      }}
    >
      <ResponsiveBox
        className="mb-4 rounded-xl bg-[#576272]"
        ratio={2.3}
      ></ResponsiveBox>
      <div className="text-2xl text-white">{title}</div>
      <div className="min-h-[2.5rem] text-sm text-[#858E99]">{description}</div>
      <div className="mt-4 flex flex-row">
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
