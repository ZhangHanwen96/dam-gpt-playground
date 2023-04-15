import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, ModalProps } from 'antd'
import destroyFns from 'antd/es/modal/destroyFns'

export default function show(config: ModalProps) {
  const container = document.createDocumentFragment()
  let currentConfig: ModalProps

  function render(props: ModalProps) {
    setTimeout(() => {
      ReactDOM.render(<Modal {...props} />, container)
    })
  }

  function innerOnCancel(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose()
        }
        destroy()
      }
    }
    render(currentConfig)
  }

  function destroy() {
    ReactDOM.unmountComponentAtNode(container)
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i]
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === innerOnCancel) {
        destroyFns.splice(i, 1)
        break
      }
    }
  }

  function update(
    configUpdate: ModalProps | ((prevConfig: ModalProps) => ModalProps)
  ) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig)
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate
      }
    }
    render(currentConfig)
  }

  currentConfig = { ...config, onCancel: innerOnCancel, visible: true }

  render(currentConfig)

  destroyFns.push(innerOnCancel)

  return {
    destroy: innerOnCancel,
    update
  }
}
