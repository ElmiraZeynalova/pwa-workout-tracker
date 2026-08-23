import {apiClient} from './client'
import type {Exercise} from '../types'

export async function getAllWorkouts(){
    const {data} = await apiClient.get("/workouts")
    return data
}

export async function getWorkout(workoutId: string){
    const {data} = await apiClient.get(`/workouts/${workoutId}`)
    return data
}

export async function createOrUpdateWorkout(workoutId:string, date: string, exercises: Exercise[]){
    const {data} = await apiClient.post("/workouts", {workoutId, date, exercises})
    return data
}

export async function deleteWorkout(workoutId: string){
    const {data} = await apiClient.delete(`/workouts/${workoutId}`)
    return data
}

export async function getWorkoutExercises(workoutId: string){
    const {data} = await apiClient.get(`/workouts/${workoutId}/exercises`)
    return data
}