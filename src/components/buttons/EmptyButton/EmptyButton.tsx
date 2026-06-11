import styles from './EmptyButton.module.css'

type Props = {
    children: React.ReactNode
    handleClick: () => void
    className?: string
    size?: 'sm' | 'md'
}

export default function EmptyButton({children, handleClick, className, size = 'md'}: Props){
    return(
        <button className={`${styles.emptyBtn}  ${styles[size]} ${className ?? ''}`} onClick={(handleClick)}>{children}</button>
    )
}
