import type { ReactNode } from "react";

type Props = {
    heading: string
    element?: ReactNode
}

export default function Header({heading, element}: Props){
    return(
        <header>
            <h1>{heading}</h1>
            {element && <div>{element}</div>}
        </header>
    )
}