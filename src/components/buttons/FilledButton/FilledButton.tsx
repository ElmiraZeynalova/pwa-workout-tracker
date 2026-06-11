import styles from './FilledButton.module.css'

type Props = {
    children: React.ReactNode
    handleClick: () => void
    className?: string
    size?: 'sm' | 'md'
}

export default function FilledButton({children, handleClick, className, size = 'md'}: Props){
    return(
        <button className={`${styles.filledBtn} ${styles[size]} ${className ?? ''}`} onClick={(handleClick)}>{children}</button>
    )
}


