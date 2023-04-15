import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createSelectors } from './utils'

type State = {
  pdfOptions: { value: string; label: string }[]
  loading: boolean
  selectedFile?: { value: string; label: string }[]
}

type Actions = {
  fetchFileOptions: (type?: 'pdf') => Promise<void>
  setSelectedFile: (opt: { value: string; label: string }[]) => void
}

const createFileSlice = (set) => ({
  selectedFile: undefined,
  setSelectedFile: (opt: { value: string; label: string }[]) => {
    set((state) => {
      state.selectedPDF = opt
    })
  }
})

const _usePDFStore = create(
  persist(
    immer<State & Actions>((set) => ({
      pdfOptions: [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy-as asd.pdfOptions' },
        { value: 'Yiminghe', label: 'yiminghe' }
      ],
      loading: false,
      fetchFileOptions: async () => {
        set((state) => {
          state.loading = true
        })

        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms))

        await delay(2000)

        set((state) => {
          state.loading = false
        })
      },
      ...createFileSlice(set)
    })),
    {
      name: 'chat-asset-store',
      version: 1
    }
  )
)

export const usePDFStore = createSelectors(_usePDFStore)
