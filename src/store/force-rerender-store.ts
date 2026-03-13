import { create } from 'zustand'


type RenderStore = {
    forceRerender: boolean,
    setForceRerender: () => void,

}

export const useForceRerenderStore = create<RenderStore>((set) => ({
   forceRerender:  false,
   setForceRerender: () => 
        set(state => ({forceRerender: !state.forceRerender}))
}))