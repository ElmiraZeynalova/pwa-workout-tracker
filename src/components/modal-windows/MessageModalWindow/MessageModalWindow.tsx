import styles from './MessageModalWindow.module.css'
import * as Dialog from '@radix-ui/react-dialog';
import FilledButton from '../../buttons/FilledButton/FilledButton'

type Props = {
    showModal: boolean
    setShowModal: () => void
    text: string | undefined
}

export default function MessageModalWindow({showModal, setShowModal, text}: Props){
    return(
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay}/> 
            <Dialog.Title></Dialog.Title>
            <Dialog.Content aria-describedby={undefined} className={styles.messageModal}>
                <p>{text}</p>
                <FilledButton className={styles.ok} handleClick={setShowModal}>Ok</FilledButton>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>
    )
}
