import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import showModal from '@/components/show-modal'

function useMaterialSelector(props: {
  onOk?: (id: number) => void
  onClose?: () => void
  filterCode: string
}) {
  const { onOk: onOkProp, onClose: onCloseProp } = props

  const idRef = useRef('1asdasdsd')

  const onOk = useMemoizedFn((id: number) => onOkProp?.(id))
  const onClose = useMemoizedFn(() => onCloseProp?.())

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const modalRef = useRef<{ destroy: () => void } | null>(null)

  useLayoutEffect(() => {
    const receiveMessage = (event: MessageEvent<any>) => {
      if (event?.data?.type === 'tezign-selector-page-ready') {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: 'tezign-material-selector',
            data: {
              config: [{ id: 'document', limit: 3 }],
              filterCode: props.filterCode,
              id: idRef.current
              // formatLimit: 5
            }
          },
          {
            targetOrigin: '*'
          }
        )
        return
      }

      if (event?.data?.id !== idRef.current) {
        return
      }

      const closeModal = () => {
        modalRef.current?.destroy?.()
        modalRef.current = null
      }

      if (event?.data?.type === 'tezign-selector-confirm-btn') {
        console.log(event.data)
        onOk?.(event.data.data.selectedMaterial)
        closeModal()
        return
      }

      if (event?.data?.type === 'tezign-selector-cancel-btn') {
        onClose?.()
        closeModal()
        return
      }
    }

    window.addEventListener('message', receiveMessage, false)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [onClose, onOk, props.filterCode])

  const showMaterialSelector = useCallback(() => {
    modalRef.current = showModal({
      closable: false,
      maskClosable: false,
      centered: true,
      width: '100vw',
      bodyStyle: {
        padding: 0
      },
      style: {
        padding: 0
      },
      footer: null,
      // wrapStyle: { padding: 0 },
      children: (
        <iframe
          ref={iframeRef}
          // TODO: get origin
          src="https://vms-t2.test.tezign.com/dam_enterprise/material_selector"
          style={{
            height: '100vh',
            width: '100vw',
            border: 'none',
            position: 'fixed',
            inset: 0
          }}
        />
      )
    })
  }, [])

  return { showMaterialSelector }
}

export { useMaterialSelector }
