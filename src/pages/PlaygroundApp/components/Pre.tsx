import { FC, useEffect, useRef, useState } from 'react'
// import CopyButton from '../CopyButton'
import PropTypes from 'prop-types'
// import { changeChildrenFontSize } from '../../utils'

export const Pre: FC<any> = ({ className, children }) => {
  const preRef = useRef(null)
  const [fontSize, setFontSize] = useState(14)
  const sizeList = [10, 12, 14, 16, 18]

  //   useEffect(() => {
  //     changeChildrenFontSize(preRef.current.childNodes[1], fontSize + 'px')
  //   })

  return (
    <pre className={className} ref={preRef} style={{ position: 'relative' }}>
      <span className="code-corner-util gpt-util-group">
        {/* <CopyButton
          contentFn={() => preRef.current.childNodes[1].textContent}
          size={14}
        /> */}
      </span>
      {children}
    </pre>
  )
}
