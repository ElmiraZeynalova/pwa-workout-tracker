import styles from './Button.module.css'

type Props = {
    children: React.ReactNode
    handleClick: () => void
    className?: string
    size?: 'sm' | 'md'
    fill: boolean
}

export default function Button({children, handleClick, size = 'md', className, fill = true}: Props){
    return(
        <button className={`${styles.button} ${fill ? styles.filledButton : styles.emptyButton} ${styles[size]} ${className ?? ''}`} onClick={(handleClick)}>{children}</button>
    )
}