import { createContext } from "react";

interface IModalContext {
    children: null | React.ReactNode;
    updateMessage: any;
    setChild(children?: React.ReactNode): void;
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
    children: null,
    setChild: () => {},
    shouldDismiss: () => {},
    updateMessage: () => {},
    setModal: () => {}
});