import type {Exercise} from '../store'

export default function LoggedExercise({exercise}: {exercise: Exercise}){
    const sets = exercise.sets.map((set, id) => (
        <tr key={id}>
            <td>{id + 1}</td>
            <td>{set.weight}kg x {set.reps} reps</td>
        </tr>
    ))
    return(
        <div className="logged-exercise-card">
            <p className="exercise-name">{exercise.exerciseName}</p>
            <table>
                <thead>
                    <tr>
                        <th scope="col">SET</th>
                        <th scope="col">WEIGHT & REPS</th>
                    </tr>
                </thead>
                <tbody>{sets}</tbody>
            </table>
        </div>
    )
}

