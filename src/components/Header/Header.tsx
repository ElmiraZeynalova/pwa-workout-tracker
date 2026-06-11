import styles from './Header.module.css'
type Props = {
    title:  React.ReactNode
    leftButton?: React.ReactNode
    rightButton?: React.ReactNode
}

export default function Header({title, leftButton, rightButton}: Props){
    return(
        <header className={styles.header}>
            {leftButton}
            {title}
            {rightButton}
        </header>
    )
}
