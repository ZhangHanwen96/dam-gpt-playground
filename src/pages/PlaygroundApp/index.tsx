import { useParams, Navigate } from 'react-router-dom'
import ChatAsset from '@/components/playground-apps/ChatAsset'
import ChatSearch from '@/components/playground-apps/ChatSearch'
import ChatPrompt from '@/components/playground-apps/ChatPrompt'
import styles from './index.module.scss'

const apps = {
  chatAsset: ChatAsset,
  chatSearch: ChatSearch,
  chatPrompt: ChatPrompt
}

const PlaygroundStandaloneApp = () => {
  const { type } = useParams<{ type: keyof typeof apps }>()

  const Comp = apps[type!]

  if (!Comp) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="main-content w-full overflow-hidden bg-light-0 dark:bg-dark-0 md:px-[80px] lg:px-[180px] xl:px-[280px]">
      <div className={styles['box-gradient-lg']} />
      <Comp />
    </div>
  )
}

export default PlaygroundStandaloneApp
