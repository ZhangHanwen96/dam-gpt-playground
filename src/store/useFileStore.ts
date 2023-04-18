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
  setselectedFiles: (opt: fileOptions[] | null | ((pre: fileOptions[]) => fileOptions[])) => void
  setFileOptions: (opt: fileOptions[] | null | ((pre: fileOptions[]) => fileOptions[])) => void
}


const _useFileStore = create(
  persist(
    immer<State & Actions>((set) => ({
      fileOptions: [],
      setFileOptions: (options: fileOptions[] | null | ((pre: fileOptions[]) => fileOptions[])) => {
        if(options === null) {
          set((state) => {
            state.fileOptions = []
          })
          return;
        }
        if(typeof options === 'function') {
          set((state) => {
            state.fileOptions = options(state.fileOptions)
          })
          return;
        }

        set((state) => {
          state.fileOptions = [...options]
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
      selectedFiles: undefined,
      setselectedFiles: (opt: fileOptions[] | null | ((opt: fileOptions[]) => fileOptions[])) => {
        if(opt === null) {
          set((state) => {
            state.selectedFiles = undefined
          })
          return;
        }
        if(typeof opt === 'function') {
          set((state) => {
            state.selectedFiles = opt(state.selectedFiles || [])
          })
          return;
        }
        // @ts-ignore
        set((state) => {
          state.selectedFiles = [...opt]
        })
      }
    })),
    {
      name: 'chat-asset-store',
      version: 1,
    }
  )
)


_useFileStore.setState({
  selectedFiles: undefined
})

export const useFileStore = createSelectors(_useFileStore)
