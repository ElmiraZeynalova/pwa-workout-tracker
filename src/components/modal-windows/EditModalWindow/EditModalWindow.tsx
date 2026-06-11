import styles from './EditModalWindow.module.css'
import * as Dialog from '@radix-ui/react-dialog';
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";

type Props = {
    showModal: boolean
    setShowModal: () => void
    btnText1: string
    btnText2: string
    handleDelete: () => void
    handleEdit: () => void
}

export default function EditModalWindow({showModal, setShowModal, btnText1, btnText2, handleDelete, handleEdit}: Props){
    return(
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} /> 
            <Dialog.Title></Dialog.Title>
            <Dialog.Content aria-describedby={undefined} className={styles.editExrcModal}>
                <div className={styles.modalActionBtns}>
                    <div className={styles.modalActionBtn} onClick={handleEdit}>
                        <RiEditLine size={20} color="#8e8e8e"/>
                        {btnText1}</div>
                    <div className={styles.modalActionBtn} onClick={handleDelete}>
                        <RiDeleteBinLine size={20} color="#8e8e8e"/>
                        {btnText2}</div>
                </div>
                <div className={styles.modalCancelBtn} onClick={setShowModal}>Cancel</div>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}