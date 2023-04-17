import { FC } from "react"
import MdiContentCopy from '~icons/mdi/content-copy'
import MdiCheck from '~icons/mdi/check'


const  CopyButton: FC<any> = ({ className, contentFn, size }) => {
    const [copied, setCopied] = useState(false)
  
    const onClick = () => {
      navigator.clipboard
        .writeText(contentFn())
        .then(() => setCopied(true))
        .then(() =>
          setTimeout(() => {
            setCopied(false)
          }, 600),
        )
    }
  
    return (
      <span
        title={'Copy'}
        onClick={onClick}
      >
        {copied ? <MdiCheck /> : <MdiContentCopy />}
      </span>
    )
  }

  export default CopyButton