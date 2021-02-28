import { createContext } from "react";

interface IModalContext {
    updateMessage: any;
    setModal: any;
    shouldDismiss: any;
    message: string;
    dismissable: boolean;
    flashModal: boolean;
}

export const ModalContext = createContext<IModalContext>({
    dismissable: true,
    flashModal: false,
    message: "",
    shouldDismiss: () => {},
    updateMessage: () => {},
    setModal: () => {}
});