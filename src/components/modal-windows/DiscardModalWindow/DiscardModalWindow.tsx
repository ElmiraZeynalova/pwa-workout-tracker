import * as Dialog from '@radix-ui/react-dialog';
import styles from './DiscardModalWindow.module.css'
import FilledButton from '../../buttons/FilledButton/FilledButton'

type Props = {
    showModal: boolean
    setShowModal: () => void
    handleDiscard: () => void
    message: string
    btnText: string
}

export default function DiscardModalWindow({showModal, setShowModal, handleDiscard, message, btnText}: Props){
    return(
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} /> 
            <Dialog.Title></Dialog.Title>
            <Dialog.Content aria-describedby={undefined} className={styles.discardModal}>
                    <p>{message}</p>
                    <FilledButton className={styles.discardBtn} handleClick={handleDiscard}>{btnText}</FilledButton>
                    <div className={styles.cancelBtn} onClick={setShowModal}>Cancel</div>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}