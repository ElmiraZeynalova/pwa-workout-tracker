import { create } from 'zustand'


type RenderStore = {
    rerenderKey: number
    trigger: () => void
}

export const useForceRerenderStore = create<RenderStore>((set) => ({
    rerenderKey: 0,
    trigger: () =>
        set(state => ({ rerenderKey: state.rerenderKey + 1 }))
}))