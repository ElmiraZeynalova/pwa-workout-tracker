type Props = {
    reps: number | null
    weight?: number | null
    updateReps: (reps: number) => void
    updateWeight: (weight: number) => void
}
export default function SetForm({reps, weight, updateReps, updateWeight}: Props){

    return(
        <form className="set-form">
            <label>Reps:
                <input placeholder="0" value={reps || ''} type="number"  onChange={(e) => updateReps(Number(e.target.value))}/>
            </label>
            
            <label>Weight:
                <input placeholder="0" value={weight || ''} type="number"  onChange={(e) => updateWeight(Number(e.target.value))}/>
            </label>
        </form>        

        )
}