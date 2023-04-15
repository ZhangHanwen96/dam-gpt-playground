/* eslint-disable @typescript-eslint/ban-ts-comment */
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { createSelectors } from './utils'

type fileOptions = { value: string; label: string }

type State = {
  fileOptions: fileOptions[]
  loading: boolean
  selectedFiles?: fileOptions[]
}

type Actions = {
  fetchFileOptions: (type?: 'pdf') => Promise<void>
  setselectedFiles: (opt: fileOptions[]) => void
  setFileOptions: (opt: fileOptions[]) => void
}

// @ts-ignore
const createFileSlice = (set) => ({
  selectedFiles: undefined,
  setselectedFiles: (opt: fileOptions[]) => {
    // @ts-ignore
    set((state) => {
      state.selectedPDF = opt
    })
  }
})

const _useFileStore = create(
  persist(
    immer<State & Actions>((set) => ({
      fileOptions: [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy-as asd.fileOptions' },
        { value: 'Yiminghe', label: 'yiminghe' }
      ],
      setFileOptions: (options: fileOptions[]) => {
        set((state) => {
          state.fileOptions = [...state.fileOptions, ...options]
        })
      },
      loading: false,
      fetchFileOptions: async () => {
        // set((state) => {
        //   state.loading = true
        // })
        // const delay = (ms: number) =>
        //   new Promise((resolve) => setTimeout(resolve, ms))
        // await delay(2000)
        // set((state) => {
        //   state.loading = false
        // })
      },
      ...createFileSlice(set)
    })),
    {
      name: 'chat-asset-store',
      version: 1
    }
  )
)

export const useFileStore = createSelectors(_useFileStore)
