import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './utils'

type State = {
  count: number
}

type Actions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

const _useCountStore = create(
  immer<State & Actions>((set) => ({
    count: 0,
    increment: (qty: number) =>
      set((state) => {
        state.count += qty
      }),
    decrement: (qty: number) =>
      set((state) => {
        state.count -= qty
      })
  }))
)

export const useCountStore = createSelectors(_useCountStore)
