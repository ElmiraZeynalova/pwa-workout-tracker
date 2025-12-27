type Props = {
    reps: string
    weight: string
    updateReps: (reps: string) => void
    updateWeight: (weight: string) => void
}
export default function SetForm({reps, weight, updateReps, updateWeight}: Props){


    return(
        <form className="set-form">
            <label>Reps:
                <input type="text" value={reps} onChange={(e) => updateReps(e.target.value)}/>
            </label>
            
            <label>Weight:
                <input type="text" value={weight} onChange={(e) => updateWeight(e.target.value)}/>
            </label>
        </form>        

        )
}