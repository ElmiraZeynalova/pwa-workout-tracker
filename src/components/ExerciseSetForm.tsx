import { IoMdCheckmark } from "react-icons/io";
import clsx from 'clsx'
type Props = {
    idx: number
    checked: boolean
    onToggle: () => void
    reps: number | null
    weight?: number | null
    updateReps: (reps: number | null) => void
    updateWeight: (weight: number | null) => void
}
export default function ExerciseSetForm({idx, checked, onToggle, reps, weight, updateReps, updateWeight}: Props){

    return(
        <div className="set">
            {idx === 0 && <div className="set-headers">
                <p>SET</p>
                <p>KG</p>
                <p>REPS</p>
                <IoMdCheckmark size={20} color="#858585"/>
            </div>}
            <div className="set-form">
                <p style={{fontWeight: 500, marginLeft: 10}}>{idx + 1}</p>
                <input  placeholder="0" value={weight || ''} type="number"  onChange={(e) => updateWeight(Number(e.target.value))}/>
                <input  placeholder="0" value={reps || ''} type="number"  onChange={(e) => updateReps(Number(e.target.value))}/>
                <div className={clsx("checkbox", checked && "checked")} onClick={onToggle}>
                    {checked && <IoMdCheckmark size={16} color="white"/>}
                </div>
            </div>  
        </div>
      

        )
}