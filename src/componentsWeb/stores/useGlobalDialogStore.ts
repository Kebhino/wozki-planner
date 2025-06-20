import {create} from "zustand"

interface DialogStore { 

    idDoUsuniecia: string;
    setIdDoUsuniecia: (id:string) => void
    resetIdDoUsuniecia: () => void
}

export const useGlobalDialogStore = create<DialogStore>((set) => ({
    idDoUsuniecia: "",
    setIdDoUsuniecia: (id: string) => set({idDoUsuniecia: id }),
    resetIdDoUsuniecia: () => set({idDoUsuniecia: ""})
}))