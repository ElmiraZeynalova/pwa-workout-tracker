import type { Exercise } from "../types";
import { apiClient } from "./client";

export async function getAllRoutines(){
    const {data} = await apiClient.get("/routines")
    return data
}

export async function getRoutine(routineId: string){
    const {data} = await apiClient.get(`/routines/${routineId}`)
    return data
}

export async function createOrUpdateRoutine(routineId: string, title: string, exercises: Exercise[]){
    const {data} = await apiClient.post("/routines", {routineId, title, exercises})
    return data
}

export async function deleteRoutine(routineId: string){
    const {data} = await apiClient.delete(`/routines/${routineId}`)
    return data
}

export async function getRoutineExercises(routineId: string){
    const {data} = await apiClient.get(`/routines/${routineId}/exercises`)
    return data
}