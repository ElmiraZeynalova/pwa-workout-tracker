import {useDateStore} from "../store"
import dayjs from 'dayjs'

export default function DateBar(){
    const selectedDate = useDateStore((state) => state.selectedDate)
    return(
        <div className="date-bar">
            <p>{dayjs(selectedDate).format('dddd, MMMM D')}</p>
        </div>
    )
}