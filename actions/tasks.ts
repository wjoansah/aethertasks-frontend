'use server'

import {revalidatePath} from 'next/cache'
import {Task} from '@/types'

let tasks: Task[] = []

export async function createTask(formData: FormData) {
    const task: Task = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        status: 'open',
        deadline: formData.get('deadline') as string,
        responsibility: formData.get('responsibility') as string,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/api/tasks`, {
        headers: new Headers({ 'Authorization': 'application/json' }),
        method: 'POST',
        body: JSON.stringify(task)
    })

    if (response.ok) {
        revalidatePath('/dashboard/tasks')
        return {success: true}
    }

    return {success: false}
}

export async function updateTaskStatus(taskId: string, status: 'completed', comment: string) {
    // const task = tasks.find(t => t.id === taskId)
    // if (task) {
    //     task.status = status
    //     task.completed_at = new Date().toISOString()
    //     task.user_comment = comment
    //     revalidatePath('/tasks')
    //     return {success: true}
    // }
    // return {success: false}
}

export async function getTasks(userId?: string) {
    if (userId) {
        return tasks.filter(task => task.responsibility === userId)
    }
    return tasks
}

