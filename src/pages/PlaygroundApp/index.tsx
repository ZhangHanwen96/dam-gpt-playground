import ChatAsset from '@/components/playground-apps/ChatAsset'
import ChatPDF from '@/components/playground-apps/ChatPDF'
import ChatSearch from '@/components/playground-apps/ChatSearch'
import { useParams } from 'react-router-dom'
import styles from './index.module.scss'
import ChatPrompt from '@/components/playground-apps/ChatPrompt'

const apps = {
  chatAsset: ChatAsset,
  chatPDF: ChatPDF,
  chatSearch: ChatSearch,
  chatPrompt: ChatPrompt
}

const PlaygroundStandaloneApp = () => {
  const { type } = useParams<{ type: keyof typeof apps }>()

  const Comp = apps[type!]

  return Comp ? (
    <div className="main-content w-full overflow-hidden bg-light-0 dark:bg-dark-0 md:px-[80px] lg:px-[180px] xl:px-[280px]">
      <div className={styles['box-gradient-lg']} />
      <Comp />
    </div>
  ) : null
}

export default PlaygroundStandaloneApp
